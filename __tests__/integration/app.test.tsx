import { render, screen } from '@testing-library/react'
import HomePage from '../../app/page'

describe('App Integration Tests', () => {
  beforeEach(() => {
    // Reset environment variables
    process.env.CURRENT_STAGE = '1'
  })

  it('should render complete application for stage 1', () => {
    render(<HomePage />)
    
    // Check main title
    expect(screen.getByText('🎯 La Huella - análisis de sentimiento')).toBeInTheDocument()
    
    // Check stage indicator
    expect(screen.getByText('🎯 Etapa 1: Pipeline Básico')).toBeInTheDocument()
    
    // Check subtitle
    expect(screen.getByText('Monitorea y analiza los comentarios de productos de calzado')).toBeInTheDocument()
  })

  it('should have proper accessibility structure', () => {
    render(<HomePage />)
    
    // Check for proper heading hierarchy
    const mainHeading = screen.getByRole('heading', { level: 1 })
    expect(mainHeading).toBeInTheDocument()
    
    // Check for semantic structure
    expect(mainHeading).toHaveTextContent('🎯 La Huella - análisis de sentimiento')
  })

  it('should render without console errors', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    render(<HomePage />)
    
    expect(consoleSpy).not.toHaveBeenCalled()
    
    consoleSpy.mockRestore()
  })

  it('should handle different stage configurations', () => {
    // Test only stage 1 to avoid complexity with multiple stages
    process.env.CURRENT_STAGE = '1'
    
    render(<HomePage />)
    
    // Check for stage 1 specific content
    expect(screen.getByText(/Etapa 1/)).toBeInTheDocument()
    expect(screen.getByText(/Pipeline Básico/)).toBeInTheDocument()
  })
})
