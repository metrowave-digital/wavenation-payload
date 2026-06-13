import type { CollectionConfig } from 'payload'
import { auditHooks, publishedOrStaff, staffOnly, standardSystemFields } from './_shared'

export const PromoBanners: CollectionConfig = {
  slug: 'promo-banners',
  labels: {
    singular: 'Promo Banner',
    plural: 'Promo Banners',
  },
  admin: {
    group: 'Marketing & Promotions',
    useAsTitle: 'title',
    defaultColumns: ['title', 'placement', 'priority', 'status'],
  },
  access: {
    create: staffOnly,
    read: publishedOrStaff(),
    update: staffOnly,
    delete: staffOnly,
  },
  hooks: auditHooks,
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
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
      name: 'bannerType',
      type: 'select',
      required: true,
      defaultValue: 'general-promo',
      options: [
        { label: 'General Promo', value: 'general-promo' },
        { label: 'Subscription Upsell', value: 'subscription-upsell' },
        { label: 'Offer / Discount', value: 'offer-discount' },
        { label: 'Event Promo', value: 'event-promo' },
        { label: 'Creator Spotlight', value: 'creator-spotlight' },
        { label: 'Sponsored Campaign', value: 'sponsored-campaign' },
        { label: 'Breaking / Alert', value: 'breaking-alert' },
        { label: 'Newsletter Signup', value: 'newsletter-signup' },
      ],
    },
    {
      name: 'placement',
      type: 'select',
      required: true,
      options: [
        { label: 'Homepage Top', value: 'homepage-top' },
        { label: 'Homepage Mid', value: 'homepage-mid' },
        { label: 'Article Top', value: 'article-top' },
        { label: 'Article Inline', value: 'article-inline' },
        { label: 'Article Sidebar', value: 'article-sidebar' },
        { label: 'Player Bar', value: 'player-bar' },
        { label: 'Mobile App Home', value: 'mobile-home' },
        { label: 'TV App Home', value: 'tv-home' },
        { label: 'Creator Hub', value: 'creator-hub' },
        { label: 'WaveNation+', value: 'plus' },
        { label: 'Global Sitewide', value: 'global-sitewide' },
      ],
    },
    {
      name: 'priority',
      type: 'number',
      defaultValue: 100,
      min: 0,
      admin: {
        description: 'Lower numbers appear first.',
      },
    },
    {
      name: 'headline',
      type: 'text',
      required: true,
    },
    {
      name: 'subheadline',
      type: 'textarea',
      admin: {
        rows: 3,
      },
    },
    {
      name: 'eyebrow',
      type: 'text',
    },
    {
      name: 'image',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'mobileImage',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        {
          name: 'label',
          type: 'text',
        },
        {
          name: 'url',
          type: 'text',
        },
        {
          name: 'style',
          type: 'select',
          defaultValue: 'primary',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Outline', value: 'outline' },
            { label: 'Text Link', value: 'text-link' },
          ],
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'schedule',
      type: 'group',
      fields: [
        {
          name: 'startsAt',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'endsAt',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
      ],
    },
    {
      name: 'audience',
      type: 'group',
      fields: [
        {
          name: 'planTiers',
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
          name: 'platforms',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Web', value: 'web' },
            { label: 'Mobile', value: 'mobile' },
            { label: 'TV', value: 'tv' },
            { label: 'Radio Player', value: 'radio-player' },
          ],
        },
        {
          name: 'dismissible',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'linkedOffer',
      type: 'relationship',
      relationTo: 'offer-campaigns',
    },
    {
      name: 'linkedSponsorCampaign',
      type: 'relationship',
      relationTo: 'sponsor-campaigns',
    },
    {
      name: 'theme',
      type: 'select',
      defaultValue: 'night-drive',
      options: [
        { label: 'Night Drive', value: 'night-drive' },
        { label: 'Electric Surge', value: 'electric-surge' },
        { label: 'Pulse Wave', value: 'pulse-wave' },
        { label: 'Southern Heat', value: 'southern-heat' },
        { label: 'News Mode', value: 'news-mode' },
        { label: 'Minimal Dark', value: 'minimal-dark' },
      ],
    },
    {
      name: 'tracking',
      type: 'group',
      fields: [
        {
          name: 'campaignName',
          type: 'text',
        },
        {
          name: 'utmSource',
          type: 'text',
          defaultValue: 'wavenation',
        },
        {
          name: 'utmMedium',
          type: 'text',
        },
        {
          name: 'utmCampaign',
          type: 'text',
        },
      ],
    },
    ...standardSystemFields,
  ],
}
