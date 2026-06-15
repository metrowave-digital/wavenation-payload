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
      defaultValue: 'general_promo',
      options: [
        { label: 'General Promo', value: 'general_promo' },
        { label: 'Subscription Upsell', value: 'subscription_upsell' },
        { label: 'Offer / Discount', value: 'offer_discount' },
        { label: 'Event Promo', value: 'event_promo' },
        { label: 'Creator Spotlight', value: 'creator_spotlight' },
        { label: 'Sponsored Campaign', value: 'sponsored_campaign' },
        { label: 'Breaking / Alert', value: 'breaking_alert' },
        { label: 'Newsletter Signup', value: 'newsletter_signup' },
      ],
    },
    {
      name: 'placement',
      type: 'select',
      required: true,
      options: [
        { label: 'Homepage Top', value: 'homepage_top' },
        { label: 'Homepage Mid', value: 'homepage_mid' },
        { label: 'Article Top', value: 'article_top' },
        { label: 'Article Inline', value: 'article_inline' },
        { label: 'Article Sidebar', value: 'article_sidebar' },
        { label: 'Player Bar', value: 'player_bar' },
        { label: 'Mobile App Home', value: 'mobile_home' },
        { label: 'TV App Home', value: 'tv_home' },
        { label: 'Creator Hub', value: 'creator_hub' },
        { label: 'WaveNation+', value: 'plus' },
        { label: 'Global Sitewide', value: 'global_sitewide' },
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
            { label: 'Text Link', value: 'text_link' },
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
            { label: 'Creator Pro', value: 'creator_pro' },
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
            { label: 'Radio Player', value: 'radio_player' },
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
        { label: 'Night Drive', value: 'night_drive' },
        { label: 'Electric Surge', value: 'electric_surge' },
        { label: 'Pulse Wave', value: 'pulse_wave' },
        { label: 'Southern Heat', value: 'southern_heat' },
        { label: 'News Mode', value: 'news_mode' },
        { label: 'Minimal Dark', value: 'minimal_dark' },
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
