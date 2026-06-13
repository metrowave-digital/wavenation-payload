// src/collections/Sidebars.ts
import type { CollectionConfig } from 'payload'

export const Sidebars: CollectionConfig = {
  slug: 'sidebars',
  labels: { singular: 'Sidebar Layout', plural: 'Sidebar Layouts' },
  admin: { useAsTitle: 'internalName', group: 'Settings' },
  access: { read: () => true },
  fields: [
    { name: 'internalName', type: 'text', required: true },
    {
      name: 'widgets',
      type: 'blocks',
      blocks: [
        {
          slug: 'newsletter',
          fields: [
            { name: 'headline', type: 'text' },
            { name: 'hubspotFormId', type: 'text' },
          ],
        },
        { slug: 'trendingArticles', fields: [{ name: 'limit', type: 'number', defaultValue: 5 }] },
        {
          slug: 'adPlacements',
          fields: [{ name: 'zone', type: 'relationship', relationTo: 'ad-placements' }],
        },
        {
          slug: 'promoBanner',
          fields: [{ name: 'banner', type: 'relationship', relationTo: 'promo-banners' }],
        },
      ],
    },
  ],
}
