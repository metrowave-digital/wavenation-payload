// src/collections/AdZones.ts
import type { CollectionConfig } from 'payload'

export const AdZones: CollectionConfig = {
  slug: 'adZones',
  labels: { singular: 'Ad Zone', plural: 'Ad Zones' },
  admin: {
    useAsTitle: 'zoneId',
    group: 'Monetization',
    description: 'Map active Ad Campaigns or Sponsors to specific UI slots on the frontend.',
  },
  access: { read: () => true },
  fields: [
    {
      name: 'zoneId',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'The hardcoded ID used by the frontend (e.g., "homepage-top-leaderboard").',
      },
    },
    { name: 'description', type: 'text', admin: { description: 'Where does this live?' } },
    {
      name: 'activeFill',
      type: 'group',
      fields: [
        {
          name: 'fillType',
          type: 'select',
          defaultValue: 'ad',
          options: [
            { label: 'Direct Ad Campaign', value: 'ad' },
            { label: 'Sponsor Logo/Link', value: 'sponsor' },
          ],
        },
        {
          name: 'adCampaign',
          type: 'relationship',
          relationTo: 'ads',
          admin: { condition: (_, data) => data?.fillType === 'ad' },
        },
        {
          name: 'sponsorFill',
          type: 'relationship',
          relationTo: 'sponsors',
          admin: { condition: (_, data) => data?.fillType === 'sponsor' },
        },
      ],
    },
  ],
}
