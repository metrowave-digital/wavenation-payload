// apps/cms/src/collections/Albums.ts
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

export const Albums: CollectionConfig = {
  slug: 'albums',
  labels: { singular: 'Album', plural: 'Albums' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'primaryArtist', 'albumType', 'releaseDate', 'status'],
    group: 'Music & Media',
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
                { name: 'title', type: 'text', required: true, admin: { width: '50%' } },
                {
                  name: 'albumType',
                  type: 'select',
                  defaultValue: 'album',
                  admin: { width: '50%' },
                  options: [
                    { label: 'Album', value: 'album' },
                    { label: 'EP', value: 'ep' },
                    { label: 'Single', value: 'single' },
                    { label: 'Compilation', value: 'compilation' },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'primaryArtist', type: 'text', required: true, admin: { width: '50%' } },
                { name: 'label', type: 'text', admin: { width: '50%' } },
              ],
            },
            {
              name: 'featuredArtists',
              type: 'array',
              fields: [{ name: 'name', type: 'text' }],
            },
            {
              type: 'row',
              fields: [
                { name: 'releaseDate', type: 'date', admin: { width: '50%' } },
                {
                  name: 'upc',
                  type: 'text',
                  admin: { width: '50%', description: 'UPC / EAN Barcode' },
                },
              ],
            },
            { name: 'coverArt', type: 'upload', relationTo: 'media', required: true },
          ],
        },
        {
          label: 'Tracklist',
          fields: [
            {
              name: 'tracks',
              type: 'relationship',
              relationTo: 'mediaTracks',
              hasMany: true,
              admin: { description: 'Internal tracks associated with this album.' },
            },
            {
              name: 'manualTracks',
              type: 'array',
              admin: {
                description: 'Optional manual track list for unreleased or external tracks.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'title', type: 'text', required: true, admin: { width: '50%' } },
                    { name: 'artist', type: 'text', admin: { width: '50%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'duration',
                      type: 'text',
                      admin: { width: '50%', placeholder: '03:45' },
                    },
                    { name: 'isExplicit', type: 'checkbox', admin: { width: '50%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'DSP Integrations',
          fields: [
            {
              name: 'dspLinks',
              type: 'array',
              admin: {
                description: 'Map this album to external platforms (Spotify, Apple Music, etc.)',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'provider',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'Spotify', value: 'spotify' },
                        { label: 'Apple Music', value: 'appleMusic' },
                        { label: 'Tidal', value: 'tidal' },
                        { label: 'Audiomack', value: 'audiomack' },
                      ],
                      admin: { width: '30%' },
                    },
                    {
                      name: 'platformId',
                      type: 'text',
                      admin: { width: '35%', description: 'e.g., Spotify Album ID' },
                    },
                    {
                      name: 'url',
                      type: 'text',
                      admin: { width: '35%', description: 'Public Share URL' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Editorial',
          fields: [{ name: 'editorialNotes', type: 'textarea' }],
        },
      ],
    },
    /* ===============================
       Sidebar Fields
    =============================== */
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
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'isFeaturedRelease',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Highlights this album in the homepage Featured Release slot.',
      },
    },
  ],
}

export default Albums
