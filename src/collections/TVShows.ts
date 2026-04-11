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
  if (typeof value === 'string' && value.trim()) return slugify(value)
  if (data?.title && (operation === 'create' || !value)) return slugify(data.title)
  return value
}

export const TVShows: CollectionConfig = {
  slug: 'tvShows',
  labels: { singular: 'TV Show', plural: 'TV Shows' },
  admin: {
    useAsTitle: 'title',
    group: 'Video & TV',
    defaultColumns: ['title', 'network', 'status'],
  },
  versions: { drafts: true },
  access: { read: () => true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Core Info',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'textarea' },
            {
              type: 'row',
              fields: [
                {
                  name: 'format',
                  type: 'select',
                  admin: { width: '50%' },
                  options: [
                    { label: 'Reality / Docuseries', value: 'reality' },
                    { label: 'Talk Show', value: 'talk' },
                    { label: 'Scripted Drama', value: 'drama' },
                    { label: 'Scripted Comedy', value: 'comedy' },
                    { label: 'Live Event / Award', value: 'event' },
                  ],
                },
                {
                  name: 'network',
                  type: 'select',
                  admin: { width: '50%' },
                  options: [
                    { label: 'WaveNation TV', value: 'wavenation' },
                    { label: 'Syndicated', value: 'syndicated' },
                  ],
                },
              ],
            },
            {
              name: 'sponsors',
              type: 'relationship',
              relationTo: 'sponsors',
              hasMany: true,
              admin: { description: 'Brands officially sponsoring or presenting this TV Show.' },
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
              admin: { description: 'Vertical 2:3 Poster' },
            },
            {
              name: 'heroBanner',
              type: 'upload',
              relationTo: 'media',
              admin: { description: '16:9 Landscape Banner' },
            },
            { name: 'trailer', type: 'upload', relationTo: 'media' },
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
              admin: { description: 'The seasons belonging to this TV Show.' },
            },
            { name: 'ageRating', type: 'select', options: ['TV-G', 'TV-PG', 'TV-14', 'TV-MA'] },
            { name: 'talent', type: 'relationship', relationTo: 'talent', hasMany: true },
            { name: 'genres', type: 'relationship', relationTo: 'categories', hasMany: true },
          ],
        },
      ],
    },
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
        { label: 'In Production', value: 'production' },
        { label: 'Airing', value: 'airing' },
        { label: 'Ended', value: 'ended' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}

export default TVShows
