// apps/web/src/instrumentation-client.ts
import * as Sentry from '@sentry/nextjs'

const isProduction = process.env.NODE_ENV === 'production'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),

  environment:
    process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,

  sendDefaultPii: false,

  tracesSampleRate: isProduction ? 0.1 : 1.0,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      maskAllInputs: true,
      blockAllMedia: true,
    }),
  ],

  replaysSessionSampleRate: isProduction ? 0.02 : 0,
  replaysOnErrorSampleRate: 1.0,

  enableLogs: isProduction,
})

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart