'use server'

import { dynamoDocClient, AWS_RESOURCES, isAWSAvailable } from '@/lib/aws-config'
import { ScanCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { DashboardData, SentimentStats, Comment, Product } from '@/_types'
import { calculateSentimentStats } from '@/lib/utils'
import { getFallbackDashboardData, getFallbackProducts, getFallbackComments } from '@/lib/fallback-data'
import { cache } from 'react'

// Cache para optimizar las consultas
export const getDashboardStats = cache(async (): Promise<DashboardData> => {
  try {
    // Verificar si AWS/LocalStack está disponible
    const awsAvailable = await isAWSAvailable()
    
    if (!awsAvailable) {
      console.warn('🔄 LocalStack no disponible, usando datos de fallback')
      return getFallbackDashboardData()
    }

    // Obtener estadísticas en paralelo desde LocalStack
    const [products, comments] = await Promise.all([
      getAllProducts(),
      getAllComments()
    ])

    // Calcular estadísticas de sentimiento
    const sentimentStats = calculateSentimentStats(comments)

    // Comentarios pendientes de procesamiento
    const pendingComments = comments.filter(c => !c.processed)

    // Comentarios recientes (últimos 10)
    const recentComments = comments
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)

    // Top productos por número de comentarios y sentimiento
    const productStats = products.map(product => {
      const productComments = comments.filter(c => c.productId === product.id)
      const productSentimentStats = calculateSentimentStats(productComments)
      const ratingsOnly = productComments.filter(c => c.rating && c.rating > 0)
      const averageRating = ratingsOnly.length > 0 
        ? ratingsOnly.reduce((sum, c) => sum + (c.rating || 0), 0) / ratingsOnly.length 
        : 0

      return {
        product,
        commentCount: productComments.length,
        averageSentiment: productSentimentStats.averageScore,
        averageRating: Math.round(averageRating * 10) / 10
      }
    })

    const topProducts = productStats
      .sort((a, b) => b.commentCount - a.commentCount)
      .slice(0, 5)

    return {
      totalProducts: products.length,
      totalComments: comments.length,
      pendingProcessing: pendingComments.length,
      sentimentStats,
      recentComments,
      topProducts
    }
  } catch (error) {
    console.error('Error obteniendo estadísticas del dashboard:', error)
    
    // Retornar datos por defecto en caso de error
    return {
      totalProducts: 0,
      totalComments: 0,
      pendingProcessing: 0,
      sentimentStats: {
        positive: 0,
        negative: 0,
        neutral: 0,
        positivePercentage: 0,
        negativePercentage: 0,
        neutralPercentage: 0,
        averageScore: 0,
        total: 0
      },
      recentComments: [],
      topProducts: []
    }
  }
})

export async function getAllProducts(): Promise<Product[]> {
  try {
    const command = new ScanCommand({
      TableName: AWS_RESOURCES.DYNAMODB_TABLES.PRODUCTS
    })

    const result = await dynamoDocClient.send(command)
    return (result.Items as Product[]) || []
  } catch (error) {
    console.error('Error obteniendo productos:', error)
    return []
  }
}

export async function getAllComments(): Promise<Comment[]> {
  try {
    const command = new ScanCommand({
      TableName: AWS_RESOURCES.DYNAMODB_TABLES.COMMENTS
    })

    const result = await dynamoDocClient.send(command)
    return (result.Items as Comment[]) || []
  } catch (error) {
    console.error('Error obteniendo comentarios:', error)
    return []
  }
}

export async function getCommentsByProduct(productId: string): Promise<Comment[]> {
  try {
    const command = new QueryCommand({
      TableName: AWS_RESOURCES.DYNAMODB_TABLES.COMMENTS,
      IndexName: 'ProductIndex',
      KeyConditionExpression: 'productId = :productId',
      ExpressionAttributeValues: {
        ':productId': productId
      },
      ScanIndexForward: false // Ordenar por fecha descendente
    })

    const result = await dynamoDocClient.send(command)
    return (result.Items as Comment[]) || []
  } catch (error) {
    console.error('Error obteniendo comentarios por producto:', error)
    return []
  }
}

export async function getProduct(productId: string): Promise<Product | null> {
  try {
    const command = new QueryCommand({
      TableName: AWS_RESOURCES.DYNAMODB_TABLES.PRODUCTS,
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: {
        ':id': productId
      }
    })

    const result = await dynamoDocClient.send(command)
    return (result.Items?.[0] as Product) || null
  } catch (error) {
    console.error('Error obteniendo producto:', error)
    return null
  }
}

// Función para obtener métricas de sentimiento por período
export async function getSentimentMetrics(
  startDate: string,
  endDate: string
): Promise<Array<{ date: string; positive: number; negative: number; neutral: number }>> {
  try {
    const comments = await getAllComments()
    
    // Filtrar comentarios por rango de fechas
    const filteredComments = comments.filter(comment => {
      const commentDate = new Date(comment.createdAt)
      return commentDate >= new Date(startDate) && commentDate <= new Date(endDate)
    })

    // Agrupar por fecha
    const groupedByDate = filteredComments.reduce((acc, comment) => {
      const date = comment.createdAt.split('T')[0] // Obtener solo la fecha
      if (!acc[date]) {
        acc[date] = { positive: 0, negative: 0, neutral: 0 }
      }
      
      if (comment.sentiment) {
        acc[date][comment.sentiment]++
      }
      
      return acc
    }, {} as Record<string, { positive: number; negative: number; neutral: number }>)

    // Convertir a array y ordenar por fecha
    return Object.entries(groupedByDate)
      .map(([date, metrics]) => ({ date, ...metrics }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  } catch (error) {
    console.error('Error obteniendo métricas de sentimiento:', error)
    return []
  }
}

// Función para verificar el estado de los servicios AWS
export async function checkAWSServices(): Promise<Record<string, boolean>> {
  const services = {
    dynamodb: false,
    s3: false,
    sqs: false,
    cloudwatch: false
  }

  try {
    // Test DynamoDB
    const dynamoCommand = new ScanCommand({
      TableName: AWS_RESOURCES.DYNAMODB_TABLES.PRODUCTS,
      Limit: 1
    })
    await dynamoDocClient.send(dynamoCommand)
    services.dynamodb = true
  } catch (error) {
    console.error('DynamoDB no disponible:', error)
  }

  try {
    // Test S3
    const { s3Client } = await import('@/lib/aws-config')
    const { ListBucketsCommand } = await import('@aws-sdk/client-s3')
    const s3Command = new ListBucketsCommand({})
    await s3Client.send(s3Command)
    services.s3 = true
  } catch (error) {
    console.error('S3 no disponible:', error)
  }

  try {
    // Test SQS
    const { sqsClient } = await import('@/lib/aws-config')
    const { ListQueuesCommand } = await import('@aws-sdk/client-sqs')
    const sqsCommand = new ListQueuesCommand({})
    await sqsClient.send(sqsCommand)
    services.sqs = true
  } catch (error) {
    console.error('SQS no disponible:', error)
  }

  try {
    // Verificar CloudWatch (usando métricas en lugar de logs)
    const { CloudWatchClient, ListMetricsCommand } = await import('@aws-sdk/client-cloudwatch')
    const cloudWatchClient = new CloudWatchClient({
      region: process.env.AWS_REGION || 'eu-west-1',
      endpoint: process.env.AWS_ENDPOINT_URL,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test'
      }
    })
    const cwCommand = new ListMetricsCommand({})
    await cloudWatchClient.send(cwCommand)
    services.cloudwatch = true
  } catch (error) {
    console.error('CloudWatch no disponible:', error)
  }

  return services
}
