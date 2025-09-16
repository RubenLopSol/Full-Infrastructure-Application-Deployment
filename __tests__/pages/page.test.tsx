import { render, screen } from '@testing-library/react'
import HomePage from '../../app/page'

// Mock the static dashboard component
jest.mock('../../app/_components/static-dashboard', () => {
  return function MockStaticDashboard() {
    return <div data-testid="static-dashboard">Static Dashboard Component</div>
  }
})

// Mock the stages configuration
jest.mock('../../app/_config/stages', () => ({
  getCurrentStageConfig: jest.fn(() => ({
    number: 1,
    name: 'Pipeline Básico',
    description: 'Docker + GitHub Actions + Self-hosted Runner'
  })),
  isFeatureEnabled: jest.fn((feature: string) => {
    return feature === 'staticDashboard'
  })
}))

describe('HomePage', () => {
  beforeEach(() => {
    render(<HomePage />)
  })

  describe('Header Section', () => {
    it('should display main title', () => {
      expect(screen.getByText('🎯 La Huella - análisis de sentimiento')).toBeInTheDocument()
    })

    it('should display subtitle', () => {
      expect(screen.getByText('Monitorea y analiza los comentarios de productos de calzado')).toBeInTheDocument()
    })

    it('should display current stage information', () => {
      expect(screen.getByText('🎯 Etapa 1: Pipeline Básico')).toBeInTheDocument()
    })

    it('should have proper heading structure', () => {
      const mainTitle = screen.getByRole('heading', { level: 1 })
      expect(mainTitle).toHaveTextContent('🎯 La Huella - análisis de sentimiento')
      expect(mainTitle).toHaveClass('text-3xl', 'font-bold', 'text-gray-900')
    })
  })

  describe('Dashboard Rendering', () => {
    it('should render static dashboard when feature is enabled', () => {
      expect(screen.getByTestId('static-dashboard')).toBeInTheDocument()
    })

    it('should have proper layout structure', () => {
      const mainContainer = screen.getByText('🎯 La Huella - análisis de sentimiento').closest('.space-y-8')
      expect(mainContainer).toBeInTheDocument()
    })
  })

  describe('Stage Badge', () => {
    it('should display stage badge with correct styling', () => {
      const stageBadge = screen.getByText('🎯 Etapa 1: Pipeline Básico')
      expect(stageBadge).toHaveClass('px-3', 'py-1', 'bg-blue-100', 'text-blue-800', 'text-sm', 'rounded-full', 'inline-block')
    })
  })
})

describe('HomePage with different stage configurations', () => {
  it('should render static dashboard when feature is enabled (default behavior)', () => {
    // Since all current stages have staticDashboard enabled, test the positive case
    render(<HomePage />)
    
    expect(screen.getByTestId('static-dashboard')).toBeInTheDocument()
  })
})
