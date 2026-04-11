// src/globals/SiteSettings.ts
import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: { group: 'Settings' },
  access: { read: () => true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General & SEO',
          fields: [
            { name: 'siteTitle', type: 'text', required: true, defaultValue: 'WaveNation' },
            { name: 'tagline', type: 'text', defaultValue: 'Music, Culture, & Radio' },
            { name: 'defaultSeoDescription', type: 'textarea', maxLength: 160 },
            {
              name: 'defaultShareImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Fallback image for social sharing (1200x630).' },
            },
          ],
        },
        {
          label: 'Social Links',
          fields: [
            { name: 'instagramUrl', type: 'text' },
            { name: 'twitterUrl', type: 'text' },
            { name: 'youtubeUrl', type: 'text' },
            { name: 'tiktokUrl', type: 'text' },
          ],
        },
      ],
    },
  ],
}
