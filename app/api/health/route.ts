import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Verificaciones básicas de salud
    const healthCheck = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      stage: process.env.CURRENT_STAGE,
      version: '1.0.0'
    }

    return NextResponse.json(healthCheck, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Health check failed',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    )
  }
}
