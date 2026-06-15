// apps/web/src/sentry.server.config.ts
import * as Sentry from '@sentry/nextjs'

const isProduction = process.env.NODE_ENV === 'production'

Sentry.init({
  dsn: process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: Boolean(process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN),

  environment:
    process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,

  sendDefaultPii: false,

  tracesSampleRate: isProduction ? 0.1 : 1.0,
  enableLogs: isProduction,

  beforeSend(event) {
    if (event.request?.cookies) {
      delete event.request.cookies
    }

    if (event.request?.headers) {
      const headers = event.request.headers as Record<string, unknown>
      delete headers.authorization
      delete headers.cookie
      delete headers['x-payload-token']
    }

    return event
  },
})