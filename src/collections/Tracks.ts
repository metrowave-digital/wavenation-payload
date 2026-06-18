import type { CollectionConfig } from 'payload'

const MUSIC_GROUP = 'Music & Playlists'

type AccessArgs = {
  req: {
    user?: unknown
  }
}

type HookArgs = {
  data?: Record<string, unknown>
}

const formatSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const authenticated = ({ req }: AccessArgs) => Boolean(req.user)

const readTracks = ({ req }: AccessArgs) => {
  if (req.user) return true

  return {
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
    defaultColumns: ['title', 'artistName', 'genre', 'trackStatus', 'publishedAt', 'updatedAt'],
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
    beforeValidate: [
      ({ data }: HookArgs) => {
        if (!data) return data

        const title = typeof data.title === 'string' ? data.title : ''
        const artistName = typeof data.artistName === 'string' ? data.artistName : ''
        const existingSlug = typeof data.slug === 'string' ? data.slug : ''

        const base = [artistName, title].filter(Boolean).join(' ')

        if (base && !existingSlug) {
          data.slug = formatSlug(base)
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
              name: 'albumTitle',
              type: 'text',
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
                  name: 'isExplicit',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    width: '33.33%',
                  },
                },
              ],
            },
            {
              name: 'description',
              type: 'textarea',
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
                description: 'Upload the audio file if WaveNation will host the track preview or full audio.',
              },
            },
            {
              name: 'artwork',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'externalAudioUrl',
              type: 'text',
              admin: {
                description: 'Optional external stream, preview, or platform URL.',
              },
            },
            {
              name: 'spotifyUrl',
              type: 'text',
            },
            {
              name: 'appleMusicUrl',
              type: 'text',
            },
            {
              name: 'youtubeUrl',
              type: 'text',
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
                description: 'Internal notes for playlist placement, countdowns, or radio rotation.',
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
