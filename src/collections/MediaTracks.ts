// apps/cms/src/collections/MediaTracks.ts
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

export const MediaTracks: CollectionConfig = {
  slug: 'mediaTracks',
  labels: { singular: 'Track', plural: 'Tracks' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'primaryArtist', 'isrc', 'status', 'isIndie'],
    group: 'Music & Media',
  },
  versions: { drafts: true, maxPerDoc: 25 },
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
                { name: 'primaryArtist', type: 'text', required: true, admin: { width: '50%' } },
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
                {
                  name: 'isrc',
                  type: 'text',
                  unique: true,
                  admin: { width: '33%', description: 'Required for charts and royalty tracking.' },
                },
                { name: 'releaseDate', type: 'date', admin: { width: '33%' } },
                { name: 'label', type: 'text', admin: { width: '34%' } },
              ],
            },
            { name: 'explicit', type: 'checkbox', defaultValue: false },
            {
              name: 'coverArt',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Track-level artwork (if different from album).' },
            },
          ],
        },
        {
          label: 'Audio & Programming',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'audioFile',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { width: '50%', description: 'High-res internal file (WAV/MP3)' },
                },
                {
                  name: 'previewUrl',
                  type: 'text',
                  admin: {
                    width: '50%',
                    description: '30s preview URL (often synced from Spotify API)',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'bpm',
                  type: 'number',
                  admin: { width: '50%', description: 'Tempo / Beats Per Minute' },
                },
                {
                  name: 'musicalKey',
                  type: 'text',
                  admin: { width: '50%', placeholder: 'e.g., C# Minor' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'isIndie', type: 'checkbox', defaultValue: false, admin: { width: '33%' } },
                {
                  name: 'isRadioApproved',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { width: '33%' },
                },
                {
                  name: 'isChartEligible',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: { width: '34%' },
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
              admin: { description: 'Map this track to external platforms.' },
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
                      admin: { width: '35%', description: 'e.g., Spotify Track ID' },
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
          label: 'Taxonomy & Metrics',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'genres',
                  type: 'select',
                  hasMany: true,
                  admin: { width: '50%' },
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
                  name: 'moods',
                  type: 'select',
                  hasMany: true,
                  admin: { width: '50%' },
                  options: [
                    'Chill',
                    'Upbeat',
                    'Late Night',
                    'Inspirational',
                    'Party',
                    'Romantic',
                    'Reflective',
                  ],
                },
              ],
            },
            {
              name: 'metrics',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'radioPlays', type: 'number', admin: { width: '33%' } },
                    { name: 'streams', type: 'number', admin: { width: '33%' } },
                    { name: 'listenerVotes', type: 'number', admin: { width: '34%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Rights & Sourcing',
          fields: [
            {
              name: 'source',
              type: 'select',
              options: [
                { label: 'Label Submission', value: 'label' },
                { label: 'Creator Hub', value: 'creator' },
                { label: 'Internal Upload', value: 'internal' },
              ],
            },
            {
              name: 'creator',
              type: 'relationship',
              relationTo: 'users',
              admin: { condition: (_, data) => data?.source === 'creator' },
            },
            {
              name: 'rights',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'rightsHolder', type: 'text', admin: { width: '50%' } },
                    { name: 'publishing', type: 'text', admin: { width: '50%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'territories', type: 'text', admin: { width: '50%' } },
                    { name: 'expiryDate', type: 'date', admin: { width: '50%' } },
                  ],
                },
              ],
            },
          ],
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
        { label: 'Under Review', value: 'review' },
        { label: 'Approved', value: 'approved' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'album',
      type: 'relationship',
      relationTo: 'albums',
      admin: { position: 'sidebar', description: 'Album this track belongs to.' },
    },
    { name: 'editorialNotes', type: 'textarea', admin: { position: 'sidebar' } },
  ],
}

export default MediaTracks
