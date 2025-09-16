import { getDashboardStats } from "@/actions/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  MessageSquare,
  Minus,
  Package,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

export async function DashboardStats() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      title: "Total Productos",
      value: stats.totalProducts,
      icon: Package,
      description: "Productos en catálogo",
      trend: null,
      color: "text-blue-600",
    },
    {
      title: "Comentarios",
      value: stats.totalComments,
      icon: MessageSquare,
      description: "Comentarios totales",
      trend: "+12% vs mes anterior",
      color: "text-green-600",
    },
    {
      title: "Pendientes",
      value: stats.pendingProcessing,
      icon: Clock,
      description: "En cola de procesamiento",
      trend: stats.pendingProcessing > 10 ? "Alto volumen" : "Normal",
      color: stats.pendingProcessing > 10 ? "text-orange-600" : "text-gray-600",
    },
    {
      title: "Sentimiento Promedio",
      value: `${Math.round(stats.sentimentStats.averageScore * 100)}%`,
      icon:
        stats.sentimentStats.averageScore > 0.6
          ? TrendingUp
          : stats.sentimentStats.averageScore < 0.4
            ? TrendingDown
            : Minus,
      description: "Puntuación de sentimiento",
      trend: getSentimentTrend(stats.sentimentStats.averageScore),
      color:
        stats.sentimentStats.averageScore > 0.6
          ? "text-green-600"
          : stats.sentimentStats.averageScore < 0.4
            ? "text-red-600"
            : "text-yellow-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
            {stat.trend && (
              <p
                className={`text-xs mt-1 ${
                  stat.trend.includes("+")
                    ? "text-green-600"
                    : stat.trend.includes("Alto")
                      ? "text-orange-600"
                      : "text-gray-500"
                }`}
              >
                {stat.trend}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function getSentimentTrend(score: number): string {
  if (score > 0.7) return "Muy positivo";
  if (score > 0.6) return "Positivo";
  if (score > 0.4) return "Neutral";
  if (score > 0.3) return "Negativo";
  return "Muy negativo";
}
