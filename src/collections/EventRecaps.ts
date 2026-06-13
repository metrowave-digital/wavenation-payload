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
    recapStatus: {
      equals: 'published',
    },
  }
}

export const EventRecaps: CollectionConfig = {
  slug: 'event-recaps',
  labels: {
    singular: 'Event Recap',
    plural: 'Event Recaps',
  },
  admin: {
    group: 'Events & Live Activations',
    useAsTitle: 'title',
    defaultColumns: ['title', 'event', 'recapStatus', 'publishedAt', 'featured'],
    listSearchableFields: ['title', 'subtitle', 'summary'],
    preview: ({ slug }) => `${FRONTEND_URL}/events/recaps/${slug}`,
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
          label: 'Story',
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
            },
            {
              name: 'body',
              type: 'richText',
            },
            {
              name: 'recapType',
              type: 'select',
              defaultValue: 'article',
              options: [
                { label: 'Article Recap', value: 'article' },
                { label: 'Photo Gallery', value: 'photo-gallery' },
                { label: 'Video Recap', value: 'video-recap' },
                { label: 'Press Release', value: 'press-release' },
                { label: 'Social Recap', value: 'social-recap' },
              ],
            },
            {
              name: 'recapStatus',
              type: 'select',
              defaultValue: 'draft',
              admin: {
                position: 'sidebar',
              },
              options: [
                { label: 'Draft', value: 'draft' },
                { label: 'In Review', value: 'in-review' },
                { label: 'Published', value: 'published' },
                { label: 'Archived', value: 'archived' },
              ],
            },
            {
              name: 'publishedAt',
              type: 'date',
              admin: {
                position: 'sidebar',
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
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
              type: 'checkbox',
              defaultValue: true,
              admin: {
                position: 'sidebar',
              },
            },
          ],
        },
        {
          label: 'Event Data',
          fields: [
            {
              name: 'event',
              type: 'relationship',
              relationTo: 'events',
              required: true,
            },
            {
              name: 'author',
              type: 'relationship',
              relationTo: 'users',
            },
            {
              name: 'attendanceEstimate',
              type: 'number',
            },
            {
              name: 'headlinerHighlights',
              type: 'textarea',
            },
            {
              name: 'highlightStats',
              type: 'array',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'value',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'pullQuotes',
              type: 'array',
              fields: [
                {
                  name: 'quote',
                  type: 'textarea',
                  required: true,
                },
                {
                  name: 'attribution',
                  type: 'text',
                },
              ],
            },
            {
              name: 'socialReactions',
              type: 'array',
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  options: [
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'TikTok', value: 'tiktok' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'X', value: 'x' },
                    { label: 'Other', value: 'other' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                },
                {
                  name: 'caption',
                  type: 'textarea',
                },
              ],
            },
          ],
        },
        {
          label: 'Relations',
          fields: [
            {
              name: 'sponsors',
              type: 'relationship',
              relationTo: 'sponsors',
              hasMany: true,
            },
            {
              name: 'featuredCreators',
              type: 'relationship',
              relationTo: 'creators',
              hasMany: true,
            },
            {
              name: 'relatedEvents',
              type: 'relationship',
              relationTo: 'events',
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
              name: 'gallery',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
            },
            {
              name: 'videoUrl',
              type: 'text',
            },
            {
              name: 'videoEmbedCode',
              type: 'textarea',
            },
            {
              name: 'socialCard',
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
