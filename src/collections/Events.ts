import type { Access, CollectionConfig } from 'payload'

type PayloadUser = {
  id?: string | number
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
  hasRole(user, ['admin', 'super-admin', 'editor', 'producer', 'events-manager', 'creator-manager'])

const staffOnly: Access = ({ req: { user } }) => isStaffUser(user)

const publicOrStaff: Access = ({ req: { user } }) => {
  if (isStaffUser(user)) return true

  return {
    isActive: {
      equals: true,
    },
    eventStatus: {
      in: ['published', 'open-registration', 'sold-out'],
    },
  }
}

export const Events: CollectionConfig = {
  slug: 'events',
  labels: {
    singular: 'Event',
    plural: 'Events',
  },
  admin: {
    group: 'Events & Live Activations',
    useAsTitle: 'title',
    defaultColumns: ['title', 'eventStatus', 'eventType', 'startDate', 'venue', 'featured'],
    listSearchableFields: ['title', 'subtitle', 'summary'],
    preview: ({ slug }) => `${FRONTEND_URL}/events/${slug}`,
  },
  access: {
    create: staffOnly,
    read: publicOrStaff,
    update: staffOnly,
    delete: staffOnly,
    readVersions: staffOnly,
  },
  versions: {
    drafts: true,
    maxPerDoc: 25,
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
              name: 'title',
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
                description: 'Used for the public event URL.',
              },
              hooks: {
                beforeValidate: [({ value, data }) => value || formatSlug(data?.title)],
              },
            },
            {
              name: 'subtitle',
              type: 'text',
            },
            {
              name: 'summary',
              type: 'textarea',
              admin: {
                description: 'Short event summary for cards, SEO, and app previews.',
              },
            },
            {
              name: 'description',
              type: 'richText',
            },
            {
              name: 'eventStatus',
              label: 'Event Status',
              type: 'select',
              required: true,
              defaultValue: 'draft',
              admin: {
                position: 'sidebar',
              },
              options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Published', value: 'published' },
                { label: 'Open Registration', value: 'open_registration' },
                { label: 'Sold Out', value: 'sold_out' },
                { label: 'Postponed', value: 'postponed' },
                { label: 'Cancelled', value: 'cancelled' },
                { label: 'Completed', value: 'completed' },
                { label: 'Archived', value: 'archived' },
              ],
            },
            {
              name: 'eventType',
              label: 'Event Type',
              type: 'select',
              required: true,
              defaultValue: 'in-person',
              options: [
                { label: 'In-Person', value: 'in_person' },
                { label: 'Virtual', value: 'virtual' },
                { label: 'Hybrid', value: 'hybrid' },
                { label: 'Livestream', value: 'livestream' },
                { label: 'Festival', value: 'festival' },
                { label: 'Concert', value: 'concert' },
                { label: 'Pop-Up', value: 'popup' },
                { label: 'Town Hall', value: 'town_hall' },
                { label: 'Creator Workshop', value: 'creator_workshop' },
                { label: 'Awards', value: 'awards' },
                { label: 'Conference', value: 'conference' },
                { label: 'Community Event', value: 'community_event' },
              ],
            },
            {
              name: 'eventCategories',
              label: 'Event Categories',
              type: 'relationship',
              relationTo: 'event-categories',
              hasMany: true,
            },
            {
              name: 'featured',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'isActive',
              label: 'Active',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'displayOrder',
              type: 'number',
              defaultValue: 100,
              admin: {
                position: 'sidebar',
              },
            },
          ],
        },
        {
          label: 'Schedule',
          fields: [
            {
              name: 'startDate',
              type: 'date',
              required: true,
              index: true,
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'endDate',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'timezone',
              type: 'text',
              defaultValue: 'America/New_York',
            },
            {
              name: 'doorsOpenAt',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'schedule',
              type: 'array',
              labels: {
                singular: 'Schedule Item',
                plural: 'Schedule Items',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'startTime',
                  type: 'date',
                  admin: {
                    date: {
                      pickerAppearance: 'dayAndTime',
                    },
                  },
                },
                {
                  name: 'endTime',
                  type: 'date',
                  admin: {
                    date: {
                      pickerAppearance: 'dayAndTime',
                    },
                  },
                },
                {
                  name: 'location',
                  type: 'text',
                },
                {
                  name: 'description',
                  type: 'textarea',
                },
              ],
            },
          ],
        },
        {
          label: 'Venue & Streaming',
          fields: [
            {
              name: 'venue',
              type: 'relationship',
              relationTo: 'venues',
            },
            {
              name: 'locationOverride',
              type: 'text',
              admin: {
                description:
                  'Use this only if the venue relationship does not fully describe the public location.',
              },
            },
            {
              name: 'virtualAccessType',
              type: 'select',
              defaultValue: 'none',
              options: [
                { label: 'None', value: 'none' },
                { label: 'Free Stream', value: 'free_stream' },
                { label: 'Ticketed Stream', value: 'ticketed_stream' },
                { label: 'Private Link', value: 'private_link' },
                { label: 'WaveNation+', value: 'wavenation_plus' },
              ],
            },
            {
              name: 'livestreamProvider',
              type: 'select',
              options: [
                { label: 'Cloudflare Stream', value: 'cloudflare_stream' },
                { label: 'YouTube Live', value: 'youtube_live' },
                { label: 'Vimeo', value: 'vimeo' },
                { label: 'Zoom', value: 'zoom' },
                { label: 'Restream', value: 'restream' },
                { label: 'Other', value: 'other' },
              ],
            },
            {
              name: 'livestreamUrl',
              type: 'text',
            },
            {
              name: 'replayUrl',
              type: 'text',
            },
            {
              name: 'entryDetails',
              type: 'textarea',
            },
            {
              name: 'parkingInfo',
              type: 'textarea',
            },
            {
              name: 'accessibilityInfo',
              type: 'textarea',
            },
          ],
        },
        {
          label: 'Tickets',
          fields: [
            {
              name: 'ticketLinks',
              type: 'relationship',
              relationTo: 'ticket-links',
              hasMany: true,
            },
            {
              name: 'primaryCTA',
              label: 'Primary CTA Label',
              type: 'text',
              defaultValue: 'Get Tickets',
            },
            {
              name: 'registrationRequired',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'priceDisplay',
              type: 'text',
              admin: {
                description: 'Example: Free, $25, $25–$75, RSVP Required.',
              },
            },
          ],
        },
        {
          label: 'Lineup & Relations',
          fields: [
            {
              name: 'lineup',
              type: 'array',
              labels: {
                singular: 'Lineup Member',
                plural: 'Lineup',
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'role',
                  type: 'text',
                  admin: {
                    description: 'Example: Headliner, Host, DJ, Speaker, Vendor.',
                  },
                },
                {
                  name: 'creator',
                  type: 'relationship',
                  relationTo: 'creators',
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'performanceTime',
                  type: 'date',
                  admin: {
                    date: {
                      pickerAppearance: 'dayAndTime',
                    },
                  },
                },
                {
                  name: 'bio',
                  type: 'textarea',
                },
                {
                  name: 'externalUrl',
                  type: 'text',
                },
              ],
            },
            {
              name: 'sponsors',
              type: 'relationship',
              relationTo: 'sponsors',
              hasMany: true,
            },
            {
              name: 'relatedCreators',
              type: 'relationship',
              relationTo: 'creators',
              hasMany: true,
            },
            {
              name: 'relatedArticles',
              type: 'relationship',
              relationTo: 'articles',
              hasMany: true,
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
              required: true,
            },
            {
              name: 'posterImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'socialCard',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'gallery',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
            },
            {
              name: 'promoVideoUrl',
              type: 'text',
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
              name: 'internalOwner',
              type: 'relationship',
              relationTo: 'users',
            },
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
