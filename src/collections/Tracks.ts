import type { Access, CollectionBeforeValidateHook, CollectionConfig, Where } from 'payload'

const MUSIC_GROUP = 'Music & Playlists'

type PayloadAccessArgs = Parameters<Access>[0]

const formatSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const authenticated: Access = (args: PayloadAccessArgs) => {
  return Boolean(args.req.user)
}

const publicTracksWhere: Where = {
  and: [
    {
      _status: {
        equals: 'published',
      },
    },
    {
      trackStatus: {
        equals: 'published',
      },
    },
  ],
}

const readTracks: Access = (args: PayloadAccessArgs) => {
  if (args.req.user) return true

  return publicTracksWhere
}

const populateTrackSlug: CollectionBeforeValidateHook = (args) => {
  const data = args.data as Record<string, unknown> | undefined

  if (!data) return data

  const title = typeof data.title === 'string' ? data.title : ''
  const artistName = typeof data.artistName === 'string' ? data.artistName : ''
  const existingSlug = typeof data.slug === 'string' ? data.slug : ''

  const base = [artistName, title].filter(Boolean).join(' ')

  if (base && !existingSlug) {
    data.slug = formatSlug(base)
  }

  return data
}

export const Tracks: CollectionConfig = {
  slug: 'tracks',
  labels: {
    singular: 'Track',
    plural: 'Tracks',
  },
  admin: {
    group: MUSIC_GROUP,
    useAsTitle: 'title',
    defaultColumns: [
      'title',
      'artistName',
      'genre',
      'trackStatus',
      'publishedAt',
      'updatedAt',
    ],
  },

  access: {
    read: readTracks,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },

  versions: {
    drafts: true,
    maxPerDoc: 75,
  },

  hooks: {
    beforeValidate: [populateTrackSlug],
  },

  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Track Info',
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
              admin: {
                description: 'Auto-generated from artist name and title if left blank.',
              },
            },
            {
              name: 'artistName',
              type: 'text',
              required: true,
              index: true,
            },
            {
              name: 'featuredArtists',
              type: 'text',
              admin: {
                description: 'Optional. Example: feat. Artist Name',
              },
            },
            {
              name: 'albumOrProject',
              type: 'text',
              admin: {
                description: 'Album, EP, mixtape, or project title.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'genre',
                  type: 'select',
                  index: true,
                  admin: {
                    width: '33.33%',
                  },
                  options: [
                    { label: 'R&B/Soul', value: 'rb_soul' },
                    { label: 'Hip-Hop', value: 'hip_hop' },
                    { label: 'Gospel', value: 'gospel' },
                    { label: 'Southern Soul', value: 'southern_soul' },
                    { label: 'Jazz', value: 'jazz' },
                    { label: 'House', value: 'house' },
                    { label: 'Afrobeats', value: 'afrobeats' },
                    { label: 'Pop', value: 'pop' },
                    { label: 'Other', value: 'other' },
                  ],
                },
                {
                  name: 'duration',
                  type: 'text',
                  admin: {
                    width: '33.33%',
                    description: 'Example: 3:45',
                  },
                },
                {
                  name: 'explicit',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    width: '33.33%',
                    description: 'Check if the track contains explicit content.',
                  },
                },
              ],
            },
            {
              name: 'description',
              type: 'textarea',
              admin: {
                description: 'Short public-facing track description or editorial note.',
              },
            },
          ],
        },
        {
          label: 'Media',
          fields: [
            {
              name: 'audioFile',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description:
                  'Upload an audio file if WaveNation will host a preview or full track.',
              },
            },
            {
              name: 'artwork',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Track cover art. Square artwork is recommended.',
              },
            },
            {
              name: 'externalAudioUrl',
              type: 'text',
              admin: {
                description: 'Optional external preview, stream, or audio URL.',
              },
            },
            {
              name: 'platformLinks',
              type: 'array',
              labels: {
                singular: 'Platform Link',
                plural: 'Platform Links',
              },
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Spotify', value: 'spotify' },
                    { label: 'Apple Music', value: 'apple_music' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'SoundCloud', value: 'soundcloud' },
                    { label: 'Audiomack', value: 'audiomack' },
                    { label: 'Bandcamp', value: 'bandcamp' },
                    { label: 'Website', value: 'website' },
                    { label: 'Other', value: 'other' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Credits',
          fields: [
            {
              name: 'labelName',
              type: 'text',
            },
            {
              name: 'producerName',
              type: 'text',
            },
            {
              name: 'songwriters',
              type: 'array',
              labels: {
                singular: 'Songwriter',
                plural: 'Songwriters',
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'performers',
              type: 'array',
              labels: {
                singular: 'Performer',
                plural: 'Performers',
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'role',
                  type: 'text',
                  admin: {
                    description: 'Example: Lead vocal, background vocal, guitar, keys.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Chart / Playlist Use',
          fields: [
            {
              name: 'moodTags',
              type: 'array',
              labels: {
                singular: 'Mood Tag',
                plural: 'Mood Tags',
              },
              fields: [
                {
                  name: 'tag',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'playlistNotes',
              type: 'textarea',
              admin: {
                description:
                  'Internal notes for playlist placement, countdowns, or radio rotation.',
              },
            },
            {
              name: 'isFeatured',
              type: 'checkbox',
              defaultValue: false,
              index: true,
            },
            {
              name: 'isIndieSpotlight',
              type: 'checkbox',
              defaultValue: false,
              index: true,
            },
            {
              name: 'isStaffPick',
              type: 'checkbox',
              defaultValue: false,
              index: true,
            },
          ],
        },
        {
          label: 'Publishing',
          fields: [
            {
              name: 'trackStatus',
              type: 'select',
              defaultValue: 'draft',
              index: true,
              options: [
                { label: 'Draft', value: 'draft' },
                { label: 'In Review', value: 'in_review' },
                { label: 'Approved', value: 'approved' },
                { label: 'Published', value: 'published' },
                { label: 'Archived', value: 'archived' },
              ],
            },
            {
              name: 'publishedAt',
              type: 'date',
              index: true,
            },
            {
              name: 'releaseDate',
              type: 'date',
              index: true,
            },
            {
              name: 'internalNotes',
              type: 'textarea',
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
          ],
        },
      ],
    },
  ],
}
