
import { Suspense } from 'react';
import { DashboardStats } from './_components/dashboard-stats';
import { RecentComments } from './_components/recent-comments';
import { SentimentChart } from './_components/sentiment-chart';
import StaticDashboard from './_components/static-dashboard';
import { SystemStatus } from './_components/system-status';
import { TopProducts } from './_components/top-products';
import { getCurrentStageConfig, isFeatureEnabled } from './_config/stages';

// Forzar que esta página sea dinámica y no se cachee
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function HomePage() {
  const stageConfig = getCurrentStageConfig();
const useStaticDashboard = isFeatureEnabled('staticDashboard');
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            🎯 La Huella - análisis de sentimiento
          </h1>
          <p className="text-gray-600 mt-2">
            Monitorea y analiza los comentarios de productos de calzado
          </p>
          <div className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full inline-block">
            🎯  {stageConfig.name}
          </div>
        </div>
      </div>

      {/* Renderizar dashboard según configuración */}
      {useStaticDashboard ? (
        <StaticDashboard />
      ) : (
        <>
          {/* Indicador Visual de Dashboard Dinámico */}
          <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-lg mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
              <h2 className="text-xl font-bold">🚀 Dashboard Dinámico Activo (Stage 2)</h2>
            </div>
            <p className="mt-2 text-green-100">
              Conectado a LocalStack - Datos en tiempo real desde servicios AWS simulados
            </p>
          </div>

          {/* Estado del Sistema */}
          <Suspense fallback={<div className="h-24 bg-gray-100 animate-pulse rounded-lg" />}>
            <SystemStatus />
          </Suspense>

          {/* Estadísticas Principales */}
          <Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse rounded-lg" />}>
            <DashboardStats />
          </Suspense>

          {/* Gráficos y Análisis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Suspense fallback={<div className="h-80 bg-gray-100 animate-pulse rounded-lg" />}>
              <SentimentChart />
            </Suspense>
            
            <Suspense fallback={<div className="h-80 bg-gray-100 animate-pulse rounded-lg" />}>
              <TopProducts />
            </Suspense>
          </div>

          {/* Comentarios Recientes */}
          <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg" />}>
            <RecentComments />
          </Suspense>
        </>
      )}
    </div>
  );
}
