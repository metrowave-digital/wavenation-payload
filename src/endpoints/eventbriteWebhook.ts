import type { PayloadRequest } from 'payload'

export const eventbriteWebhook = {
  path: '/eventbrite/webhook',
  method: 'post' as const,
  handler: async (req: PayloadRequest) => {
    try {
      const body = req.json ? await req.json() : req.body

      const apiObject = body?.api_url
      const config = body?.config
      const action = body?.action

      return Response.json(
        {
          success: true,
          received: true,
          action,
          apiObject,
          config,
        },
        { status: 200 },
      )
    } catch (error) {
      console.error('Eventbrite webhook error:', error)

      return Response.json(
        {
          success: false,
          error: 'Webhook processing failed',
        },
        { status: 500 },
      )
    }
  },
}
