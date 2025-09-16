// 🔄 DATOS DE FALLBACK PARA CUANDO LOCALSTACK NO ESTÁ DISPONIBLE
// Proporciona datos realistas para demostrar la funcionalidad GREEN

import { DashboardData, Comment, Product } from '@/_types'

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Zapatillas Running Pro',
    category: 'running',
    price: 129.99,
    description: 'Zapatillas de running profesionales con tecnología de amortiguación avanzada',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'prod-002',
    name: 'Botas de Cuero Premium',
    category: 'boots',
    price: 199.99,
    description: 'Botas de cuero genuino hechas a mano con acabado premium',
    createdAt: '2024-01-16T11:00:00Z',
    updatedAt: '2024-01-16T11:00:00Z'
  },
  {
    id: 'prod-003',
    name: 'Sandalias de Verano',
    category: 'sandals',
    price: 49.99,
    description: 'Sandalias cómodas para el verano con suela antideslizante',
    createdAt: '2024-01-17T12:00:00Z',
    updatedAt: '2024-01-17T12:00:00Z'
  },
  {
    id: 'prod-004',
    name: 'Zapatos de Oficina',
    category: 'formal',
    price: 89.99,
    description: 'Zapatos elegantes para uso profesional y oficina',
    createdAt: '2024-01-18T13:00:00Z',
    updatedAt: '2024-01-18T13:00:00Z'
  },
  {
    id: 'prod-005',
    name: 'Sneakers Urbanos',
    category: 'casual',
    price: 79.99,
    description: 'Sneakers modernos para uso diario en la ciudad',
    createdAt: '2024-01-19T14:00:00Z',
    updatedAt: '2024-01-19T14:00:00Z'
  }
]

export const FALLBACK_COMMENTS: Comment[] = [
  {
    id: 'comment-001',
    productId: 'prod-001',
    userId: 'user-001',
    userName: 'María González',
    comment: 'Excelentes zapatillas, muy cómodas para correr largas distancias.',
    rating: 5,
    sentiment: 'positive',
    sentimentScore: 0.85,
    processed: true,
    createdAt: '2024-08-13T10:30:00Z',
    updatedAt: '2024-08-13T10:30:00Z'
  },
  {
    id: 'comment-002',
    productId: 'prod-002',
    userId: 'user-002',
    userName: 'Carlos Ruiz',
    comment: 'Buena calidad pero algo caras para mi presupuesto.',
    rating: 4,
    sentiment: 'neutral',
    sentimentScore: 0.15,
    processed: true,
    createdAt: '2024-08-13T11:15:00Z',
    updatedAt: '2024-08-13T11:15:00Z'
  },
  {
    id: 'comment-003',
    productId: 'prod-003',
    userId: 'user-003',
    userName: 'Ana Martín',
    comment: 'No me gustaron nada, muy incómodas y se rompieron rápido.',
    rating: 2,
    sentiment: 'negative',
    sentimentScore: -0.7,
    processed: true,
    createdAt: '2024-08-13T12:00:00Z',
    updatedAt: '2024-08-13T12:00:00Z'
  },
  {
    id: 'comment-004',
    productId: 'prod-001',
    userId: 'user-004',
    userName: 'Luis Pérez',
    comment: 'Perfectas para correr, las recomiendo totalmente.',
    rating: 5,
    sentiment: 'positive',
    sentimentScore: 0.9,
    processed: true,
    createdAt: '2024-08-13T12:45:00Z',
    updatedAt: '2024-08-13T12:45:00Z'
  },
  {
    id: 'comment-005',
    productId: 'prod-005',
    userId: 'user-005',
    userName: 'Elena Sánchez',
    comment: 'Diseño bonito y bastante cómodas para el día a día.',
    rating: 4,
    sentiment: 'positive',
    sentimentScore: 0.6,
    processed: true,
    createdAt: '2024-08-13T13:20:00Z',
    updatedAt: '2024-08-13T13:20:00Z'
  },
  {
    id: 'comment-006',
    productId: 'prod-004',
    userId: 'user-006',
    userName: 'Roberto Silva',
    comment: 'Están bien pero esperaba mejor calidad por el precio.',
    rating: 3,
    sentiment: 'neutral',
    sentimentScore: 0.05,
    processed: true,
    createdAt: '2024-08-13T13:50:00Z',
    updatedAt: '2024-08-13T13:50:00Z'
  },
  {
    id: 'comment-007',
    productId: 'prod-002',
    userId: 'user-007',
    userName: 'Patricia López',
    comment: 'Excelente calidad del cuero, muy elegantes.',
    rating: 5,
    sentiment: 'positive',
    sentimentScore: 0.8,
    processed: true,
    createdAt: '2024-08-13T14:10:00Z',
    updatedAt: '2024-08-13T14:10:00Z'
  },
  {
    id: 'comment-008',
    productId: 'prod-003',
    userId: 'user-008',
    userName: 'Diego Morales',
    comment: 'Cómodas para el verano, buen precio.',
    rating: 4,
    sentiment: 'positive',
    sentimentScore: 0.5,
    processed: true,
    createdAt: '2024-08-13T14:25:00Z',
    updatedAt: '2024-08-13T14:25:00Z'
  },
  {
    id: 'comment-009',
    productId: 'prod-001',
    userId: 'user-009',
    userName: 'Carmen Vega',
    comment: 'Me dolieron los pies después de usarlas.',
    rating: 2,
    sentiment: 'negative',
    sentimentScore: -0.6,
    processed: false,
    createdAt: '2024-08-13T14:40:00Z',
    updatedAt: '2024-08-13T14:40:00Z'
  },
  {
    id: 'comment-010',
    productId: 'prod-005',
    userId: 'user-010',
    userName: 'Fernando Castro',
    comment: 'Muy buenos sneakers, estilo moderno y cómodos.',
    rating: 5,
    sentiment: 'positive',
    sentimentScore: 0.75,
    processed: false,
    createdAt: '2024-08-13T14:55:00Z',
    updatedAt: '2024-08-13T14:55:00Z'
  }
]

// Función para obtener datos de fallback cuando LocalStack no está disponible
export function getFallbackDashboardData(): DashboardData {
  return {
    totalProducts: FALLBACK_PRODUCTS.length,
    totalComments: FALLBACK_COMMENTS.length,
    pendingProcessing: FALLBACK_COMMENTS.filter(c => !c.processed).length,
    sentimentStats: {
      positive: FALLBACK_COMMENTS.filter(c => c.sentiment === 'positive').length,
      negative: FALLBACK_COMMENTS.filter(c => c.sentiment === 'negative').length,
      neutral: FALLBACK_COMMENTS.filter(c => c.sentiment === 'neutral').length,
      positivePercentage: Math.round((FALLBACK_COMMENTS.filter(c => c.sentiment === 'positive').length / FALLBACK_COMMENTS.length) * 100),
      negativePercentage: Math.round((FALLBACK_COMMENTS.filter(c => c.sentiment === 'negative').length / FALLBACK_COMMENTS.length) * 100),
      neutralPercentage: Math.round((FALLBACK_COMMENTS.filter(c => c.sentiment === 'neutral').length / FALLBACK_COMMENTS.length) * 100),
      averageScore: Number((FALLBACK_COMMENTS.reduce((sum, c) => sum + (c.sentimentScore || 0), 0) / FALLBACK_COMMENTS.length).toFixed(2)),
      total: FALLBACK_COMMENTS.length
    },
    recentComments: FALLBACK_COMMENTS
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5),
    topProducts: FALLBACK_PRODUCTS.map(product => {
      const productComments = FALLBACK_COMMENTS.filter(c => c.productId === product.id)
      const ratingsOnly = productComments.filter(c => c.rating && c.rating > 0)
      const averageRating = ratingsOnly.length > 0 
        ? ratingsOnly.reduce((sum, c) => sum + (c.rating || 0), 0) / ratingsOnly.length 
        : 0
      const avgSentiment = productComments.length > 0
        ? productComments.reduce((sum, c) => sum + (c.sentimentScore || 0), 0) / productComments.length
        : 0

      return {
        product,
        commentCount: productComments.length,
        averageSentiment: Number(avgSentiment.toFixed(2)),
        averageRating: Number(averageRating.toFixed(1))
      }
    }).sort((a, b) => b.commentCount - a.commentCount).slice(0, 5)
  }
}

export function getFallbackProducts(): Product[] {
  return FALLBACK_PRODUCTS
}

export function getFallbackComments(): Comment[] {
  return FALLBACK_COMMENTS
}
