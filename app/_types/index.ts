// Tipos para el sistema de análisis de sentimiento de La Huella

export interface Product {
  id: string
  name: string
  category: string
  price: number
  description: string
  imageUrl?: string
  createdAt: string
  updatedAt?: string
}

export interface Comment {
  id: string
  productId: string
  userId?: string
  userName: string
  comment: string
  sentiment?: 'positive' | 'negative' | 'neutral'
  sentimentScore?: number
  score?: number
  rating?: number
  createdAt: string
  updatedAt?: string
  processed?: boolean
  moderationStatus?: 'approved' | 'rejected' | 'pending'
}

export interface SentimentAnalysis {
  id: string
  commentId: string
  sentiment: 'positive' | 'negative' | 'neutral'
  score: number
  confidence: number
  keywords: string[]
  processedAt: string
  model: string
  version: string
}

export interface Analytics {
  id: string
  date: string
  productId?: string
  totalComments: number
  positiveComments: number
  negativeComments: number
  neutralComments: number
  averageSentiment: number
  averageRating: number
  topKeywords: string[]
  createdAt: string
}

export interface SentimentStats {
  positive: number
  negative: number
  neutral: number
  positivePercentage: number
  negativePercentage: number
  neutralPercentage: number
  averageScore: number
  total: number
}

export interface DashboardData {
  totalProducts: number
  totalComments: number
  pendingProcessing: number
  sentimentStats: SentimentStats
  recentComments: Comment[]
  topProducts: Array<{
    product: Product
    commentCount: number
    averageSentiment: number
    averageRating: number
  }>
}

export interface ProcessingJob {
  id: string
  type: 'sentiment_analysis' | 'batch_processing' | 'report_generation'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  payload: any
  createdAt: string
  startedAt?: string
  completedAt?: string
  error?: string
  progress?: number
}

export interface Report {
  id: string
  name: string
  type: 'daily' | 'weekly' | 'monthly' | 'custom'
  dateRange: {
    start: string
    end: string
  }
  filters?: {
    productIds?: string[]
    categories?: string[]
    sentiments?: string[]
  }
  data: any
  fileUrl?: string
  createdAt: string
  generatedBy: string
}

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Tipos para formularios
export interface CreateCommentForm {
  productId: string
  userName: string
  comment: string
  rating: number
}

export interface CreateProductForm {
  name: string
  category: string
  price: number
  description: string
  imageUrl?: string
}

export interface FilterOptions {
  category?: string
  sentiment?: string
  dateRange?: {
    start: string
    end: string
  }
  rating?: {
    min: number
    max: number
  }
}

// Tipos para configuración
export interface AppConfig {
  sentimentThreshold: number
  batchSize: number
  enableRealTimeProcessing: boolean
  enableNotifications: boolean
  retentionDays: number
}

// Tipos para métricas y monitoreo
export interface HealthCheck {
  service: string
  status: 'healthy' | 'unhealthy' | 'degraded'
  timestamp: string
  details?: any
}

export interface SystemMetrics {
  timestamp: string
  cpu: number
  memory: number
  disk: number
  activeConnections: number
  queueSize: number
  processingRate: number
}

// Tipos para eventos del sistema
export interface SystemEvent {
  id: string
  type: 'comment_created' | 'sentiment_processed' | 'report_generated' | 'error_occurred'
  source: string
  data: any
  timestamp: string
  severity: 'info' | 'warning' | 'error' | 'critical'
}

// Tipos para autenticación (para etapas avanzadas)
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'analyst' | 'viewer'
  createdAt: string
  lastLogin?: string
}

export interface Session {
  user: User
  token: string
  expiresAt: string
}

// Constantes útiles
export const SENTIMENT_LABELS = {
  positive: 'Positivo',
  negative: 'Negativo',
  neutral: 'Neutral',
} as const

export const PRODUCT_CATEGORIES = [
  'running',
  'hiking',
  'casual',
  'formal',
  'sports',
  'boots',
  'sandals',
] as const

export const RATING_LABELS = {
  1: 'Muy malo',
  2: 'Malo',
  3: 'Regular',
  4: 'Bueno',
  5: 'Excelente',
} as const
