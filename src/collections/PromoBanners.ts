import type { CollectionConfig } from 'payload'

export const PromoBanners: CollectionConfig = {
  slug: 'promoBanners',
  labels: { singular: 'Promo Banner', plural: 'Promo Banners' },
  admin: {
    useAsTitle: 'internalName',
    group: 'Marketing',
    defaultColumns: ['internalName', 'placement', 'status'],
  },
  fields: [
    {
      name: 'internalName',
      type: 'text',
      required: true,
      admin: { description: 'e.g., "Summer Fest 2026 Presale"' },
    },
    {
      name: 'placement',
      type: 'select',
      hasMany: true,
      options: ['Homepage Hero', 'App Interstitial', 'Article Sidebar', 'Video Player Overlay'],
    },
    { name: 'headline', type: 'text', required: true },
    { name: 'subheadline', type: 'text' },
    {
      type: 'row',
      fields: [
        { name: 'ctaLabel', type: 'text', admin: { width: '50%' } },
        { name: 'ctaUrl', type: 'text', admin: { width: '50%' } },
      ],
    },
    { name: 'desktopAsset', type: 'upload', relationTo: 'media' },
    { name: 'mobileAsset', type: 'upload', relationTo: 'media' },
    {
      name: 'videoBackground',
      type: 'group',
      fields: [
        {
          name: 'cloudflarePlaybackId',
          type: 'text',
          admin: { description: 'For looping silent video backgrounds via Cloudflare Stream.' },
        },
      ],
    },
    {
      name: 'targeting',
      type: 'group',
      fields: [
        {
          name: 'audience',
          type: 'select',
          defaultValue: 'all',
          options: ['All Users', 'Logged Out Only', 'Logged In (Free)', 'WaveNation+ Premium'],
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'scheduled',
      options: ['draft', 'scheduled', 'live', 'ended'],
      admin: { position: 'sidebar' },
    },
    {
      name: 'startDate',
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },
  ],
}
