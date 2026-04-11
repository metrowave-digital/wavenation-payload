import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: {
    group: 'Settings',
    description: 'Global branding, SEO, and contact information.',
  },
  access: { read: () => true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General & SEO',
          fields: [
            {
              name: 'siteTitle',
              type: 'text',
              required: true,
              defaultValue: 'WaveNation',
            },
            {
              name: 'tagline',
              type: 'text',
              defaultValue: 'Music, Culture, & Radio',
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Site favicon (usually 32x32px .ico or .png).' },
            },
            {
              name: 'appleTouchIcon',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Icon for mobile bookmarks (180x180px).' },
            },
            {
              name: 'defaultSeoDescription',
              type: 'textarea',
              maxLength: 160,
            },
            {
              name: 'defaultShareImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Fallback image for social sharing (1200x630).' },
            },
          ],
        },
        {
          label: 'Branding',
          fields: [
            {
              name: 'logoLight',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Logo for dark backgrounds.' },
            },
            {
              name: 'logoDark',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Logo for light backgrounds.' },
            },
          ],
        },
        {
          label: 'Contact Info',
          fields: [
            {
              name: 'address',
              type: 'textarea',
              admin: { description: 'Physical address for the footer.' },
            },
            {
              name: 'phone',
              type: 'text',
            },
            {
              name: 'email',
              type: 'text',
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
            { name: 'facebookUrl', type: 'text' },
          ],
        },
      ],
    },
  ],
}
