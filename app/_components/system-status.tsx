import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, AlertCircle, Activity } from 'lucide-react'
import { checkAWSServices } from '@/actions/dashboard'

export async function SystemStatus() {
  const services = await checkAWSServices()
  
  const serviceList = [
    {
      name: 'DynamoDB',
      status: services.dynamodb,
      description: 'Base de datos de comentarios y productos'
    },
    {
      name: 'S3',
      status: services.s3,
      description: 'Almacenamiento de reportes y archivos'
    },
    {
      name: 'SQS',
      status: services.sqs,
      description: 'Cola de procesamiento de sentimientos'
    },
    {
      name: 'CloudWatch',
      status: services.cloudwatch,
      description: 'Monitoreo y logs del sistema'
    }
  ]

  const allServicesHealthy = Object.values(services).every(status => status)
  const someServicesDown = Object.values(services).some(status => !status)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          Estado del Sistema
          {allServicesHealthy && (
            <CheckCircle className="w-5 h-5 ml-2 text-green-500" />
          )}
          {someServicesDown && (
            <AlertCircle className="w-5 h-5 ml-2 text-orange-500" />
          )}
        </CardTitle>
        <CardDescription>
          Estado de los servicios AWS y LocalStack
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {serviceList.map((service) => (
            <div
              key={service.name}
              className={`p-4 rounded-lg border ${
                service.status
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-sm">{service.name}</h3>
                {service.status ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
              <p className="text-xs text-gray-600">
                {service.description}
              </p>
              <div className="mt-2">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    service.status
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {service.status ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {!allServicesHealthy && (
          <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 text-orange-500 mr-2" />
              <span className="text-sm font-medium text-orange-800">
                Algunos servicios no están disponibles
              </span>
            </div>
            <p className="text-sm text-orange-700 mt-1">
              Verifica que LocalStack esté ejecutándose: <code>docker-compose up localstack -d</code>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
