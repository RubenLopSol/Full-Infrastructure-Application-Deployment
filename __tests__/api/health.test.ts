// Mock Next.js server components
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data: any, options: any) => ({
      json: async () => data,
      status: options?.status || 200
    }))
  }
}))

// Mock process.uptime
const mockUptime = jest.fn(() => 123.45)
Object.defineProperty(process, 'uptime', {
  value: mockUptime
})

// Import after mocking
import { GET } from '../../app/api/health/route'

describe('/api/health', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.CURRENT_STAGE = '1'
    process.env.npm_package_version = '1.0.0'
  })

  afterEach(() => {
    delete process.env.CURRENT_STAGE
    delete process.env.npm_package_version
  })

  it('should return health check data with 200 status', async () => {
    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toMatchObject({
      status: 'ok',
      stage: '1',
      version: '1.0.0',
      uptime: 123.45
    })
    expect(data.timestamp).toBeDefined()
    expect(new Date(data.timestamp)).toBeInstanceOf(Date)
  })

  it('should use default values when env vars are not set', async () => {
    delete process.env.CURRENT_STAGE
    delete process.env.npm_package_version

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.stage).toBe('1')
    expect(data.version).toBe('1.0.0')
  })

  it('should handle different stage values', async () => {
    process.env.CURRENT_STAGE = '3'
    process.env.npm_package_version = '2.1.0'

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.stage).toBe('3')
    expect(data.version).toBe('2.1.0')
  })

  it('should return valid timestamp format', async () => {
    const response = await GET()
    const data = await response.json()

    expect(data.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
  })
})
