import type { CollectionConfig } from 'payload'
import { auditHooks, salesOnly, staffOnly, standardSystemFields } from './_shared'

export const AdPlacements: CollectionConfig = {
  slug: 'ad-placements',
  labels: {
    singular: 'Ad Placement',
    plural: 'Ad Placements',
  },
  admin: {
    group: 'Advertising & Sponsorships',
    useAsTitle: 'name',
    defaultColumns: ['name', 'placementKey', 'platform', 'inventoryType', 'status'],
  },
  access: {
    create: salesOnly,
    read: staffOnly,
    update: salesOnly,
    delete: salesOnly,
  },
  hooks: auditHooks,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'placementKey',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Frontend key, for example: article_sidebar_300x250.',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'platform',
      type: 'select',
      required: true,
      options: [
        { label: 'Website', value: 'web' },
        { label: 'Mobile App', value: 'mobile' },
        { label: 'TV App', value: 'tv-app' },
        { label: 'WaveNation FM', value: 'radio' },
        { label: 'WaveNation One', value: 'tv' },
        { label: 'WaveNation+', value: 'plus' },
        { label: 'Newsletter', value: 'newsletter' },
        { label: 'Podcast', value: 'podcast' },
        { label: 'Social', value: 'social' },
        { label: 'Events', value: 'events' },
      ],
    },
    {
      name: 'inventoryType',
      type: 'select',
      required: true,
      options: [
        { label: 'Display Banner', value: 'display-banner' },
        { label: 'Native Card', value: 'native-card' },
        { label: 'Article Sidebar', value: 'article-sidebar' },
        { label: 'Homepage Hero', value: 'homepage-hero' },
        { label: 'Audio Pre-Roll', value: 'audio-preroll' },
        { label: 'Audio Mid-Roll', value: 'audio-midroll' },
        { label: 'Video Pre-Roll', value: 'video-preroll' },
        { label: 'Video Mid-Roll', value: 'video-midroll' },
        { label: 'TV Lower Third', value: 'tv-lower-third' },
        { label: 'Player Banner', value: 'player-banner' },
        { label: 'Newsletter Slot', value: 'newsletter-slot' },
        { label: 'Sponsored Playlist Slot', value: 'sponsored-playlist-slot' },
        { label: 'Event Signage', value: 'event-signage' },
      ],
    },
    {
      name: 'pageZone',
      type: 'text',
      admin: {
        description:
          'Frontend zone name, for example: news-detail-sidebar, homepage-top, player-bar.',
      },
    },
    {
      name: 'dimensions',
      type: 'group',
      fields: [
        {
          name: 'width',
          type: 'number',
          min: 0,
        },
        {
          name: 'height',
          type: 'number',
          min: 0,
        },
        {
          name: 'aspectRatio',
          type: 'select',
          options: [
            { label: '1:1', value: '1:1' },
            { label: '4:5', value: '4:5' },
            { label: '9:16', value: '9:16' },
            { label: '16:9', value: '16:9' },
            { label: '300x250', value: '300x250' },
            { label: '728x90', value: '728x90' },
            { label: '160x600', value: '160x600' },
            { label: 'Custom', value: 'custom' },
          ],
        },
        {
          name: 'durationSeconds',
          type: 'number',
          min: 0,
          admin: {
            description: 'For audio/video placements.',
          },
        },
      ],
    },
    {
      name: 'allowedCreativeTypes',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Image', value: 'image' },
        { label: 'Animated GIF', value: 'gif' },
        { label: 'HTML / Native', value: 'html-native' },
        { label: 'Audio 15s', value: 'audio-15' },
        { label: 'Audio 30s', value: 'audio-30' },
        { label: 'Video 6s', value: 'video-6' },
        { label: 'Video 15s', value: 'video-15' },
        { label: 'Video 30s', value: 'video-30' },
        { label: 'Text Sponsorship', value: 'text-sponsorship' },
      ],
    },
    {
      name: 'pricing',
      type: 'group',
      fields: [
        {
          name: 'rateType',
          type: 'select',
          defaultValue: 'flat',
          options: [
            { label: 'Flat Rate', value: 'flat' },
            { label: 'CPM', value: 'cpm' },
            { label: 'CPC', value: 'cpc' },
            { label: 'CPA', value: 'cpa' },
            { label: 'Trade / In-Kind', value: 'trade' },
          ],
        },
        {
          name: 'floorRateCents',
          type: 'number',
          min: 0,
        },
        {
          name: 'currency',
          type: 'select',
          defaultValue: 'usd',
          options: [
            { label: 'USD', value: 'usd' },
            { label: 'EUR', value: 'eur' },
          ],
        },
      ],
    },
    {
      name: 'targeting',
      type: 'group',
      fields: [
        {
          name: 'categories',
          type: 'relationship',
          relationTo: 'categories',
          hasMany: true,
        },
        {
          name: 'allowedPlanTiers',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Free', value: 'free' },
            { label: 'WaveNation+', value: 'plus' },
            { label: 'Creator', value: 'creator' },
            { label: 'Creator Pro', value: 'creator-pro' },
            { label: 'Enterprise', value: 'enterprise' },
          ],
        },
        {
          name: 'devices',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Desktop', value: 'desktop' },
            { label: 'Mobile', value: 'mobile' },
            { label: 'Tablet', value: 'tablet' },
            { label: 'TV', value: 'tv' },
            { label: 'Car / Auto', value: 'car-auto' },
          ],
        },
        {
          name: 'regions',
          type: 'array',
          fields: [
            {
              name: 'region',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      name: 'frequencyCap',
      type: 'group',
      fields: [
        {
          name: 'maxImpressionsPerUser',
          type: 'number',
          min: 0,
        },
        {
          name: 'windowHours',
          type: 'number',
          min: 0,
        },
      ],
    },
    {
      name: 'activeCampaigns',
      type: 'relationship',
      relationTo: 'sponsor-campaigns',
      hasMany: true,
    },
    {
      name: 'isSponsorshipEligible',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 100,
      admin: {
        position: 'sidebar',
      },
    },
    ...standardSystemFields,
  ],
}
