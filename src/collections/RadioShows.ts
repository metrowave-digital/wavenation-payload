// src/collections/RadioShows.ts
import type { CollectionConfig, FieldHook } from 'payload'

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const autoSlug: FieldHook = ({ data, operation, value }) => {
  if (typeof value === 'string' && value.trim()) return slugify(value)
  if (data?.title && (operation === 'create' || !value)) return slugify(data.title)
  return value
}

export const RadioShows: CollectionConfig = {
  slug: 'radioShows',
  labels: { singular: 'Radio Show', plural: 'Radio Shows' },
  admin: {
    useAsTitle: 'title',
    group: 'Radio & Programming',
    defaultColumns: ['title', 'showType', 'status', 'isFeatured'],
  },
  versions: { drafts: true },
  access: {
    read: () => true,
    create: ({ req }) =>
      Boolean(req.user?.roles?.includes('editor') || req.user?.roles?.includes('admin')),
    update: ({ req }) =>
      Boolean(req.user?.roles?.includes('editor') || req.user?.roles?.includes('admin')),
    delete: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Core Info',
          fields: [
            { name: 'title', type: 'text', required: true },
            {
              type: 'row',
              fields: [
                {
                  name: 'showType',
                  type: 'select',
                  required: true,
                  admin: { width: '50%' },
                  options: [
                    { label: 'Live Show', value: 'live' },
                    { label: 'Pre-Recorded', value: 'recorded' },
                    { label: 'Syndicated', value: 'syndicated' },
                    { label: 'Countdown / Chart', value: 'chart' },
                  ],
                },
                {
                  name: 'sponsors',
                  type: 'relationship',
                  relationTo: 'sponsors',
                  hasMany: true,
                  admin: {
                    width: '50%',
                    description: 'Brands officially sponsoring this Radio Show.',
                  },
                },
              ],
            },
            { name: 'description', type: 'textarea' },
            {
              name: 'hosts',
              type: 'relationship',
              relationTo: 'talent',
              hasMany: true,
            },
          ],
        },
        {
          label: 'Branding & Assets',
          fields: [
            {
              name: 'coverArt',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Primary 1:1 Show Cover' },
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Transparent PNG Show Logo' },
            },
            {
              name: 'themeColor',
              type: 'text',
              admin: { description: 'Hex code for the show page UI.' },
            },
          ],
        },
        {
          label: 'Scheduling & Metadata',
          fields: [
            {
              name: 'standardSchedule',
              type: 'group',
              admin: {
                description:
                  'The baseline schedule. Specific airing overrides happen in the Schedule collection.',
              },
              fields: [
                {
                  name: 'days',
                  type: 'select',
                  hasMany: true,
                  options: [
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday',
                  ],
                },
                { name: 'startTime', type: 'text', admin: { placeholder: 'e.g., 18:00' } },
                { name: 'endTime', type: 'text', admin: { placeholder: 'e.g., 20:00' } },
                { name: 'timezone', type: 'text', defaultValue: 'America/New_York' },
              ],
            },
            {
              name: 'genres',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'R&B', value: 'rnb' },
                { label: 'Hip-Hop', value: 'hip_hop' },
                { label: 'Southern Soul', value: 'southern_soul' },
                { label: 'Gospel', value: 'gospel' },
                { label: 'Talk', value: 'talk' },
                { label: 'Culture', value: 'culture' },
                { label: 'News', value: 'news' },
              ],
            },
            {
              name: 'chart',
              type: 'relationship',
              relationTo: 'charts',
              admin: { description: 'Link to a Chart if this is a Countdown show.' },
            },
          ],
        },
      ],
    },
    /* Sidebar */
    {
      name: 'slug',
      type: 'text',
      unique: true,
      hooks: { beforeValidate: [autoSlug] },
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'On Hiatus', value: 'hiatus' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'isFeatured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    {
      name: 'isPodcast',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Also distributes as an RSS podcast.' },
    },
  ],
}
