import { STATIC_PRODUCTS, STATIC_COMMENTS, STATIC_STATS } from '../../app/_lib/static-data'

describe('Static Data', () => {
  describe('STATIC_PRODUCTS', () => {
    it('should have correct structure', () => {
      expect(Array.isArray(STATIC_PRODUCTS)).toBe(true)
      expect(STATIC_PRODUCTS.length).toBeGreaterThan(0)
    })

    it('should have valid product data structure', () => {
      STATIC_PRODUCTS.forEach(product => {
        expect(product).toHaveProperty('id')
        expect(product).toHaveProperty('name')
        expect(product).toHaveProperty('rating')
        expect(product).toHaveProperty('commentCount')
        
        expect(typeof product.id).toBe('string')
        expect(typeof product.name).toBe('string')
        expect(typeof product.rating).toBe('number')
        expect(typeof product.commentCount).toBe('number')
      })
    })

    it('should have valid rating values', () => {
      STATIC_PRODUCTS.forEach(product => {
        expect(product.rating).toBeGreaterThanOrEqual(0)
        expect(product.rating).toBeLessThanOrEqual(5)
      })
    })

    it('should have positive comment counts', () => {
      STATIC_PRODUCTS.forEach(product => {
        expect(product.commentCount).toBeGreaterThan(0)
      })
    })
  })

  describe('STATIC_COMMENTS', () => {
    it('should have correct structure', () => {
      expect(Array.isArray(STATIC_COMMENTS)).toBe(true)
      expect(STATIC_COMMENTS.length).toBeGreaterThan(0)
    })

    it('should have valid comment data structure', () => {
      STATIC_COMMENTS.forEach(comment => {
        expect(comment).toHaveProperty('id')
        expect(comment).toHaveProperty('userName')
        expect(comment).toHaveProperty('content')
        expect(comment).toHaveProperty('rating')
        expect(comment).toHaveProperty('sentiment')
        
        expect(typeof comment.id).toBe('string')
        expect(typeof comment.userName).toBe('string')
        expect(typeof comment.content).toBe('string')
        expect(typeof comment.rating).toBe('number')
        expect(typeof comment.sentiment).toBe('string')
      })
    })

    it('should have valid rating values', () => {
      STATIC_COMMENTS.forEach(comment => {
        expect(comment.rating).toBeGreaterThanOrEqual(1)
        expect(comment.rating).toBeLessThanOrEqual(5)
      })
    })

    it('should have valid sentiment values', () => {
      const validSentiments = ['positive', 'negative', 'neutral']
      STATIC_COMMENTS.forEach(comment => {
        expect(validSentiments).toContain(comment.sentiment)
      })
    })

    it('should have non-empty content and usernames', () => {
      STATIC_COMMENTS.forEach(comment => {
        expect(comment.userName.trim()).not.toBe('')
        expect(comment.content.trim()).not.toBe('')
      })
    })
  })

  describe('STATIC_STATS', () => {
    it('should have correct structure', () => {
      expect(typeof STATIC_STATS).toBe('object')
      expect(STATIC_STATS).toHaveProperty('totalProducts')
      expect(STATIC_STATS).toHaveProperty('totalComments')
      expect(STATIC_STATS).toHaveProperty('averageRating')
      expect(STATIC_STATS).toHaveProperty('satisfactionIndex')
    })

    it('should have valid numeric values', () => {
      expect(typeof STATIC_STATS.totalProducts).toBe('number')
      expect(typeof STATIC_STATS.totalComments).toBe('number')
      expect(typeof STATIC_STATS.averageRating).toBe('number')
      expect(typeof STATIC_STATS.satisfactionIndex).toBe('number')
    })

    it('should have positive values', () => {
      expect(STATIC_STATS.totalProducts).toBeGreaterThan(0)
      expect(STATIC_STATS.totalComments).toBeGreaterThan(0)
      expect(STATIC_STATS.averageRating).toBeGreaterThan(0)
      expect(STATIC_STATS.satisfactionIndex).toBeGreaterThan(0)
    })

    it('should have valid rating range', () => {
      expect(STATIC_STATS.averageRating).toBeLessThanOrEqual(5)
    })

    it('should have valid satisfaction percentage', () => {
      expect(STATIC_STATS.satisfactionIndex).toBeLessThanOrEqual(100)
    })

    it('should match actual data counts', () => {
      expect(STATIC_STATS.totalProducts).toBe(STATIC_PRODUCTS.length)
    })
  })
})
