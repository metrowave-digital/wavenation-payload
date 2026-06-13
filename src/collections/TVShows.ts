// src/collections/TVShows.ts
import type { CollectionConfig, FieldHook } from 'payload'

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const autoSlug: FieldHook = ({ data, operation, value }) => {
  if (typeof value === 'string' && value.trim()) {
    return slugify(value)
  }

  if (data?.title && (operation === 'create' || !value)) {
    return slugify(data.title)
  }

  return value
}

export const TVShows: CollectionConfig = {
  slug: 'tvShows',

  labels: {
    singular: 'TV Show',
    plural: 'TV Shows',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Video & TV',
    defaultColumns: ['title', 'network', 'format', 'showStatus'],
    description: 'Manages WaveNation TV shows, series, specials, and original video programming.',
  },

  versions: {
    drafts: true,
  },

  access: {
    read: () => true,
  },

  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Core Info',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: {
                description: 'The public title of the TV show or series.',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              admin: {
                description: 'A short synopsis or editorial description for this show.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'format',
                  type: 'select',
                  admin: {
                    width: '50%',
                  },
                  options: [
                    {
                      label: 'Reality / Docuseries',
                      value: 'reality',
                    },
                    {
                      label: 'Talk Show',
                      value: 'talk',
                    },
                    {
                      label: 'Scripted Drama',
                      value: 'drama',
                    },
                    {
                      label: 'Scripted Comedy',
                      value: 'comedy',
                    },
                    {
                      label: 'Live Event / Award',
                      value: 'event',
                    },
                    {
                      label: 'Documentary',
                      value: 'documentary',
                    },
                    {
                      label: 'Music Video Block',
                      value: 'music-video-block',
                    },
                    {
                      label: 'Special Presentation',
                      value: 'special',
                    },
                  ],
                },
                {
                  name: 'network',
                  type: 'select',
                  admin: {
                    width: '50%',
                  },
                  options: [
                    {
                      label: 'WaveNation TV',
                      value: 'wavenation',
                    },
                    {
                      label: 'WaveNation One',
                      value: 'wavenation-one',
                    },
                    {
                      label: 'WaveNation+',
                      value: 'wavenation-plus',
                    },
                    {
                      label: 'Syndicated',
                      value: 'syndicated',
                    },
                  ],
                },
              ],
            },
            {
              name: 'sponsors',
              type: 'relationship',
              relationTo: 'sponsors',
              hasMany: true,
              admin: {
                description: 'Brands officially sponsoring or presenting this TV show.',
              },
            },
          ],
        },
        {
          label: 'Branding & Assets',
          fields: [
            {
              name: 'posterArt',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Vertical poster art. Recommended ratio: 2:3.',
              },
            },
            {
              name: 'heroBanner',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Landscape hero image or banner. Recommended ratio: 16:9.',
              },
            },
            {
              name: 'trailer',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Trailer or promotional video for this show.',
              },
            },
          ],
        },
        {
          label: 'Metadata & Seasons',
          fields: [
            {
              name: 'seasons',
              type: 'relationship',
              relationTo: 'seasons',
              hasMany: true,
              admin: {
                description: 'The seasons belonging to this TV show.',
              },
            },
            {
              name: 'ageRating',
              type: 'select',
              options: [
                {
                  label: 'TV-G',
                  value: 'TV-G',
                },
                {
                  label: 'TV-PG',
                  value: 'TV-PG',
                },
                {
                  label: 'TV-14',
                  value: 'TV-14',
                },
                {
                  label: 'TV-MA',
                  value: 'TV-MA',
                },
              ],
              admin: {
                description: 'Audience rating for this show.',
              },
            },
            {
              name: 'talent',
              type: 'relationship',
              relationTo: 'talent',
              hasMany: true,
              admin: {
                description:
                  'Hosts, cast members, guests, or recurring talent attached to this show.',
              },
            },
            {
              name: 'genres',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
              admin: {
                description: 'Genre or editorial categories connected to this show.',
              },
            },
          ],
        },
      ],
    },

    {
      name: 'slug',
      type: 'text',
      unique: true,
      hooks: {
        beforeValidate: [autoSlug],
      },
      admin: {
        position: 'sidebar',
        description: 'Auto-generated from the title.',
      },
    },
    {
      name: 'showStatus',
      type: 'select',
      enumName: 'tv_show_status',
      label: 'Show Status',
      defaultValue: 'production',
      options: [
        {
          label: 'In Production',
          value: 'production',
        },
        {
          label: 'Coming Soon',
          value: 'coming-soon',
        },
        {
          label: 'Airing',
          value: 'airing',
        },
        {
          label: 'Ended',
          value: 'ended',
        },
        {
          label: 'Archived',
          value: 'archived',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}

export default TVShows
