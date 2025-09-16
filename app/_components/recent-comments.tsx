import { getDashboardStats } from "@/actions/dashboard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatDate,
  getSentimentColor,
  getSentimentLabel,
  truncateText,
} from "@/lib/utils";
import { Clock, ExternalLink, MessageSquare, Star, User } from "lucide-react";

export async function RecentComments() {
  const stats = await getDashboardStats();
  const recentComments = stats.recentComments;

  if (recentComments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Comentarios Recientes
          </CardTitle>
          <CardDescription>
            Los comentarios más recientes de productos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No hay comentarios recientes</p>
            <p className="text-sm text-gray-400 mt-1">
              Los nuevos comentarios aparecerán aquí
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Comentarios Recientes
            </CardTitle>
            <CardDescription>
              Los {recentComments.length} comentarios más recientes
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            Ver Todos
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentComments.map((comment) => (
            <div
              key={comment.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-sm">
                      {comment.userName}
                    </span>
                  </div>
                  {comment.rating && (
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < comment.rating!
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">
                        ({comment.rating}/5)
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {comment.sentiment && (
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(
                        comment.sentiment
                      )}`}
                    >
                      {getSentimentLabel(comment.sentiment)}
                    </span>
                  )}
                  {!comment.processed && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      <Clock className="w-3 h-3 mr-1" />
                      Pendiente
                    </span>
                  )}
                </div>
              </div>

              <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                {truncateText(comment.comment, 200)}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDate(comment.createdAt)}
                  </span>
                  {comment.sentimentScore && (
                    <span>
                      Confianza: {Math.round(comment.sentimentScore * 100)}%
                    </span>
                  )}
                </div>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                  Ver Producto
                </Button>
              </div>
            </div>
          ))}
        </div>

        {recentComments.length >= 10 && (
          <div className="mt-6 text-center">
            <Button variant="outline">Cargar Más Comentarios</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
