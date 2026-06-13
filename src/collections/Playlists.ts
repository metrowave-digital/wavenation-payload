import type { CollectionConfig } from 'payload'

const MUSIC_GROUP = 'Music & Playlists'

const formatSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const Playlists: CollectionConfig = {
  slug: 'playlists',
  labels: {
    singular: 'Playlist',
    plural: 'Playlists',
  },
  admin: {
    group: MUSIC_GROUP,
    useAsTitle: 'title',
    defaultColumns: [
      'title',
      'playlistType',
      'updateCadence',
      'isSponsored',
      'isFeatured',
      'updatedAt',
    ],
  },
  versions: {
    drafts: true,
    maxPerDoc: 75,
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
          label: 'Basics',
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
                description: 'Auto-generated from the playlist title if left blank.',
              },
            },
            {
              name: 'playlistType',
              type: 'select',
              defaultValue: 'core-editorial',
              index: true,
              options: [
                { label: 'Core Editorial', value: 'core-editorial' },
                { label: 'Category / Genre', value: 'category' },
                { label: 'Mood-Based', value: 'mood' },
                { label: 'Seasonal', value: 'seasonal' },
                { label: 'Event / Festival', value: 'event' },
                { label: 'Creator-Curated', value: 'creator-curated' },
                { label: 'Sponsored', value: 'sponsored' },
                { label: 'Show Companion', value: 'show-companion' },
                { label: 'Archive / Catalog', value: 'archive' },
              ],
            },
            {
              name: 'shortDescription',
              type: 'text',
              admin: {
                description: 'Short line for playlist cards.',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              admin: {
                description: 'Full public playlist description.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'curatorName',
                  type: 'text',
                  admin: {
                    width: '50%',
                    description: 'Example: WaveNation FM, DJ name, editor name.',
                  },
                },
                {
                  name: 'curatorRole',
                  type: 'text',
                  admin: {
                    width: '50%',
                    description: 'Example: Music Director, Guest Curator.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Branding',
          fields: [
            {
              name: 'coverArt',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Square cover art for Spotify, Apple Music, cards, and app UI.',
              },
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Optional 16:9 or wide hero image.',
              },
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
                { label: 'Southern Heat', value: 'southern-heat' },
                { label: 'Custom', value: 'custom' },
              ],
            },
            {
              name: 'customAccentColor',
              type: 'text',
              admin: {
                description: 'Optional hex value.',
                condition: (_, siblingData) => siblingData?.accentColor === 'custom',
              },
            },
          ],
        },
        {
          label: 'Taxonomy',
          fields: [
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
            {
              name: 'tags',
              type: 'array',
              labels: {
                singular: 'Tag',
                plural: 'Tags',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                },
              ],
            },
            {
              name: 'targetAudience',
              type: 'select',
              defaultValue: 'all',
              options: [
                { label: 'All Audiences', value: 'all' },
                { label: 'Culture Consumer 25-45', value: 'culture-consumer' },
                { label: 'Multigenerational 45+', value: 'multigenerational' },
                { label: 'Creator Audience', value: 'creator-audience' },
                { label: 'Community Audience', value: 'community-audience' },
              ],
            },
          ],
        },
        {
          label: 'Tracklist',
          fields: [
            {
              name: 'tracks',
              type: 'array',
              labels: {
                singular: 'Playlist Track',
                plural: 'Playlist Tracks',
              },
              admin: {
                description:
                  'Manual order is controlled by the order of these rows. Drag rows to reorder.',
              },
              fields: [
                {
                  name: 'track',
                  type: 'relationship',
                  relationTo: 'tracks',
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'position',
                      type: 'number',
                      admin: {
                        width: '25%',
                        description: 'Optional display number.',
                      },
                    },
                    {
                      name: 'isNewThisWeek',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: {
                        width: '25%',
                      },
                    },
                    {
                      name: 'isFeaturedPlacement',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: {
                        width: '25%',
                      },
                    },
                    {
                      name: 'isIndieSpotlight',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: {
                        width: '25%',
                      },
                    },
                  ],
                },
                {
                  name: 'customTitle',
                  type: 'text',
                  admin: {
                    description:
                      'Use only if the track is not yet entered in the Tracks collection.',
                  },
                },
                {
                  name: 'customArtistName',
                  type: 'text',
                },
                {
                  name: 'editorialNote',
                  type: 'textarea',
                  admin: {
                    description: 'Optional note for website/app tracklist or internal curation.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Platform Links',
          fields: [
            {
              name: 'primaryPlatform',
              type: 'select',
              defaultValue: 'spotify',
              options: [
                { label: 'Spotify', value: 'spotify' },
                { label: 'Apple Music', value: 'apple-music' },
                { label: 'YouTube Music', value: 'youtube-music' },
                { label: 'YouTube', value: 'youtube' },
                { label: 'Audiomack', value: 'audiomack' },
                { label: 'Tidal', value: 'tidal' },
                { label: 'Pandora', value: 'pandora' },
                { label: 'SoundCloud', value: 'soundcloud' },
                { label: 'Bandcamp', value: 'bandcamp' },
                { label: 'WaveNation', value: 'wavenation' },
              ],
            },
            {
              name: 'platformLinks',
              type: 'group',
              fields: [
                { name: 'spotify', type: 'text' },
                { name: 'appleMusic', type: 'text' },
                { name: 'youtubeMusic', type: 'text' },
                { name: 'youtube', type: 'text' },
                { name: 'audiomack', type: 'text' },
                { name: 'tidal', type: 'text' },
                { name: 'pandora', type: 'text' },
                { name: 'soundCloud', type: 'text' },
                { name: 'bandcamp', type: 'text' },
                { name: 'wavenationEmbedUrl', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Sponsored',
          fields: [
            {
              name: 'isSponsored',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'sponsorName',
              type: 'text',
              admin: {
                condition: (_, siblingData) => Boolean(siblingData?.isSponsored),
              },
            },
            {
              name: 'sponsorLogo',
              type: 'upload',
              relationTo: 'media',
              admin: {
                condition: (_, siblingData) => Boolean(siblingData?.isSponsored),
              },
            },
            {
              name: 'sponsorUrl',
              type: 'text',
              admin: {
                condition: (_, siblingData) => Boolean(siblingData?.isSponsored),
              },
            },
            {
              name: 'sponsorDisclosure',
              type: 'textarea',
              defaultValue:
                'Sponsored Playlist. Final playlist selection remains editorially independent.',
              admin: {
                condition: (_, siblingData) => Boolean(siblingData?.isSponsored),
              },
            },
            {
              name: 'editorialIndependenceConfirmed',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                condition: (_, siblingData) => Boolean(siblingData?.isSponsored),
                description: 'Confirms sponsor suggestions did not override editorial selection.',
              },
            },
            {
              name: 'sponsorApprovalStatus',
              type: 'select',
              defaultValue: 'not-needed',
              options: [
                { label: 'Not Needed', value: 'not-needed' },
                { label: 'Pending', value: 'pending' },
                { label: 'Approved', value: 'approved' },
                { label: 'Needs Revision', value: 'needs-revision' },
              ],
              admin: {
                condition: (_, siblingData) => Boolean(siblingData?.isSponsored),
              },
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
              name: 'updateCadence',
              type: 'select',
              defaultValue: 'weekly',
              options: [
                { label: 'Weekly', value: 'weekly' },
                { label: 'Biweekly', value: 'biweekly' },
                { label: 'Monthly', value: 'monthly' },
                { label: 'Seasonal', value: 'seasonal' },
                { label: 'As Needed', value: 'as-needed' },
                { label: 'Archived', value: 'archived' },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'lastUpdated',
                  type: 'date',
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'nextUpdateDue',
                  type: 'date',
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'rotationTurnoverTarget',
              type: 'select',
              defaultValue: '20-40',
              options: [
                { label: 'No Set Target', value: 'none' },
                { label: '10-20%', value: '10-20' },
                { label: '20-40%', value: '20-40' },
                { label: '40%+', value: '40-plus' },
              ],
            },
            {
              name: 'isFeatured',
              type: 'checkbox',
              defaultValue: false,
              index: true,
            },
            {
              name: 'homepagePlacement',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'displayOrder',
              type: 'number',
              defaultValue: 100,
              index: true,
            },
            {
              name: 'relatedEditorialUrl',
              type: 'text',
              admin: {
                description: 'Optional link to a playlist article or weekly write-up.',
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
