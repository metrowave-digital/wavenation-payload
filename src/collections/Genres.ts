import type { CollectionConfig } from 'payload'

const MUSIC_GROUP = 'Music & Playlists'

const formatSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const Genres: CollectionConfig = {
  slug: 'genres',
  labels: {
    singular: 'Genre',
    plural: 'Genres',
  },
  admin: {
    group: MUSIC_GROUP,
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'isFeatured', 'displayOrder', 'updatedAt'],
  },
  versions: {
    maxPerDoc: 25,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data

        if (data.name && !data.slug) {
          data.slug = formatSlug(data.name)
        }

        return data
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Basics',
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
              unique: true,
              index: true,
              admin: {
                description: 'Auto-generated from the genre name if left blank.',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              admin: {
                description: 'Short public description for genre hub pages.',
              },
            },
            {
              name: 'shortDescription',
              type: 'text',
              admin: {
                description: 'Optional shorter line for cards, filters, or app screens.',
              },
            },
            {
              name: 'displayOrder',
              type: 'number',
              defaultValue: 100,
              index: true,
              admin: {
                description: 'Lower numbers appear first.',
              },
            },
            {
              name: 'isFeatured',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
        {
          label: 'Visuals',
          fields: [
            {
              name: 'coverArt',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Square or 16:9 visual for genre cards and hubs.',
              },
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Optional wide hero image for the genre landing page.',
              },
            },
            {
              name: 'accentColor',
              type: 'select',
              defaultValue: 'electric-blue',
              options: [
                { label: 'Electric Blue', value: 'electric_blue' },
                { label: 'Neon Green', value: 'neon_green' },
                { label: 'Magenta Pulse', value: 'magenta_pulse' },
                { label: 'Signal Teal', value: 'signal_teal' },
                { label: 'Charcoal', value: 'charcoal' },
                { label: 'Custom', value: 'custom' },
              ],
            },
            {
              name: 'customAccentColor',
              type: 'text',
              admin: {
                description: 'Optional hex value, for example #00B3FF.',
                condition: (_, siblingData) => siblingData?.accentColor === 'custom',
              },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seoTitle',
              type: 'text',
            },
            {
              name: 'seoDescription',
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
          label: 'Internal',
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
