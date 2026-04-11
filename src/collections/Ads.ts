import type { CollectionConfig } from 'payload'

export const Ads: CollectionConfig = {
  slug: 'ads',
  labels: { singular: 'Ad Campaign', plural: 'Ad Inventory' },
  admin: {
    useAsTitle: 'campaignName',
    group: 'Monetization',
    defaultColumns: ['campaignName', 'sponsor', 'adType', 'status'],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Campaign Details',
          fields: [
            { name: 'campaignName', type: 'text', required: true },
            {
              type: 'row',
              fields: [
                {
                  name: 'sponsor',
                  type: 'relationship',
                  relationTo: 'sponsors',
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'adType',
                  type: 'select',
                  required: true,
                  options: [
                    'Video Pre-Roll',
                    'Video Mid-Roll',
                    'Audio Spot',
                    'Display Banner',
                    'Native In-Feed',
                  ],
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'destinationUrl',
              type: 'text',
              admin: { description: 'Where the user goes when they click.' },
            },
          ],
        },
        {
          label: 'GAM & Video Delivery (SSAI)',
          admin: {
            condition: (_, data) =>
              ['Video Pre-Roll', 'Video Mid-Roll', 'Audio Spot'].includes(data?.adType),
          },
          fields: [
            {
              name: 'vastUrl',
              type: 'text',
              admin: { description: 'Primary VAST/VPAID Tag URL from Google Ad Manager.' },
            },
            {
              name: 'ssaiFallbackVideo',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Direct video file upload for hard-coded fallback if VAST fails.',
              },
            },
            {
              name: 'muxAssetId',
              type: 'text',
              admin: { description: 'If using Mux SSAI, the specific Mux Asset ID of this ad.' },
            },
          ],
        },
        {
          label: 'Display Delivery',
          admin: {
            condition: (_, data) => ['Display Banner', 'Native In-Feed'].includes(data?.adType),
          },
          fields: [
            { name: 'desktopImage', type: 'upload', relationTo: 'media' },
            { name: 'mobileImage', type: 'upload', relationTo: 'media' },
            { name: 'headline', type: 'text' },
            { name: 'ctaText', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: ['draft', 'active', 'paused', 'completed'],
      admin: { position: 'sidebar' },
    },
    { name: 'startDate', type: 'date', admin: { position: 'sidebar' } },
    { name: 'endDate', type: 'date', admin: { position: 'sidebar' } },
  ],
}
