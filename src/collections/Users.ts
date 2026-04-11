import { randomBytes } from 'crypto'
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  // Keep auth: true so Payload generates the required internal auth fields
  auth: true,

  admin: {
    useAsTitle: 'email',
    group: 'System',
    defaultColumns: ['email', 'displayName', 'roles', 'authProvider'],
  },

  /* ======================================================
     Access Control
  ====================================================== */
  access: {
    read: ({ req, id }) => {
      if (!req.user) return false
      if (req.user.roles?.includes('admin')) return true
      if (!id) return true // Allow list access
      return String(req.user.id) === String(id)
    },
    create: () => true,
    update: ({ req, id }) => {
      if (!req.user) return false
      if (req.user.roles?.includes('admin')) return true
      return String(req.user.id) === String(id)
    },
    delete: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
  },

  /* ======================================================
     Auth0 Webhook Endpoint
  ====================================================== */
  endpoints: [
    {
      path: '/auth0-sync',
      method: 'post',
      handler: async (req) => {
        const auth0Secret = process.env.AUTH0_WEBHOOK_SECRET

        if (!auth0Secret || req.headers.get('x-auth0-secret') !== auth0Secret) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        try {
          // Guard against undefined json() method and handle empty body
          if (typeof req.json !== 'function') {
            return Response.json({ error: 'Invalid request' }, { status: 400 })
          }

          const body = await req.json()

          // Basic check to ensure body was parsed
          if (!body) {
            return Response.json({ error: 'Empty body' }, { status: 400 })
          }

          const {
            email,
            sub: auth0Id,
            name,
          } = body as { email: string; sub: string; name?: string }

          if (!email || !auth0Id) {
            return Response.json({ error: 'Missing required Auth0 data' }, { status: 400 })
          }

          // ... rest of your logic (find, update, create) ...
          const existingUsers = await req.payload.find({
            collection: 'users',
            where: {
              or: [{ auth0Id: { equals: auth0Id } }, { email: { equals: email } }],
            },
          })

          if (existingUsers.totalDocs > 0) {
            const user = existingUsers.docs[0]
            await req.payload.update({
              collection: 'users',
              id: user.id,
              data: {
                lastLoginAt: new Date().toISOString(),
                authProvider: 'auth0',
                auth0Id: auth0Id,
              },
            })
            return Response.json(
              { success: true, message: 'User synced successfully' },
              { status: 200 },
            )
          }

          const nameParts = (name || '').split(' ')
          const firstName = nameParts[0] || ''
          const lastName = nameParts.slice(1).join(' ') || ''

          await req.payload.create({
            collection: 'users',
            data: {
              email,
              password: randomBytes(32).toString('hex'),
              firstName,
              lastName,
              displayName: name || email.split('@')[0],
              authProvider: 'auth0',
              auth0Id,
              lastLoginAt: new Date().toISOString(),
              roles: ['listener'],
            },
          })

          return Response.json({ success: true, message: 'User created' }, { status: 201 })
        } catch (error) {
          return Response.json({ error: 'Internal Server Error' }, { status: 500 })
        }
      },
    },
  ],

  /* ======================================================
     Fields
  ====================================================== */
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Profile',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'firstName', type: 'text', admin: { width: '50%' } },
                { name: 'lastName', type: 'text', admin: { width: '50%' } },
              ],
            },
            {
              name: 'displayName',
              type: 'text',
              admin: { description: 'Public-facing name used across the platform.' },
            },
            {
              name: 'avatar',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Square image recommended. Used for profile and bylines.' },
            },
            {
              name: 'bio',
              type: 'textarea',
              maxLength: 500,
            },
          ],
        },
        {
          label: 'Access & Security',
          fields: [
            {
              name: 'roles',
              type: 'select',
              hasMany: true,
              required: true,
              defaultValue: ['listener'],
              options: [
                { label: 'Admin', value: 'admin' },
                { label: 'Editor', value: 'editor' },
                { label: 'DJ / Host', value: 'talent' },
                { label: 'Creator', value: 'creator' },
                { label: 'Listener', value: 'listener' },
              ],
              access: {
                update: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
              },
            },
            {
              name: 'subscription',
              type: 'select',
              options: [
                { label: 'Free', value: 'free' },
                { label: 'WaveNation+', value: 'premium' },
              ],
              defaultValue: 'free',
            },
            {
              name: 'onboardingCompleted',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description:
                  'Used by the frontend to determine if the user needs to complete their profile setup.',
              },
            },
          ],
        },
        {
          label: 'Auth0 / SSO Integration',
          fields: [
            {
              name: 'authProvider',
              type: 'select',
              defaultValue: 'local',
              options: [
                { label: 'Local (Payload)', value: 'local' },
                { label: 'Auth0', value: 'auth0' },
              ],
              admin: {
                readOnly: true,
                description: 'How this user authenticates.',
              },
            },
            {
              name: 'auth0Id',
              type: 'text',
              unique: true,
              index: true,
              admin: {
                readOnly: true,
                description: 'The unique "sub" ID provided by Auth0. Do not edit manually.',
              },
              access: {
                update: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
              },
            },
            {
              name: 'lastLoginAt',
              type: 'date',
              admin: { readOnly: true },
            },
          ],
        },
        {
          label: 'Creator Settings',
          fields: [
            {
              name: 'creatorProfile',
              type: 'group',
              admin: {
                condition: (_, data) => data?.roles?.includes('creator'),
              },
              fields: [
                {
                  name: 'payoutEmail',
                  type: 'email',
                  admin: { description: 'Email used for creator payouts via Stripe/PayPal.' },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export default Users
