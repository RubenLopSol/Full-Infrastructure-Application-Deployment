'use client'

import { getSentimentMetrics } from '@/actions/dashboard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const SENTIMENT_COLORS = {
  positive: '#10b981',
  negative: '#ef4444',
  neutral: '#f59e0b'
}

export function SentimentChart() {
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ['sentiment-metrics'],
    queryFn: async () => {
      // Obtener métricas de los últimos 7 días
      const endDate = new Date().toISOString().split('T')[0]
      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      return getSentimentMetrics(startDate, endDate)
    },
    refetchInterval: 30000, // Refrescar cada 30 segundos
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            análisis de sentimiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="loading-spinner w-8 h-8" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !metrics || metrics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            análisis de sentimiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay datos disponibles</p>
              <p className="text-sm text-gray-400 mt-1">
                Los datos aparecerán cuando haya comentarios procesados
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calcular totales para el gráfico de pastel
  const totalPositive = metrics.reduce((sum, day) => sum + day.positive, 0)
  const totalNegative = metrics.reduce((sum, day) => sum + day.negative, 0)
  const totalNeutral = metrics.reduce((sum, day) => sum + day.neutral, 0)
  const total = totalPositive + totalNegative + totalNeutral

  const pieData = [
    { name: 'Positivo', value: totalPositive, color: SENTIMENT_COLORS.positive },
    { name: 'Negativo', value: totalNegative, color: SENTIMENT_COLORS.negative },
    { name: 'Neutral', value: totalNeutral, color: SENTIMENT_COLORS.neutral },
  ].filter(item => item.value > 0)

  // Formatear datos para el gráfico de barras
  const chartData = metrics.map(day => ({
    ...day,
    date: new Date(day.date).toLocaleDateString('es-ES', { 
      month: 'short', 
      day: 'numeric' 
    })
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          análisis de sentimiento
        </CardTitle>
        <CardDescription>
          Distribución de sentimientos en los últimos 7 días
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Resumen con porcentajes */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {total > 0 ? Math.round((totalPositive / total) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600">Positivos</div>
              <div className="text-xs text-gray-500">{totalPositive} comentarios</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {total > 0 ? Math.round((totalNeutral / total) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600">Neutrales</div>
              <div className="text-xs text-gray-500">{totalNeutral} comentarios</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {total > 0 ? Math.round((totalNegative / total) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600">Negativos</div>
              <div className="text-xs text-gray-500">{totalNegative} comentarios</div>
            </div>
          </div>

          {/* Gráfico de barras por día */}
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="positive" fill={SENTIMENT_COLORS.positive} name="Positivos" />
                <Bar dataKey="neutral" fill={SENTIMENT_COLORS.neutral} name="Neutrales" />
                <Bar dataKey="negative" fill={SENTIMENT_COLORS.negative} name="Negativos" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
