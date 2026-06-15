// src/app/api/health/route.ts
import { NextResponse } from 'next/server'
import { Client } from 'pg'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type CheckStatus = 'ok' | 'error' | 'missing'

type CmsHealthResponse = {
  status: 'ok' | 'degraded' | 'error'
  service: string
  app: string
  environment: string
  timestamp: string
  uptime: number
  checks: {
    server: CheckStatus
    database: CheckStatus
    databaseUrl: 'configured' | 'missing'
    payloadSecret: 'configured' | 'missing'
    serverUrl: 'configured' | 'missing'
  }
}

async function checkDatabase(): Promise<CheckStatus> {
  if (!process.env.DATABASE_URL) {
    return 'missing'
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 3000,
    query_timeout: 3000,
    ssl:
      process.env.DATABASE_URL.includes('sslmode=require') || process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : undefined,
  })

  try {
    await client.connect()
    await client.query('select 1 as ok')
    return 'ok'
  } catch {
    return 'error'
  } finally {
    try {
      await client.end()
    } catch {
      // Ignore close errors.
    }
  }
}

export async function GET() {
  const database = await checkDatabase()

  const checks: CmsHealthResponse['checks'] = {
    server: 'ok',
    database,
    databaseUrl: process.env.DATABASE_URL ? 'configured' : 'missing',
    payloadSecret: process.env.PAYLOAD_SECRET ? 'configured' : 'missing',
    serverUrl: process.env.NEXT_PUBLIC_SERVER_URL ? 'configured' : 'missing',
  }

  const hasError =
    checks.database === 'error' ||
    checks.databaseUrl === 'missing' ||
    checks.payloadSecret === 'missing'

  const hasWarning = checks.serverUrl === 'missing'

  const body: CmsHealthResponse = {
    status: hasError ? 'error' : hasWarning ? 'degraded' : 'ok',
    service: 'wavenation-cms',
    app: 'WaveNation Payload CMS',
    environment: process.env.RENDER ? 'render' : process.env.NODE_ENV || 'unknown',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks,
  }

  return NextResponse.json(body, {
    status: hasError ? 503 : 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}
