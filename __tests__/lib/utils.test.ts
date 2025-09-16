import {
  cn,
  formatDate,
  formatCurrency,
  getSentimentColor,
  getSentimentLabel,
  truncateText,
  generateId,
  sleep,
  debounce,
  isValidEmail,
  calculateSentimentStats
} from '../../app/_lib/utils'

describe('Utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('px-2', 'py-1')).toBe('px-2 py-1')
      expect(cn('px-2', 'px-4')).toBe('px-4')
      expect(cn('text-red-500', { 'text-blue-500': true })).toBe('text-blue-500')
    })
  })

  describe('formatDate', () => {
    it('should format date strings correctly', () => {
      const date = '2024-01-15T10:30:00Z'
      const formatted = formatDate(date)
      expect(formatted).toContain('2024')
      expect(formatted).toContain('enero')
    })

    it('should format Date objects correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z')
      const formatted = formatDate(date)
      expect(formatted).toContain('2024')
    })
  })

  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      const result1 = formatCurrency(29.99)
      const result2 = formatCurrency(1000)
      
      expect(result1).toContain('29,99')
      expect(result1).toContain('€')
      expect(result2).toContain('€')
      // Spanish locale uses different thousand separators, so just check it's formatted
      expect(typeof result2).toBe('string')
      expect(result2.length).toBeGreaterThan(5)
    })
  })

  describe('getSentimentColor', () => {
    it('should return correct colors for sentiments', () => {
      expect(getSentimentColor('positive')).toBe('text-green-600 bg-green-50 border-green-200')
      expect(getSentimentColor('negative')).toBe('text-red-600 bg-red-50 border-red-200')
      expect(getSentimentColor('neutral')).toBe('text-yellow-600 bg-yellow-50 border-yellow-200')
      expect(getSentimentColor('unknown')).toBe('text-gray-600 bg-gray-50 border-gray-200')
    })

    it('should handle case insensitive input', () => {
      expect(getSentimentColor('POSITIVE')).toBe('text-green-600 bg-green-50 border-green-200')
      expect(getSentimentColor('Negative')).toBe('text-red-600 bg-red-50 border-red-200')
    })
  })

  describe('getSentimentLabel', () => {
    it('should return correct Spanish labels', () => {
      expect(getSentimentLabel('positive')).toBe('Positivo')
      expect(getSentimentLabel('negative')).toBe('Negativo')
      expect(getSentimentLabel('neutral')).toBe('Neutral')
      expect(getSentimentLabel('unknown')).toBe('Desconocido')
    })

    it('should handle case insensitive input', () => {
      expect(getSentimentLabel('POSITIVE')).toBe('Positivo')
      expect(getSentimentLabel('Negative')).toBe('Negativo')
    })
  })

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const longText = 'This is a very long text that should be truncated'
      expect(truncateText(longText, 10)).toBe('This is a ...')
    })

    it('should return original text if shorter than maxLength', () => {
      const shortText = 'Short'
      expect(truncateText(shortText, 10)).toBe('Short')
    })

    it('should handle null and undefined', () => {
      expect(truncateText(null, 10)).toBe('')
      expect(truncateText(undefined, 10)).toBe('')
    })

    it('should handle non-string input', () => {
      expect(truncateText(123 as any, 10)).toBe('')
    })
  })

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
      expect(typeof id1).toBe('string')
      expect(id1.length).toBeGreaterThan(0)
    })
  })

  describe('sleep', () => {
    it('should return a promise', () => {
      const promise = sleep(10)
      expect(promise).toBeInstanceOf(Promise)
    })
  })

  describe('debounce', () => {
    jest.useFakeTimers()

    it('should debounce function calls', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('test1')
      debouncedFn('test2')
      debouncedFn('test3')

      expect(mockFn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith('test3')
    })

    afterEach(() => {
      jest.clearAllTimers()
    })
  })

  describe('isValidEmail', () => {
    it('should validate correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
      expect(isValidEmail('test+tag@example.org')).toBe(true)
    })

    it('should reject invalid emails', () => {
      expect(isValidEmail('invalid-email')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
      expect(isValidEmail('test@.com')).toBe(false)
      expect(isValidEmail('')).toBe(false)
    })
  })

  describe('calculateSentimentStats', () => {
    const mockComments = [
      { sentiment: 'positive', sentimentScore: 0.8 },
      { sentiment: 'positive', sentimentScore: 0.9 },
      { sentiment: 'negative', sentimentScore: 0.2 },
      { sentiment: 'neutral', sentimentScore: 0.5 },
      { sentiment: 'neutral', sentimentScore: 0.6 }
    ]

    it('should calculate sentiment statistics correctly', () => {
      const stats = calculateSentimentStats(mockComments)
      
      expect(stats.total).toBe(5)
      expect(stats.positive).toBe(2)
      expect(stats.negative).toBe(1)
      expect(stats.neutral).toBe(2)
      expect(stats.positivePercentage).toBe(40)
      expect(stats.negativePercentage).toBe(20)
      expect(stats.neutralPercentage).toBe(40)
      expect(stats.averageScore).toBe(0.6)
    })

    it('should handle empty comments array', () => {
      const stats = calculateSentimentStats([])
      
      expect(stats.total).toBe(0)
      expect(stats.positive).toBe(0)
      expect(stats.negative).toBe(0)
      expect(stats.neutral).toBe(0)
      expect(stats.positivePercentage).toBe(0)
      expect(stats.negativePercentage).toBe(0)
      expect(stats.neutralPercentage).toBe(0)
      expect(stats.averageScore).toBe(0)
    })

    it('should handle comments without sentimentScore', () => {
      const commentsWithoutScore = [
        { sentiment: 'positive' },
        { sentiment: 'negative' }
      ]
      
      const stats = calculateSentimentStats(commentsWithoutScore)
      expect(stats.averageScore).toBe(0)
    })
  })
})
