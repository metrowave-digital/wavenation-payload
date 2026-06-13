// src/collections/Seasons.ts
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

export const Seasons: CollectionConfig = {
  slug: 'seasons',

  labels: {
    singular: 'Season',
    plural: 'Seasons',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Video & TV',
    defaultColumns: ['title', 'parentProgram', 'seasonNumber', 'seasonStatus'],
    description: 'Manages individual seasons for both TV shows and podcasts.',
  },

  versions: {
    drafts: true,
  },

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
            {
              type: 'row',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  admin: {
                    width: '50%',
                    description: 'Example: “Season 1” or “The Tournament Arc”.',
                  },
                },
                {
                  name: 'seasonNumber',
                  type: 'number',
                  required: true,
                  admin: {
                    width: '50%',
                    description: 'The numeric season order, such as 1, 2, or 3.',
                  },
                },
              ],
            },
            {
              name: 'parentProgram',
              type: 'relationship',
              relationTo: ['tvShows', 'podcasts'],
              required: true,
              admin: {
                description: 'The TV show or podcast this season belongs to.',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              admin: {
                description: 'Season-specific synopsis.',
              },
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
              admin: {
                description:
                  'Optional season-specific cover art. This can override the main show art.',
              },
            },
            {
              name: 'trailer',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Season trailer or promotional video.',
              },
            },
          ],
        },
        {
          label: 'Overrides & Meta',
          fields: [
            {
              name: 'releaseDate',
              type: 'date',
              admin: {
                description: 'Premiere date for this specific season.',
              },
            },
            {
              name: 'newTalent',
              type: 'relationship',
              relationTo: 'talent',
              hasMany: true,
              admin: {
                description: 'Optional talent introduced or specific to this season.',
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
        description: 'Auto-generated from the season title.',
      },
    },
    {
      name: 'seasonStatus',
      type: 'select',
      enumName: 'season_status',
      label: 'Season Status',
      defaultValue: 'production',
      options: [
        {
          label: 'In Production',
          value: 'production',
        },
        {
          label: 'Airing',
          value: 'airing',
        },
        {
          label: 'Ended',
          value: 'ended',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}

export default Seasons
