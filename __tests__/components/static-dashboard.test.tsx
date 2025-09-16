import { render, screen } from '@testing-library/react'
import StaticDashboard from '../../app/_components/static-dashboard'
import { STATIC_PRODUCTS, STATIC_COMMENTS, STATIC_STATS } from '../../app/_lib/static-data'

describe('StaticDashboard', () => {
  beforeEach(() => {
    render(<StaticDashboard />)
  })

  describe('Statistics Cards', () => {
    it('should display all statistics cards', () => {
      expect(screen.getByText('Total Productos')).toBeInTheDocument()
      expect(screen.getByText('Total Comentarios')).toBeInTheDocument()
      expect(screen.getByText('Rating Promedio')).toBeInTheDocument()
      expect(screen.getByText('Satisfacción')).toBeInTheDocument()
    })

    it('should display correct statistics values', () => {
      expect(screen.getByText(STATIC_STATS.totalProducts.toString())).toBeInTheDocument()
      expect(screen.getByText(STATIC_STATS.totalComments.toString())).toBeInTheDocument()
      expect(screen.getByText(`${STATIC_STATS.averageRating}/5.0`)).toBeInTheDocument()
      expect(screen.getByText(`${STATIC_STATS.satisfactionIndex}%`)).toBeInTheDocument()
    })
  })

  describe('Top Products Section', () => {
    it('should display top products header', () => {
      expect(screen.getByText('Top Productos')).toBeInTheDocument()
    })

    it('should display all products', () => {
      STATIC_PRODUCTS.forEach(product => {
        expect(screen.getByText(product.name)).toBeInTheDocument()
        expect(screen.getByText(`${product.commentCount} comentarios`)).toBeInTheDocument()
        expect(screen.getByText(`⭐ ${product.rating}`)).toBeInTheDocument()
      })
    })

    it('should render correct number of products', () => {
      const productElements = screen.getAllByText(/comentarios/)
      expect(productElements).toHaveLength(STATIC_PRODUCTS.length)
    })
  })

  describe('Recent Comments Section', () => {
    it('should display recent comments header', () => {
      expect(screen.getByText('Comentarios Recientes')).toBeInTheDocument()
    })

    it('should display all comments', () => {
      STATIC_COMMENTS.forEach(comment => {
        expect(screen.getByText(comment.userName)).toBeInTheDocument()
        expect(screen.getByText(comment.content)).toBeInTheDocument()
      })
      
      // Check that all comment ratings are present (but don't check exact text due to duplicates)
      const ratingElements = screen.getAllByText(/⭐ [1-5]/)
      expect(ratingElements.length).toBeGreaterThanOrEqual(STATIC_COMMENTS.length)
    })

    it('should display sentiment badges with correct colors', () => {
      const positiveElements = screen.getAllByText('positive')
      const neutralElements = screen.getAllByText('neutral')
      const negativeElements = screen.getAllByText('negative')

      positiveElements.forEach(element => {
        expect(element).toHaveClass('bg-green-100', 'text-green-800')
      })

      neutralElements.forEach(element => {
        expect(element).toHaveClass('bg-gray-100', 'text-gray-800')
      })

      negativeElements.forEach(element => {
        expect(element).toHaveClass('bg-red-100', 'text-red-800')
      })
    })

    it('should render correct number of comments', () => {
      const commentElements = screen.getAllByText(/⭐ [1-5]/)
      expect(commentElements).toHaveLength(STATIC_COMMENTS.length + STATIC_PRODUCTS.length)
    })
  })

  describe('Layout and Structure', () => {
    it('should have proper spacing classes', () => {
      const mainContainer = screen.getByText('Top Productos').closest('.space-y-8')
      expect(mainContainer).toBeInTheDocument()
    })

    it('should have responsive grid for statistics', () => {
      const statsContainer = screen.getByText('Total Productos').closest('.grid')
      expect(statsContainer).toHaveClass('grid-cols-1', 'md:grid-cols-4')
    })
  })
})
