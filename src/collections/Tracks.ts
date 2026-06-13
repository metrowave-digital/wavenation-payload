import type { CollectionConfig } from 'payload'

const MUSIC_GROUP = 'Music & Playlists'

const formatSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const Tracks: CollectionConfig = {
  slug: 'tracks',
  labels: {
    singular: 'Track',
    plural: 'Tracks',
  },
  admin: {
    group: MUSIC_GROUP,
    useAsTitle: 'title',
    defaultColumns: ['title', 'artistName', 'releaseDate', 'explicit', 'reviewStatus', 'updatedAt'],
  },
  versions: {
    drafts: true,
    maxPerDoc: 50,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data

        const base = [data.artistName, data.title].filter(Boolean).join(' ')
        if (base && !data.slug) {
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
              type: 'row',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  index: true,
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'artistName',
                  type: 'text',
                  index: true,
                  admin: {
                    width: '50%',
                  },
                },
              ],
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
              name: 'featuredArtists',
              type: 'array',
              labels: {
                singular: 'Featured Artist',
                plural: 'Featured Artists',
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'albumOrProject',
                  type: 'text',
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'trackType',
                  type: 'select',
                  defaultValue: 'single',
                  options: [
                    { label: 'Single', value: 'single' },
                    { label: 'Album Track', value: 'album-track' },
                    { label: 'EP Track', value: 'ep-track' },
                    { label: 'Remix', value: 'remix' },
                    { label: 'Live Version', value: 'live-version' },
                    { label: 'Freestyle', value: 'freestyle' },
                    { label: 'Other', value: 'other' },
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
                  name: 'releaseDate',
                  type: 'date',
                  index: true,
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'releaseYear',
                  type: 'number',
                  admin: {
                    width: '25%',
                  },
                },
                {
                  name: 'explicit',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    width: '25%',
                  },
                },
              ],
            },
            {
              name: 'genres',
              type: 'relationship',
              relationTo: 'genres',
              hasMany: true,
            },
            {
              name: 'moods',
              type: 'relationship',
              relationTo: 'moods',
              hasMany: true,
            },
          ],
        },
        {
          label: 'Audio & Artwork',
          fields: [
            {
              name: 'artwork',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Album/single artwork. Square preferred.',
              },
            },
            {
              name: 'audioFile',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description:
                  'Hosted WAV/MP3 file. Make sure your media collection allows audio MIME types.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'duration',
                  type: 'text',
                  admin: {
                    width: '33.33%',
                    description: 'Example: 3:42',
                  },
                },
                {
                  name: 'bpm',
                  type: 'number',
                  admin: {
                    width: '33.33%',
                  },
                },
                {
                  name: 'musicalKey',
                  type: 'text',
                  admin: {
                    width: '33.33%',
                    description: 'Example: A minor',
                  },
                },
              ],
            },
            {
              name: 'previewStartSeconds',
              type: 'number',
              admin: {
                description: 'Optional start time for preview clips.',
              },
            },
          ],
        },
        {
          label: 'Platform Links',
          fields: [
            {
              name: 'platformLinks',
              type: 'group',
              fields: [
                {
                  name: 'spotify',
                  type: 'text',
                },
                {
                  name: 'appleMusic',
                  type: 'text',
                },
                {
                  name: 'youtubeMusic',
                  type: 'text',
                },
                {
                  name: 'youtube',
                  type: 'text',
                },
                {
                  name: 'audiomack',
                  type: 'text',
                },
                {
                  name: 'tidal',
                  type: 'text',
                },
                {
                  name: 'pandora',
                  type: 'text',
                },
                {
                  name: 'soundCloud',
                  type: 'text',
                },
                {
                  name: 'bandcamp',
                  type: 'text',
                },
                {
                  name: 'officialWebsite',
                  type: 'text',
                },
              ],
            },
          ],
        },
        {
          label: 'Rights & Metadata',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'isrc',
                  type: 'text',
                  index: true,
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'upc',
                  type: 'text',
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
                  name: 'labelName',
                  type: 'text',
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'copyrightOwner',
                  type: 'text',
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'publisher',
              type: 'text',
            },
            {
              name: 'copyrightStatement',
              type: 'textarea',
            },
            {
              name: 'rightsConfirmed',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description:
                  'Editorial/legal checkbox confirming rights were reviewed before placement.',
              },
            },
            {
              name: 'rightsNotes',
              type: 'textarea',
            },
            {
              name: 'independentRelease',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
        {
          label: 'Creator Hub & Review',
          fields: [
            {
              name: 'source',
              type: 'select',
              defaultValue: 'internal',
              options: [
                { label: 'Internal Pick', value: 'internal' },
                { label: 'Creator Hub Submission', value: 'creator-hub' },
                { label: 'Label Submission', value: 'label-submission' },
                { label: 'Artist Direct', value: 'artist-direct' },
                { label: 'Publicist', value: 'publicist' },
                { label: 'Social/Culture Trend', value: 'social-trend' },
                { label: 'Other', value: 'other' },
              ],
            },
            {
              name: 'submittedBy',
              type: 'relationship',
              relationTo: 'users',
              admin: {
                description:
                  'Optional user/creator relationship. Change relationTo if your creator profile slug is different.',
              },
            },
            {
              name: 'creatorHubChannelId',
              type: 'text',
            },
            {
              name: 'submissionEmail',
              type: 'email',
            },
            {
              name: 'reviewStatus',
              type: 'select',
              defaultValue: 'pending',
              index: true,
              options: [
                { label: 'Pending Review', value: 'pending' },
                { label: 'Metadata Needed', value: 'metadata-needed' },
                { label: 'Rights Review', value: 'rights-review' },
                { label: 'Approved', value: 'approved' },
                { label: 'Rejected', value: 'rejected' },
                { label: 'Removed / Hold', value: 'removed-hold' },
              ],
            },
            {
              name: 'qualityScore',
              type: 'number',
              admin: {
                description: 'Optional internal 1-10 quality score.',
              },
            },
            {
              name: 'brandSafetyNotes',
              type: 'textarea',
            },
            {
              name: 'reviewNotes',
              type: 'textarea',
            },
          ],
        },
        {
          label: 'Publishing',
          fields: [
            {
              name: 'publishedAt',
              type: 'date',
              index: true,
            },
            {
              name: 'isFeatured',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'editorialPriority',
              type: 'select',
              defaultValue: 'normal',
              options: [
                { label: 'Low', value: 'low' },
                { label: 'Normal', value: 'normal' },
                { label: 'High', value: 'high' },
                { label: 'Major Priority', value: 'major-priority' },
              ],
            },
            {
              name: 'approvedForPlaylists',
              type: 'relationship',
              relationTo: 'playlists',
              hasMany: true,
              admin: {
                description: 'Optional tracking for playlists this track is cleared for.',
              },
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
            {
              name: 'socialCard',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
      ],
    },
  ],
}
