import type { GlobalConfig } from 'payload'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  admin: { group: 'Settings', description: 'Construct the dynamic homepage layout.' },
  access: { read: () => true },
  fields: [
    {
      name: 'modules',
      type: 'blocks',
      blocks: [
        {
          slug: 'featuredHero',
          labels: { singular: 'Featured Hero', plural: 'Featured Heroes' },
          fields: [{ name: 'featuredArticle', type: 'relationship', relationTo: 'articles' }],
        },
        {
          slug: 'eventSpotlight',
          labels: { singular: 'Event Spotlight', plural: 'Event Spotlights' },
          fields: [
            {
              name: 'title',
              type: 'text',
              admin: { description: 'Leave blank to use default "LIVE FROM THE STATION"' },
            },
            {
              name: 'manualEvent',
              type: 'relationship',
              relationTo: 'events',
              admin: {
                description:
                  'Optional: Manually pin a specific event. Otherwise, the latest live/upcoming event shows automatically.',
              },
            },
          ],
        },
        {
          slug: 'artistSpotlightFeature',
          labels: { singular: 'Artist Spotlight', plural: 'Artist Spotlights' },
          fields: [
            {
              name: 'spotlightArticle',
              type: 'relationship',
              relationTo: 'articles',
              required: true,
              filterOptions: () => ({
                'subcategories.slug': { equals: 'artist-profiles' },
              }),
            },
          ],
        },
        {
          slug: 'spotlightArticles',
          labels: { singular: 'Spotlight Articles (Under Slider)', plural: 'Spotlight Articles' },
          fields: [
            {
              name: 'articles',
              type: 'relationship',
              relationTo: 'articles',
              hasMany: true,
              maxRows: 2,
              admin: {
                description:
                  'Select up to 2 featured articles to display side-by-side under the main slider.',
              },
            },
          ],
        },
        {
          slug: 'contentGrid',
          fields: [
            { name: 'title', type: 'text' },
            { name: 'type', type: 'select', options: ['Articles', 'VOD', 'Events'] },
            {
              name: 'manualItems',
              type: 'relationship',
              relationTo: ['articles', 'vod', 'events'],
              hasMany: true,
            },
          ],
        },
        {
          slug: 'adPlacementInsert',
          fields: [
            {
              name: 'adPlacement',
              type: 'relationship',
              relationTo: 'ad-placements',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
