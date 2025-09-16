import { STATIC_PRODUCTS, STATIC_COMMENTS, STATIC_STATS } from '../_lib/static-data';

export default function StaticDashboard() {
  return (
    <div className="space-y-8">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Productos</h3>
          <p className="text-2xl font-bold text-gray-900">{STATIC_STATS.totalProducts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Comentarios</h3>
          <p className="text-2xl font-bold text-gray-900">{STATIC_STATS.totalComments}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Rating Promedio</h3>
          <p className="text-2xl font-bold text-gray-900">{STATIC_STATS.averageRating}/5.0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Satisfacción</h3>
          <p className="text-2xl font-bold text-gray-900">{STATIC_STATS.satisfactionIndex}%</p>
        </div>
      </div>

      {/* Productos Top */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Top Productos</h2>
        <div className="space-y-4">
          {STATIC_PRODUCTS.map((product) => (
            <div key={product.id} className="flex justify-between items-center p-4 border rounded">
              <div>
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.commentCount} comentarios</p>
              </div>
              <div className="text-right">
                <p className="font-bold">⭐ {product.rating}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comentarios Recientes */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Comentarios Recientes</h2>
        <div className="space-y-4">
          {STATIC_COMMENTS.map((comment) => (
            <div key={comment.id} className="border-l-4 border-blue-500 pl-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{comment.userName}</p>
                  <p className="text-gray-600 mt-1">{comment.content}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">⭐ {comment.rating}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    comment.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                    comment.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {comment.sentiment}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
