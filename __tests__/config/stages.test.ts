import {
  getCurrentStageConfig,
  isFeatureEnabled,
  isServiceEnabled,
  isUIEnabled,
  STAGE_CONFIGS,
  type StageNumber
} from '../../app/_config/stages'

describe('Stage Configuration', () => {
  const originalEnv = process.env.CURRENT_STAGE

  afterEach(() => {
    process.env.CURRENT_STAGE = originalEnv
  })

  describe('getCurrentStageConfig', () => {
    it('should return stage 1 config by default', () => {
      delete process.env.CURRENT_STAGE
      const config = getCurrentStageConfig()
      expect(config.number).toBe(1)
      expect(config.name).toBe('Pipeline Básico')
    })

    it('should return correct config for each stage', () => {
      const stages: StageNumber[] = [1, 2, 3, 4, 5]
      
      stages.forEach(stage => {
        process.env.CURRENT_STAGE = stage.toString()
        const config = getCurrentStageConfig()
        expect(config.number).toBe(stage)
        expect(config).toEqual(STAGE_CONFIGS[stage])
      })
    })

    it('should fallback to stage 1 for invalid stage numbers', () => {
      process.env.CURRENT_STAGE = '999'
      const config = getCurrentStageConfig()
      expect(config.number).toBe(1)
    })
  })

  describe('isFeatureEnabled', () => {
    it('should return correct feature status for stage 1', () => {
      process.env.CURRENT_STAGE = '1'
      expect(isFeatureEnabled('staticDashboard')).toBe(true)
      expect(isFeatureEnabled('localstack')).toBe(false)
      expect(isFeatureEnabled('dockerCompose')).toBe(false)
    })

    it('should return correct feature status for stage 3', () => {
      process.env.CURRENT_STAGE = '3'
      expect(isFeatureEnabled('staticDashboard')).toBe(false)
      expect(isFeatureEnabled('localstack')).toBe(true)
      expect(isFeatureEnabled('dockerCompose')).toBe(true)
    })
  })

  describe('isServiceEnabled', () => {
    it('should return correct service status for stage 1', () => {
      process.env.CURRENT_STAGE = '1'
      expect(isServiceEnabled('dynamodb')).toBe(false)
      expect(isServiceEnabled('s3')).toBe(false)
    })

    it('should return correct service status for stage 2', () => {
      process.env.CURRENT_STAGE = '2'
      expect(isServiceEnabled('dynamodb')).toBe(true)
      expect(isServiceEnabled('s3')).toBe(true)
      expect(isServiceEnabled('cloudwatch')).toBe(false)
    })
  })

  describe('isUIEnabled', () => {
    it('should return correct UI status for stage 1', () => {
      process.env.CURRENT_STAGE = '1'
      expect(isUIEnabled('showAdvancedMetrics')).toBe(false)
      expect(isUIEnabled('showSystemStatus')).toBe(false)
    })

    it('should return correct UI status for stage 4', () => {
      process.env.CURRENT_STAGE = '4'
      expect(isUIEnabled('showAdvancedMetrics')).toBe(true)
      expect(isUIEnabled('showEnvironmentSelector')).toBe(true)
    })
  })

  describe('STAGE_CONFIGS', () => {
    it('should have all required stages', () => {
      expect(Object.keys(STAGE_CONFIGS)).toHaveLength(5)
      expect(STAGE_CONFIGS[1]).toBeDefined()
      expect(STAGE_CONFIGS[5]).toBeDefined()
    })

    it('should have consistent structure for all stages', () => {
      Object.values(STAGE_CONFIGS).forEach(config => {
        expect(config).toHaveProperty('number')
        expect(config).toHaveProperty('name')
        expect(config).toHaveProperty('description')
        expect(config).toHaveProperty('features')
        expect(config).toHaveProperty('services')
        expect(config).toHaveProperty('ui')
      })
    })
  })
})
