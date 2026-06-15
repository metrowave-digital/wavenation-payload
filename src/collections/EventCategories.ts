import type { Access, CollectionConfig } from 'payload'

type PayloadUser = {
  role?: string | string[] | null
  roles?: string[] | null
}

const formatSlug = (value?: string | null) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const getRoles = (user: unknown): string[] => {
  const typedUser = user as PayloadUser | null | undefined
  const role = typedUser?.role
  const roles = typedUser?.roles

  return [
    ...(Array.isArray(role) ? role : role ? [role] : []),
    ...(Array.isArray(roles) ? roles : []),
  ]
}

const hasRole = (user: unknown, allowed: string[]) =>
  getRoles(user).some((role) => allowed.includes(role))

const isStaffUser = (user: unknown) =>
  hasRole(user, ['admin', 'super-admin', 'editor', 'producer', 'events-manager'])

const staffOnly: Access = ({ req: { user } }) => isStaffUser(user)

const publicOrStaff: Access = ({ req: { user } }) => {
  if (isStaffUser(user)) return true

  return {
    isActive: {
      equals: true,
    },
  }
}

export const EventCategories: CollectionConfig = {
  slug: 'event-categories',
  labels: {
    singular: 'Event Category',
    plural: 'Event Categories',
  },
  admin: {
    group: 'Events & Live Activations',
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'displayOrder', 'isActive'],
    listSearchableFields: ['name', 'description'],
  },
  access: {
    create: staffOnly,
    read: publicOrStaff,
    update: staffOnly,
    delete: staffOnly,
  },
  timestamps: true,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Category',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              index: true,
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              index: true,
              admin: {
                position: 'sidebar',
              },
              hooks: {
                beforeValidate: [({ value, data }) => value || formatSlug(data?.name)],
              },
            },
            {
              name: 'description',
              type: 'textarea',
            },
            {
              name: 'categoryType',
              type: 'select',
              defaultValue: 'general',
              options: [
                { label: 'General', value: 'general' },
                { label: 'WaveNation FM', value: 'fm' },
                { label: 'WaveNation One', value: 'one' },
                { label: 'WaveNation+', value: 'plus' },
                { label: 'Creator Hub', value: 'creator_hub' },
                { label: 'Community', value: 'community' },
                { label: 'Sponsored', value: 'sponsored' },
              ],
            },
            {
              name: 'colorAccent',
              type: 'select',
              defaultValue: 'electric_blue',
              options: [
                { label: 'Electric Blue', value: 'electric_blue' },
                { label: 'Magenta Pulse', value: 'magenta_pulse' },
                { label: 'Neon Green', value: 'neon_green' },
                { label: 'Charcoal', value: 'charcoal' },
              ],
            },
            {
              name: 'iconName',
              type: 'text',
              admin: {
                description:
                  'Optional frontend icon key, such as calendar, mic, tv, music, community.',
              },
            },
            {
              name: 'parentCategory',
              type: 'relationship',
              relationTo: 'event-categories',
            },
            {
              name: 'displayOrder',
              type: 'number',
              defaultValue: 100,
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'isActive',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                position: 'sidebar',
              },
            },
          ],
        },
        {
          label: 'Media',
          fields: [
            {
              name: 'thumbnail',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seoTitle',
              type: 'text',
              maxLength: 70,
            },
            {
              name: 'seoDescription',
              type: 'textarea',
              maxLength: 160,
            },
          ],
        },
      ],
    },
  ],
}
