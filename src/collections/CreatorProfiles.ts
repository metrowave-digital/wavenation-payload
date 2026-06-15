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
  hasRole(user, ['admin', 'super-admin', 'editor', 'producer', 'creator-manager'])

const staffOnly: Access = ({ req: { user } }) => isStaffUser(user)

const publicOrStaff: Access = ({ req: { user } }) => {
  if (isStaffUser(user)) return true

  return {
    profileStatus: {
      equals: 'published',
    },
    isActive: {
      equals: true,
    },
  }
}

export const CreatorProfiles: CollectionConfig = {
  slug: 'creator-profiles',
  labels: {
    singular: 'Creator Profile',
    plural: 'Creator Profiles',
  },
  admin: {
    group: 'Creator Hub',
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'profileStatus', 'creatorRole', 'featured', 'isActive'],
    listSearchableFields: ['displayName', 'tagline', 'bio'],
    preview: ({ slug }) => `${FRONTEND_URL}/creators/${slug}`,
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
          label: 'Profile',
          fields: [
            {
              name: 'displayName',
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
                beforeValidate: [({ value, data }) => value || formatSlug(data?.displayName)],
              },
            },
            {
              name: 'creator',
              type: 'relationship',
              relationTo: 'creators',
              required: true,
              index: true,
            },
            {
              name: 'creatorRole',
              type: 'text',
              admin: {
                description: 'Example: Artist, Filmmaker, DJ, Podcaster, Host.',
              },
            },
            {
              name: 'tagline',
              type: 'text',
            },
            {
              name: 'bio',
              type: 'richText',
            },
            {
              name: 'profileStatus',
              type: 'select',
              required: true,
              defaultValue: 'draft',
              admin: {
                position: 'sidebar',
              },
              options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Published', value: 'published' },
                { label: 'Hidden', value: 'hidden' },
                { label: 'Archived', value: 'archived' },
              ],
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
          label: 'Details',
          fields: [
            {
              name: 'genres',
              type: 'array',
              fields: [
                {
                  name: 'genre',
                  type: 'text',
                },
              ],
            },
            {
              name: 'location',
              type: 'text',
            },
            {
              name: 'website',
              type: 'text',
            },
            {
              name: 'socialLinks',
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
                    { label: 'Spotify', value: 'spotify' },
                    { label: 'Apple Music', value: 'apple_music' },
                    { label: 'SoundCloud', value: 'soundcloud' },
                    { label: 'Website', value: 'website' },
                    { label: 'Other', value: 'other' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Featured Content',
          fields: [
            {
              name: 'featuredContent',
              type: 'array',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'contentType',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Video', value: 'video' },
                    { label: 'Podcast', value: 'podcast' },
                    { label: 'Music', value: 'music' },
                    { label: 'Article', value: 'article' },
                    { label: 'Playlist', value: 'playlist' },
                    { label: 'External Link', value: 'external_link' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                },
                {
                  name: 'thumbnail',
                  type: 'upload',
                  relationTo: 'media',
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
          label: 'Media',
          fields: [
            {
              name: 'avatar',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'coverImage',
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
          label: 'Metrics',
          fields: [
            {
              name: 'plays',
              type: 'number',
              defaultValue: 0,
            },
            {
              name: 'followers',
              type: 'number',
              defaultValue: 0,
            },
            {
              name: 'watchHours',
              type: 'number',
              defaultValue: 0,
            },
          ],
        },
        {
          label: 'CTA',
          fields: [
            {
              name: 'ctaLabel',
              type: 'text',
              defaultValue: 'Work With This Creator',
            },
            {
              name: 'ctaUrl',
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
      ],
    },
  ],
}
