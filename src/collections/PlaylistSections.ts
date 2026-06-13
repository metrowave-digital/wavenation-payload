import type { CollectionConfig } from 'payload'

const MUSIC_GROUP = 'Music & Playlists'

const formatSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const PlaylistSections: CollectionConfig = {
  slug: 'playlist-sections',
  labels: {
    singular: 'Playlist Section',
    plural: 'Playlist Sections',
  },
  admin: {
    group: MUSIC_GROUP,
    useAsTitle: 'title',
    defaultColumns: ['title', 'placement', 'sectionType', 'displayOrder', 'updatedAt'],
  },
  versions: {
    drafts: true,
    maxPerDoc: 50,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data

        if (data.title && !data.slug) {
          data.slug = formatSlug(data.title)
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
          label: 'Section',
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
              unique: true,
              index: true,
            },
            {
              name: 'description',
              type: 'textarea',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'placement',
                  type: 'select',
                  defaultValue: 'music-page',
                  index: true,
                  options: [
                    { label: 'Homepage', value: 'homepage' },
                    { label: 'Music Page', value: 'music-page' },
                    { label: 'Playlist Index', value: 'playlist-index' },
                    { label: 'Genre Hub', value: 'genre-hub' },
                    { label: 'Mobile App Home', value: 'app-home' },
                    { label: 'TV App', value: 'tv-app' },
                    { label: 'Creator Hub', value: 'creator-hub' },
                  ],
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'sectionType',
                  type: 'select',
                  defaultValue: 'playlist-row',
                  index: true,
                  options: [
                    { label: 'Playlist Row', value: 'playlist-row' },
                    { label: 'Track Row', value: 'track-row' },
                    { label: 'Chart Row', value: 'chart-row' },
                    { label: 'Genre Row', value: 'genre-row' },
                    { label: 'Release Highlight Row', value: 'release-highlight-row' },
                    { label: 'Mixed Feature', value: 'mixed-feature' },
                  ],
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'displayOrder',
                  type: 'number',
                  defaultValue: 100,
                  index: true,
                  admin: {
                    width: '33.33%',
                  },
                },
                {
                  name: 'isActive',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    width: '33.33%',
                  },
                },
                {
                  name: 'publishedAt',
                  type: 'date',
                  admin: {
                    width: '33.33%',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Layout',
          fields: [
            {
              name: 'layoutStyle',
              type: 'select',
              defaultValue: 'carousel',
              options: [
                { label: 'Carousel', value: 'carousel' },
                { label: 'Grid', value: 'grid' },
                { label: 'Hero + Rail', value: 'hero-rail' },
                { label: 'Editorial Stack', value: 'editorial-stack' },
                { label: 'Compact List', value: 'compact-list' },
              ],
            },
            {
              name: 'accentColor',
              type: 'select',
              defaultValue: 'electric-blue',
              options: [
                { label: 'Electric Blue', value: 'electric-blue' },
                { label: 'Neon Green', value: 'neon-green' },
                { label: 'Magenta Pulse', value: 'magenta-pulse' },
                { label: 'Signal Teal', value: 'signal-teal' },
                { label: 'Custom', value: 'custom' },
              ],
            },
            {
              name: 'customAccentColor',
              type: 'text',
              admin: {
                condition: (_, siblingData) => siblingData?.accentColor === 'custom',
              },
            },
            {
              name: 'backgroundImage',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          label: 'Curated Content',
          fields: [
            {
              name: 'playlists',
              type: 'relationship',
              relationTo: 'playlists',
              hasMany: true,
              admin: {
                isSortable: true,
                description: 'Drag selected playlists into the display order you want.',
              },
            },
            {
              name: 'tracks',
              type: 'relationship',
              relationTo: 'tracks',
              hasMany: true,
              admin: {
                isSortable: true,
                description: 'Optional manually curated tracks for this section.',
              },
            },
            {
              name: 'charts',
              type: 'relationship',
              relationTo: 'charts',
              hasMany: true,
              admin: {
                isSortable: true,
              },
            },
            {
              name: 'genres',
              type: 'relationship',
              relationTo: 'genres',
              hasMany: true,
              admin: {
                isSortable: true,
              },
            },
            {
              name: 'releaseHighlights',
              type: 'relationship',
              relationTo: 'release-highlights',
              hasMany: true,
              admin: {
                isSortable: true,
              },
            },
          ],
        },
        {
          label: 'CTA',
          fields: [
            {
              name: 'ctaLabel',
              type: 'text',
            },
            {
              name: 'ctaUrl',
              type: 'text',
            },
            {
              name: 'ctaStyle',
              type: 'select',
              defaultValue: 'primary',
              options: [
                { label: 'Primary', value: 'primary' },
                { label: 'Secondary', value: 'secondary' },
                { label: 'Text Link', value: 'text-link' },
              ],
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
