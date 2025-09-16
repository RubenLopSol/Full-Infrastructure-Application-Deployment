import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { S3Client } from '@aws-sdk/client-s3'
import { SQSClient } from '@aws-sdk/client-sqs'
import { CloudWatchLogsClient } from '@aws-sdk/client-cloudwatch-logs'

// Configuración común para LocalStack
const commonConfig = {
  region: process.env.AWS_REGION || 'eu-west-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
  },
  ...(process.env.AWS_ENDPOINT_URL && {
    endpoint: process.env.AWS_ENDPOINT_URL,
    forcePathStyle: true, // Necesario para S3 con LocalStack
  }),
}

// Cliente DynamoDB
const dynamoClient = new DynamoDBClient(commonConfig)
export const dynamoDocClient = DynamoDBDocumentClient.from(dynamoClient)

// Cliente S3
export const s3Client = new S3Client(commonConfig)

// Cliente SQS
export const sqsClient = new SQSClient(commonConfig)

// Cliente CloudWatch Logs
export const cloudWatchClient = new CloudWatchLogsClient(commonConfig)

// Nombres de recursos (desde variables de entorno)
export const AWS_RESOURCES = {
  DYNAMODB_TABLES: {
    COMMENTS: process.env.DYNAMODB_TABLE_COMMENTS || 'la-huella-comments',
    PRODUCTS: process.env.DYNAMODB_TABLE_PRODUCTS || 'la-huella-products',
    ANALYTICS: process.env.DYNAMODB_TABLE_ANALYTICS || 'la-huella-analytics',
  },
  S3_BUCKETS: {
    REPORTS: process.env.S3_BUCKET_REPORTS || 'la-huella-sentiment-reports',
    UPLOADS: process.env.S3_BUCKET_UPLOADS || 'la-huella-uploads',
  },
  SQS_QUEUES: {
    PROCESSING: process.env.SQS_QUEUE_PROCESSING || 'la-huella-processing-queue',
    NOTIFICATIONS: process.env.SQS_QUEUE_NOTIFICATIONS || 'la-huella-notifications-queue',
  },
  CLOUDWATCH: {
    LOG_GROUP: process.env.CLOUDWATCH_LOG_GROUP || '/la-huella/sentiment-analysis',
  },
}

// Función para obtener la URL de la cola SQS
export async function getQueueUrl(queueName: string): Promise<string> {
  if (process.env.AWS_ENDPOINT_URL) {
    // Para LocalStack, construir la URL manualmente
    return `${process.env.AWS_ENDPOINT_URL}/000000000000/${queueName}`
  }
  
  // Para AWS real, usar GetQueueUrl
  const { GetQueueUrlCommand } = await import('@aws-sdk/client-sqs')
  const command = new GetQueueUrlCommand({ QueueName: queueName })
  const response = await sqsClient.send(command)
  return response.QueueUrl!
}

// Función para verificar la conectividad con LocalStack
export async function checkAWSConnection(): Promise<boolean> {
  try {
    // Intentar listar tablas de DynamoDB como test de conectividad
    const { ListTablesCommand } = await import('@aws-sdk/client-dynamodb')
    const command = new ListTablesCommand({})
    await Promise.race([
      dynamoClient.send(command),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
    ])
    return true
  } catch (error) {
    console.warn('LocalStack no disponible, usando modo fallback:', error)
    return false
  }
}

// Variable global para cachear el estado de conectividad
let awsConnectionStatus: boolean | null = null
let lastConnectionCheck = 0
const CONNECTION_CACHE_TTL = 30000 // 30 segundos

export async function isAWSAvailable(): Promise<boolean> {
  const now = Date.now()
  
  // Usar cache si es reciente
  if (awsConnectionStatus !== null && (now - lastConnectionCheck) < CONNECTION_CACHE_TTL) {
    return awsConnectionStatus
  }
  
  // Verificar conectividad
  awsConnectionStatus = await checkAWSConnection()
  lastConnectionCheck = now
  
  return awsConnectionStatus
}

// Función para logging en CloudWatch (si está disponible)
export async function logToCloudWatch(
  logGroupName: string,
  logStreamName: string,
  message: string
): Promise<void> {
  try {
    const { 
      CreateLogStreamCommand, 
      PutLogEventsCommand 
    } = await import('@aws-sdk/client-cloudwatch-logs')
    
    // Crear stream si no existe
    try {
      const createStreamCommand = new CreateLogStreamCommand({
        logGroupName,
        logStreamName,
      })
      await cloudWatchClient.send(createStreamCommand)
    } catch (error) {
      // Stream ya existe, continuar
    }

    // Enviar log
    const putLogCommand = new PutLogEventsCommand({
      logGroupName,
      logStreamName,
      logEvents: [
        {
          timestamp: Date.now(),
          message: JSON.stringify({
            timestamp: new Date().toISOString(),
            message,
            service: 'la-huella-sentiment',
          }),
        },
      ],
    })
    
    await cloudWatchClient.send(putLogCommand)
  } catch (error) {
    console.error('Error enviando log a CloudWatch:', error)
  }
}
