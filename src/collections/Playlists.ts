// src/collections/Playlists.ts
import type { CollectionConfig, FieldHook, CollectionBeforeChangeHook } from 'payload'

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const hasEditorAccess = (req: any): boolean =>
  Boolean(req.user?.roles?.some((role: string) => ['editor', 'admin'].includes(role)))

const hasAdminAccess = (req: any): boolean => Boolean(req.user?.roles?.includes('admin'))

const autoSlug: FieldHook = ({ data, operation, value }) => {
  if (typeof value === 'string' && value.trim()) return slugify(value)
  if (data?.title && (operation === 'create' || !value)) return slugify(data.title)
  return value
}

// Auto-calculate track count before saving
const calculatePlaylistMetrics: CollectionBeforeChangeHook = ({ data }) => {
  if (Array.isArray(data.tracks)) {
    data.totalTracks = data.tracks.length
  } else {
    data.totalTracks = 0
  }
  return data
}

export const Playlists: CollectionConfig = {
  slug: 'playlists',
  labels: {
    singular: 'Playlist',
    plural: 'Playlists',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Music & Programming',
    defaultColumns: ['title', 'playlistType', 'featured', 'totalTracks', 'publishDate'],
    description:
      'Editorial, chart, creator, and sponsored playlists used across WaveNation surfaces.',
  },
  access: {
    read: () => true,
    create: ({ req }) => hasEditorAccess(req),
    update: ({ req }) => hasEditorAccess(req),
    delete: ({ req }) => hasAdminAccess(req),
  },
  versions: {
    drafts: {
      autosave: { interval: 300 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
  timestamps: true,
  hooks: {
    beforeChange: [
      calculatePlaylistMetrics,
      ({ data }) => {
        if (!data?.publishDate) return data
        return data
      },
    ],
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
              admin: { description: 'Public-facing playlist title.' },
            },
            {
              name: 'slug',
              type: 'text',
              unique: true,
              index: true,
              hooks: { beforeValidate: [autoSlug] },
              admin: { description: 'URL-safe slug. Auto-generated from title if left blank.' },
            },
            {
              name: 'playlistType',
              type: 'select',
              required: true,
              options: [
                { label: 'Chart Playlist', value: 'chart' },
                { label: 'Editorial', value: 'editorial' },
                { label: 'Creator Curated', value: 'creator' },
                { label: 'Sponsored', value: 'sponsored' },
              ],
              admin: { description: 'Determines playlist ownership and workflow.' },
            },
            {
              name: 'description',
              type: 'textarea',
              admin: { description: 'Public description used on playlist pages and embeds.' },
            },
            {
              name: 'shortDescription',
              type: 'text',
              maxLength: 180,
              admin: { description: 'Short summary for cards, previews, and app surfaces.' },
            },
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Primary artwork for the playlist.' },
            },
            {
              name: 'featured',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Marks the playlist for homepage or editorial spotlight placement.',
              },
            },
            {
              name: 'publishDate',
              type: 'date',
              admin: {
                position: 'sidebar',
                date: { pickerAppearance: 'dayAndTime' },
                description: 'Used for scheduling and sorting published playlists.',
              },
            },
          ],
        },

        {
          label: 'Curation & Metadata',
          fields: [
            {
              name: 'curator',
              type: 'relationship',
              relationTo: 'users',
              admin: {
                description: 'Primary editor, DJ, or curator responsible for the playlist.',
              },
            },
            {
              name: 'genres',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'R&B', value: 'rnb' },
                { label: 'Hip-Hop', value: 'hiphop' },
                { label: 'Southern Soul', value: 'southern-soul' },
                { label: 'Gospel', value: 'gospel' },
                { label: 'Jazz', value: 'jazz' },
                { label: 'House', value: 'house' },
                { label: 'Club', value: 'club' },
                { label: 'Afrobeats', value: 'afrobeats' },
                { label: 'Soul', value: 'soul' },
                { label: 'Mixed', value: 'mixed' },
              ],
            },
            {
              name: 'moods',
              type: 'relationship',
              relationTo: 'moods',
              hasMany: true,
              admin: { description: 'Link to defined Mood taxonomies.' },
            },
            {
              name: 'platformTags',
              type: 'text',
              hasMany: true,
              admin: {
                description: 'Freeform tags for internal discovery and editorial organization.',
              },
            },
            {
              name: 'playlistNotes',
              type: 'textarea',
              admin: { description: 'Internal curation rationale, notes, or governance comments.' },
              access: {
                read: ({ req }) => hasEditorAccess(req),
                update: ({ req }) => hasEditorAccess(req),
              },
            },
            {
              name: 'sponsor',
              type: 'relationship',
              relationTo: 'sponsors',
              admin: {
                condition: (_, siblingData) => siblingData?.playlistType === 'sponsored',
                description: 'Official sponsor for this branded playlist.',
              },
            },
            {
              name: 'editorialApprovalStatus',
              type: 'select',
              defaultValue: 'pending',
              options: [
                { label: 'Pending', value: 'pending' },
                { label: 'Approved', value: 'approved' },
                { label: 'Needs Revision', value: 'needs-revision' },
              ],
              access: {
                read: ({ req }) => hasEditorAccess(req),
                update: ({ req }) => hasEditorAccess(req),
              },
              admin: { description: 'Internal review workflow status.' },
            },
          ],
        },

        {
          label: 'Tracks',
          fields: [
            {
              name: 'tracks',
              type: 'array',
              minRows: 1,
              admin: { description: 'Ordered list of tracks included in this playlist.' },
              validate: (value: unknown) => {
                if (!Array.isArray(value)) return true
                const orders = value
                  .map((item: { order?: number | null }) => item?.order)
                  .filter((order): order is number => typeof order === 'number')
                const hasDuplicates = new Set(orders).size !== orders.length
                if (hasDuplicates) return 'Track order values must be unique.'
                return true
              },
              fields: [
                { name: 'track', type: 'relationship', relationTo: 'mediaTracks', required: true },
                { name: 'order', type: 'number', required: true, admin: { width: '50%', step: 1 } },
                {
                  name: 'isFeatured',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    width: '50%',
                    description: 'Highlights a priority or spotlight track within the playlist.',
                  },
                },
                {
                  name: 'editorNote',
                  type: 'text',
                  admin: {
                    description: 'Optional internal note about why this track is included.',
                  },
                  access: {
                    read: ({ req }) => hasEditorAccess(req),
                    update: ({ req }) => hasEditorAccess(req),
                  },
                },
              ],
            },
          ],
        },

        {
          label: 'DSP & API Sync',
          fields: [
            {
              name: 'dspIntegrations',
              type: 'array',
              admin: {
                description:
                  'Manage API IDs and Sync Statuses for external platforms like Spotify and Apple Music.',
              },
              fields: [
                {
                  name: 'provider',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Spotify', value: 'spotify' },
                    { label: 'Apple Music', value: 'appleMusic' },
                    { label: 'YouTube Music', value: 'youtubeMusic' },
                    { label: 'Audiomack', value: 'audiomack' },
                    { label: 'Tidal', value: 'tidal' },
                  ],
                  admin: { width: '50%' },
                },
                {
                  name: 'platformId',
                  type: 'text',
                  admin: {
                    width: '50%',
                    description:
                      'The official Playlist ID from the DSP (e.g., 37i9dQZF1DXcBWIGoYBM5M).',
                  },
                },
                {
                  name: 'publicUrl',
                  type: 'text',
                  admin: {
                    description: 'The public sharable link (e.g., open.spotify.com/playlist/...)',
                  },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'syncStatus',
                      type: 'select',
                      defaultValue: 'pending',
                      options: [
                        { label: 'Pending / Out of Sync', value: 'pending' },
                        { label: 'Synced', value: 'synced' },
                        { label: 'Failed', value: 'failed' },
                      ],
                      admin: { width: '33%', readOnly: true }, // Usually updated by your backend API webhook
                    },
                    { name: 'lastSyncedAt', type: 'date', admin: { width: '33%', readOnly: true } },
                    {
                      name: 'autoSync',
                      type: 'checkbox',
                      defaultValue: true,
                      admin: {
                        width: '33%',
                        description: 'Enable automatic push to this DSP via API.',
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: 'distributionStatus',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'Website', value: 'website' },
                { label: 'Mobile App', value: 'mobile-app' },
                { label: 'TV App', value: 'tv-app' },
              ],
              admin: { description: 'Internal surfaces where the playlist is visible.' },
            },
          ],
        },

        {
          label: 'SEO',
          fields: [
            { name: 'seoTitle', type: 'text', maxLength: 60 },
            { name: 'seoDescription', type: 'textarea', maxLength: 160 },
            { name: 'socialImage', type: 'upload', relationTo: 'media' },
          ],
        },
      ],
    },
    /* ===============================
       Sidebar Fields (Auto-Calculated)
    =============================== */
    {
      name: 'totalTracks',
      type: 'number',
      admin: { position: 'sidebar', readOnly: true, description: 'Auto-calculated sum of tracks.' },
    },
  ],
}

export default Playlists
