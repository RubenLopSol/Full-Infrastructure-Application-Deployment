import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { Providers } from './_components/providers'
import { Toaster } from './_components/ui/toaster'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'La Huella - análisis de sentimiento',
  description: 'Sistema de análisis de sentimiento para comentarios de productos de calzado',
  keywords: ['análisis de sentimiento', 'calzado', 'comentarios', 'productos'],
  authors: [{ name: 'La Huella Team' }],
  openGraph: {
    title: 'La Huella - análisis de sentimiento',
    description: 'Sistema de análisis de sentimiento para comentarios de productos',
    type: 'website',
    locale: 'es_ES',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background">
            <header className="border-b bg-white shadow-sm">
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-huella-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">LH</span>
                      </div>
                      <h1 className="text-xl font-bold text-gray-900">
                        La Huella
                      </h1>
                    </div>
                    <span className="text-sm text-gray-500 hidden md:inline">
                      análisis de sentimiento
                    </span>
                  </div>
                  <nav className="flex items-center space-x-4">
                  <Link
  href="/"
  className="text-gray-600 hover:text-huella-600 transition-colors"
>
  Dashboard
</Link>
                    <Link 
                      href="/products" 
                      className="text-gray-600 hover:text-huella-600 transition-colors"
                    >
                      Productos
                    </Link>
                    <Link 
                      href="/analytics" 
                      className="text-gray-600 hover:text-huella-600 transition-colors"
                    >
                      Analytics
                    </Link>
                  </nav>
                </div>
              </div>
            </header>
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="border-t bg-gray-50 mt-16">
              <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    © 2024 La Huella. Sistema de análisis de sentimiento.
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Powered by LocalStack</span>
                    <span>•</span>
                    <span>Next.js 15</span>
                    <span>•</span>
                    <span>AWS Services</span>
                  </div>
                </div>
              </div>
            </footer>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
