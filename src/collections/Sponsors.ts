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
  hasRole(user, ['admin', 'super-admin', 'editor', 'producer', 'events-manager', 'sales-manager'])

const staffOnly: Access = ({ req: { user } }) => isStaffUser(user)

const publicOrStaff: Access = ({ req: { user } }) => {
  if (isStaffUser(user)) return true

  return {
    isActive: {
      equals: true,
    },
    publicDisplay: {
      equals: true,
    },
  }
}

export const Sponsors: CollectionConfig = {
  slug: 'sponsors',
  labels: {
    singular: 'Sponsor',
    plural: 'Sponsors',
  },
  admin: {
    group: 'Partnerships & Sponsors',
    useAsTitle: 'name',
    defaultColumns: ['name', 'sponsorTier', 'sponsorType', 'publicDisplay', 'isActive'],
    listSearchableFields: ['name', 'description', 'website'],
    preview: ({ slug }) => `${FRONTEND_URL}/sponsors/${slug}`,
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
              name: 'shortDescription',
              type: 'textarea',
            },
            {
              name: 'sponsorType',
              type: 'select',
              defaultValue: 'brand',
              options: [
                { label: 'Brand', value: 'brand' },
                { label: 'Community Partner', value: 'community-partner' },
                { label: 'Foundation', value: 'foundation' },
                { label: 'Media Partner', value: 'media-partner' },
                { label: 'Venue Partner', value: 'venue-partner' },
                { label: 'Vendor', value: 'vendor' },
                { label: 'Internal Partner', value: 'internal-partner' },
                { label: 'In-Kind Sponsor', value: 'in-kind' },
              ],
            },
            {
              name: 'sponsorTier',
              type: 'select',
              defaultValue: 'community',
              options: [
                { label: 'Presenting', value: 'presenting' },
                { label: 'Platinum', value: 'platinum' },
                { label: 'Gold', value: 'gold' },
                { label: 'Silver', value: 'silver' },
                { label: 'Bronze', value: 'bronze' },
                { label: 'Community', value: 'community' },
                { label: 'In-Kind', value: 'in-kind' },
                { label: 'Custom', value: 'custom' },
              ],
            },
            {
              name: 'website',
              type: 'text',
            },
            {
              name: 'publicDisplay',
              type: 'checkbox',
              defaultValue: true,
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
          label: 'Brand Assets',
          fields: [
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'logoDark',
              label: 'Logo for Dark Backgrounds',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'logoLight',
              label: 'Logo for Light Backgrounds',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'brandImages',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
            },
            {
              name: 'brandGuidelines',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          label: 'Relations',
          fields: [
            {
              name: 'sponsoredEvents',
              type: 'relationship',
              relationTo: 'events',
              hasMany: true,
            },
            {
              name: 'sponsoredRecaps',
              type: 'relationship',
              relationTo: 'event-recaps',
              hasMany: true,
            },
            {
              name: 'sponsoredCreators',
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
          label: 'Contract & Benefits',
          fields: [
            {
              name: 'contractStatus',
              type: 'select',
              defaultValue: 'prospect',
              options: [
                { label: 'Prospect', value: 'prospect' },
                { label: 'Proposal Sent', value: 'proposal-sent' },
                { label: 'Active', value: 'active' },
                { label: 'Paused', value: 'paused' },
                { label: 'Completed', value: 'completed' },
                { label: 'Declined', value: 'declined' },
              ],
            },
            {
              name: 'startDate',
              type: 'date',
            },
            {
              name: 'endDate',
              type: 'date',
            },
            {
              name: 'benefits',
              type: 'array',
              fields: [
                {
                  name: 'benefit',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'fulfilled',
                  type: 'checkbox',
                  defaultValue: false,
                },
                {
                  name: 'notes',
                  type: 'textarea',
                },
              ],
            },
            {
              name: 'contractFile',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          label: 'Contacts',
          fields: [
            {
              name: 'contacts',
              type: 'array',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                },
                {
                  name: 'title',
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
