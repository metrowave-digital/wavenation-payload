import type { Access, CollectionConfig } from 'payload'

type PayloadUser = {
  role?: string | string[] | null
  roles?: string[] | null
}

const FRONTEND_URL =
  process.env.NEXT_PUBLIC_SITE_URL || process.env.FRONTEND_URL || 'http://localhost:3000'

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

export const Venues: CollectionConfig = {
  slug: 'venues',
  labels: {
    singular: 'Venue',
    plural: 'Venues',
  },
  admin: {
    group: 'Events & Live Activations',
    useAsTitle: 'name',
    defaultColumns: ['name', 'city', 'state', 'venueType', 'capacity', 'isActive'],
    listSearchableFields: ['name', 'city', 'state', 'description'],
    preview: ({ slug }) => `${FRONTEND_URL}/venues/${slug}`,
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
          label: 'Overview',
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
              type: 'richText',
            },
            {
              name: 'venueType',
              type: 'select',
              defaultValue: 'event-space',
              options: [
                { label: 'Event Space', value: 'event-space' },
                { label: 'Theater', value: 'theater' },
                { label: 'Club', value: 'club' },
                { label: 'Arena', value: 'arena' },
                { label: 'Church / Faith Venue', value: 'faith-venue' },
                { label: 'Outdoor Venue', value: 'outdoor' },
                { label: 'Restaurant / Lounge', value: 'restaurant-lounge' },
                { label: 'Studio', value: 'studio' },
                { label: 'Virtual', value: 'virtual' },
                { label: 'Other', value: 'other' },
              ],
            },
            {
              name: 'capacity',
              type: 'number',
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
          label: 'Location',
          fields: [
            {
              name: 'addressLine1',
              type: 'text',
            },
            {
              name: 'addressLine2',
              type: 'text',
            },
            {
              name: 'city',
              type: 'text',
              index: true,
            },
            {
              name: 'state',
              type: 'text',
              index: true,
            },
            {
              name: 'postalCode',
              type: 'text',
            },
            {
              name: 'country',
              type: 'text',
              defaultValue: 'United States',
            },
            {
              name: 'neighborhood',
              type: 'text',
            },
            {
              name: 'timezone',
              type: 'text',
              defaultValue: 'America/New_York',
            },
            {
              name: 'mapUrl',
              type: 'text',
            },
            {
              name: 'latitude',
              type: 'number',
            },
            {
              name: 'longitude',
              type: 'number',
            },
          ],
        },
        {
          label: 'Guest Info',
          fields: [
            {
              name: 'parkingInfo',
              type: 'textarea',
            },
            {
              name: 'publicTransitInfo',
              type: 'textarea',
            },
            {
              name: 'accessibilityInfo',
              type: 'textarea',
            },
            {
              name: 'entryInstructions',
              type: 'textarea',
            },
            {
              name: 'ageRestriction',
              type: 'text',
              admin: {
                description: 'Example: All ages, 18+, 21+.',
              },
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            {
              name: 'website',
              type: 'text',
            },
            {
              name: 'phone',
              type: 'text',
            },
            {
              name: 'email',
              type: 'email',
            },
            {
              name: 'contacts',
              type: 'array',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                },
                {
                  name: 'role',
                  type: 'text',
                },
                {
                  name: 'email',
                  type: 'email',
                },
                {
                  name: 'phone',
                  type: 'text',
                },
              ],
            },
          ],
        },
        {
          label: 'Media',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'thumbnail',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'gallery',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
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
            {
              name: 'seoImage',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          label: 'Admin',
          fields: [
            {
              name: 'internalNotes',
              type: 'textarea',
            },
          ],
        },
      ],
    },
  ],
}
