import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

export function getSentimentColor(sentiment: string): string {
  switch (sentiment.toLowerCase()) {
    case 'positive':
      return 'text-green-600 bg-green-50 border-green-200'
    case 'negative':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'neutral':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export function getSentimentLabel(sentiment: string): string {
  switch (sentiment.toLowerCase()) {
    case 'positive':
      return 'Positivo'
    case 'negative':
      return 'Negativo'
    case 'neutral':
      return 'Neutral'
    default:
      return 'Desconocido'
  }
}

export function truncateText(text: string | undefined | null, maxLength: number): string {
  if (!text || typeof text !== 'string') return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function calculateSentimentStats(comments: any[]) {
  const total = comments.length
  if (total === 0) {
    return {
      positive: 0,
      negative: 0,
      neutral: 0,
      total: 0,
      positivePercentage: 0,
      negativePercentage: 0,
      neutralPercentage: 0,
      averageScore: 0,
    }
  }

  const positive = comments.filter(c => c.sentiment === 'positive').length
  const negative = comments.filter(c => c.sentiment === 'negative').length
  const neutral = comments.filter(c => c.sentiment === 'neutral').length

  const averageScore = comments.reduce((sum, c) => sum + (c.sentimentScore || 0), 0) / total

  return {
    positive,
    negative,
    neutral,
    total,
    positivePercentage: Math.round((positive / total) * 100),
    negativePercentage: Math.round((negative / total) * 100),
    neutralPercentage: Math.round((neutral / total) * 100),
    averageScore: Math.round(averageScore * 100) / 100,
  }
}
