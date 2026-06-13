import type { CollectionConfig } from 'payload'

const MUSIC_GROUP = 'Music & Playlists'

const formatSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const ReleaseHighlights: CollectionConfig = {
  slug: 'release-highlights',
  labels: {
    singular: 'Release Highlight',
    plural: 'Release Highlights',
  },
  admin: {
    group: MUSIC_GROUP,
    useAsTitle: 'title',
    defaultColumns: [
      'title',
      'artistName',
      'highlightType',
      'releaseDate',
      'isFeatured',
      'updatedAt',
    ],
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
          label: 'Highlight',
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
              name: 'highlightType',
              type: 'select',
              defaultValue: 'track',
              index: true,
              options: [
                { label: 'Track / Single', value: 'track' },
                { label: 'Album', value: 'album' },
                { label: 'EP', value: 'ep' },
                { label: 'Music Video', value: 'music-video' },
                { label: 'Artist Announcement', value: 'artist-announcement' },
                { label: 'Playlist Drop', value: 'playlist-drop' },
                { label: 'Chart Moment', value: 'chart-moment' },
                { label: 'Creator Hub Release', value: 'creator-hub-release' },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'artistName',
                  type: 'text',
                  index: true,
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'labelName',
                  type: 'text',
                  admin: {
                    width: '50%',
                  },
                },
              ],
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
                    width: '50%',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Connections',
          fields: [
            {
              name: 'track',
              type: 'relationship',
              relationTo: 'tracks',
              admin: {
                description: 'Optional related track.',
              },
            },
            {
              name: 'playlist',
              type: 'relationship',
              relationTo: 'playlists',
              admin: {
                description: 'Optional related playlist.',
              },
            },
            {
              name: 'chart',
              type: 'relationship',
              relationTo: 'charts',
              admin: {
                description: 'Optional related chart.',
              },
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
            {
              name: 'submittedBy',
              type: 'relationship',
              relationTo: 'users',
              admin: {
                description: 'Optional creator/user connection. Change relationTo if needed.',
              },
            },
          ],
        },
        {
          label: 'Editorial',
          fields: [
            {
              name: 'shortDescription',
              type: 'text',
              admin: {
                description: 'Short copy for cards.',
              },
            },
            {
              name: 'editorialSummary',
              type: 'textarea',
              admin: {
                description: 'Longer write-up for web/app release modules.',
              },
            },
            {
              name: 'editorialAngle',
              type: 'select',
              defaultValue: 'new-release',
              options: [
                { label: 'New Release', value: 'new-release' },
                { label: 'Indie Spotlight', value: 'indie-spotlight' },
                { label: 'Staff Pick', value: 'staff-pick' },
                { label: 'Southern Soul Pick', value: 'southern-soul-pick' },
                { label: 'Gospel Pick', value: 'gospel-pick' },
                { label: 'R&B/Soul Pick', value: 'rb-soul-pick' },
                { label: 'Hip-Hop Pick', value: 'hip-hop-pick' },
                { label: 'Video Premiere', value: 'video-premiere' },
                { label: 'Chart Breakout', value: 'chart-breakout' },
              ],
            },
            {
              name: 'reviewStatus',
              type: 'select',
              defaultValue: 'pending',
              options: [
                { label: 'Pending', value: 'pending' },
                { label: 'Approved', value: 'approved' },
                { label: 'Needs Edits', value: 'needs-edits' },
                { label: 'Hold', value: 'hold' },
                { label: 'Archived', value: 'archived' },
              ],
            },
          ],
        },
        {
          label: 'Visuals',
          fields: [
            {
              name: 'coverArt',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'socialCard',
              type: 'upload',
              relationTo: 'media',
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
                { name: 'spotify', type: 'text' },
                { name: 'appleMusic', type: 'text' },
                { name: 'youtubeMusic', type: 'text' },
                { name: 'youtube', type: 'text' },
                { name: 'audiomack', type: 'text' },
                { name: 'tidal', type: 'text' },
                { name: 'pandora', type: 'text' },
                { name: 'soundCloud', type: 'text' },
                { name: 'bandcamp', type: 'text' },
                { name: 'officialWebsite', type: 'text' },
              ],
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
              index: true,
            },
            {
              name: 'featurePlacement',
              type: 'select',
              defaultValue: 'music-page',
              options: [
                { label: 'Homepage', value: 'homepage' },
                { label: 'Music Page', value: 'music-page' },
                { label: 'Genre Hub', value: 'genre-hub' },
                { label: 'Mobile App', value: 'mobile-app' },
                { label: 'Creator Hub', value: 'creator-hub' },
                { label: 'Radio Show Page', value: 'radio-show-page' },
              ],
            },
            {
              name: 'displayOrder',
              type: 'number',
              defaultValue: 100,
              index: true,
            },
            {
              name: 'ctaLabel',
              type: 'text',
              defaultValue: 'Listen Now',
            },
            {
              name: 'ctaUrl',
              type: 'text',
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
