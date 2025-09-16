import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Package, Star, MessageSquare, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react'
import { getDashboardStats } from '@/actions/dashboard'
import { formatCurrency, getSentimentColor } from '@/lib/utils'

export async function TopProducts() {
  const stats = await getDashboardStats()
  const topProducts = stats.topProducts

  if (topProducts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Productos Más Comentados
          </CardTitle>
          <CardDescription>
            Productos con mayor actividad de comentarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No hay productos con comentarios</p>
            <p className="text-sm text-gray-400 mt-1">
              Los productos más comentados aparecerán aquí
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Productos Más Comentados
            </CardTitle>
            <CardDescription>
              Top {topProducts.length} productos por actividad
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            Ver Catálogo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts.map((item, index) => {
            const { product, commentCount, averageSentiment, averageRating } = item
            const sentimentTrend = averageSentiment > 0.6 ? 'positive' : 
                                 averageSentiment < 0.4 ? 'negative' : 'neutral'
            
            return (
              <div
                key={product.id}
                className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                {/* Ranking */}
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    index === 1 ? 'bg-gray-100 text-gray-800' :
                    index === 2 ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {index + 1}
                  </div>
                </div>

                {/* Imagen del producto (placeholder) */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-gray-400" />
                  </div>
                </div>

                {/* Información del producto */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-sm truncate">{product.name}</h3>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(product.price)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="capitalize">{product.category}</span>
                    <span className="flex items-center">
                      <MessageSquare className="w-3 h-3 mr-1" />
                      {commentCount} comentarios
                    </span>
                    <span className="flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      {averageRating}/5
                    </span>
                  </div>
                </div>

                {/* Métricas de sentimiento */}
                <div className="flex-shrink-0 text-right">
                  <div className="flex items-center space-x-2 mb-1">
                    {sentimentTrend === 'positive' && (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    )}
                    {sentimentTrend === 'negative' && (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${
                      sentimentTrend === 'positive' ? 'text-green-600' :
                      sentimentTrend === 'negative' ? 'text-red-600' :
                      'text-yellow-600'
                    }`}>
                      {Math.round(averageSentiment * 100)}%
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    {sentimentTrend === 'positive' ? 'Muy positivo' :
                     sentimentTrend === 'negative' ? 'Negativo' :
                     'Neutral'}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Resumen estadístico */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-gray-900">
                {topProducts.reduce((sum, item) => sum + item.commentCount, 0)}
              </div>
              <div className="text-xs text-gray-500">Total Comentarios</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">
                {topProducts.length > 0 
                  ? Math.round(topProducts.reduce((sum, item) => sum + item.averageRating, 0) / topProducts.length * 10) / 10
                  : 0}
              </div>
              <div className="text-xs text-gray-500">Rating Promedio</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">
                {topProducts.length > 0 
                  ? Math.round(topProducts.reduce((sum, item) => sum + item.averageSentiment, 0) / topProducts.length * 100)
                  : 0}%
              </div>
              <div className="text-xs text-gray-500">Sentimiento Promedio</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
