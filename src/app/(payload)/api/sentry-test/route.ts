export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return Response.json({ error: 'Disabled in production' }, { status: 404 })
  }

  throw new Error('WaveNation web Sentry test error')
}