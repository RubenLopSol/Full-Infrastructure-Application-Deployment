// 🎯 CONFIGURACIÓN DE ETAPAS - MISIÓN DEVOPS V3
// Sistema progresivo que activa funcionalidades según la etapa actual

export type StageNumber = 1 | 2 | 3 | 4 | 5;

export interface StageConfig {
  number: StageNumber;
  name: string;
  description: string;
  features: {
    staticDashboard: boolean;
    localstack: boolean;
    dockerCompose: boolean;
    multiEnvironment: boolean;
    monitoring: boolean;
    documentation: boolean;
  };
  services: {
    dynamodb: boolean;
    s3: boolean;
    sqs: boolean;
    cloudwatch: boolean;
  };
  ui: {
    showAdvancedMetrics: boolean;
    showSystemStatus: boolean;
    showEnvironmentSelector: boolean;
    showMonitoring: boolean;
  };
}

// 📊 CONFIGURACIÓN POR ETAPAS
export const STAGE_CONFIGS: Record<StageNumber, StageConfig> = {
  1: {
    number: 1,
    name: "Pipeline Básico",
    description: "Docker + GitHub Actions + Self-hosted Runner",
    features: {
      staticDashboard: true,
      localstack: false,
      dockerCompose: false,
      multiEnvironment: false,
      monitoring: false,
      documentation: false,
    },
    services: {
      dynamodb: false,
      s3: false,
      sqs: false,
      cloudwatch: false,
    },
    ui: {
      showAdvancedMetrics: false,
      showSystemStatus: false,
      showEnvironmentSelector: false,
      showMonitoring: false,
    },
  },
  2: {
    number: 2,
    name: "Integración LocalStack",
    description: "Servicios AWS locales + Datos dinámicos",
    features: {
      staticDashboard: false,
      localstack: true,
      dockerCompose: false,
      multiEnvironment: false,
      monitoring: false,
      documentation: false,
    },
    services: {
      dynamodb: true,
      s3: true,
      sqs: true,
      cloudwatch: false,
    },
    ui: {
      showAdvancedMetrics: true,
      showSystemStatus: true,
      showEnvironmentSelector: false,
      showMonitoring: false,
    },
  },
  3: {
    number: 3,
    name: "Docker Compose",
    description: "Orquestación completa de servicios",
    features: {
      staticDashboard: false,
      localstack: true,
      dockerCompose: true,
      multiEnvironment: false,
      monitoring: false,
      documentation: false,
    },
    services: {
      dynamodb: true,
      s3: true,
      sqs: true,
      cloudwatch: true,
    },
    ui: {
      showAdvancedMetrics: true,
      showSystemStatus: true,
      showEnvironmentSelector: false,
      showMonitoring: true,
    },
  },
  4: {
    number: 4,
    name: "Pipeline Avanzado",
    description: "Múltiples entornos + Rollback automático",
    features: {
      staticDashboard: false,
      localstack: true,
      dockerCompose: true,
      multiEnvironment: true,
      monitoring: true,
      documentation: false,
    },
    services: {
      dynamodb: true,
      s3: true,
      sqs: true,
      cloudwatch: true,
    },
    ui: {
      showAdvancedMetrics: true,
      showSystemStatus: true,
      showEnvironmentSelector: true,
      showMonitoring: true,
    },
  },
  5: {
    number: 5,
    name: "Documentación",
    description: "Documentación técnica + Diagramas",
    features: {
      staticDashboard: false,
      localstack: true,
      dockerCompose: true,
      multiEnvironment: true,
      monitoring: true,
      documentation: true,
    },
    services: {
      dynamodb: true,
      s3: true,
      sqs: true,
      cloudwatch: true,
    },
    ui: {
      showAdvancedMetrics: true,
      showSystemStatus: true,
      showEnvironmentSelector: true,
      showMonitoring: true,
    },
  },
};

// 🎯 OBTENER CONFIGURACIÓN ACTUAL
export function getCurrentStageConfig(): StageConfig {
  // Leemos directamente del proceso cada vez - sin cache en desarrollo
  const currentEnvValue = process.env.CURRENT_STAGE;
  const stageNumber = (parseInt(currentEnvValue || '1') as StageNumber);
  
  // Log detallado para debugging
  if (process.env.NODE_ENV === 'development') {
    console.log("🔍 getCurrentStageConfig DEBUG:");
    console.log("  - Raw env value:", currentEnvValue);
    console.log("  - Parsed stage:", stageNumber);
    console.log("  - NODE_ENV:", process.env.NODE_ENV);
    console.log("  - Available stages:", Object.keys(STAGE_CONFIGS));
  }
  
  const config = STAGE_CONFIGS[stageNumber] || STAGE_CONFIGS[1];
  console.log("📊 Using stage config:", config.number, "-", config.name);
  
  return config;
}

// 🔍 VERIFICAR SI UNA FUNCIONALIDAD ESTÁ HABILITADA
export function isFeatureEnabled(feature: keyof StageConfig['features']): boolean {
  return getCurrentStageConfig().features[feature];
}

// 🔍 VERIFICAR SI UN SERVICIO ESTÁ HABILITADO
export function isServiceEnabled(service: keyof StageConfig['services']): boolean {
  return getCurrentStageConfig().services[service];
}

// 🔍 VERIFICAR SI UN ELEMENTO DE UI ESTÁ HABILITADO
export function isUIEnabled(element: keyof StageConfig['ui']): boolean {
  return getCurrentStageConfig().ui[element];
}
