// src/globals/Homepage.ts (Using Global since there's only one Homepage)
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
          slug: 'adZoneInsert',
          fields: [{ name: 'adZone', type: 'relationship', relationTo: 'adZones', required: true }],
        },
      ],
    },
  ],
}
