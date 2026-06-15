import type { CollectionConfig } from 'payload'
import { auditHooks, staffOnly, standardSystemFields } from './_shared'

export const SubscriptionPlans: CollectionConfig = {
  slug: 'subscription-plans',
  labels: {
    singular: 'Subscription Plan',
    plural: 'Subscription Plans',
  },
  admin: {
    group: 'Subscriptions',
    useAsTitle: 'name',
    defaultColumns: ['name', 'tier', 'monthlyPriceCents', 'yearlyPriceCents', 'status'],
  },
  access: {
    create: staffOnly,
    read: () => true,
    update: staffOnly,
    delete: staffOnly,
  },
  hooks: auditHooks,
  fields: [
    {
      name: 'name',
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
      name: 'tier',
      type: 'select',
      required: true,
      defaultValue: 'plus',
      options: [
        { label: 'Free', value: 'free' },
        { label: 'WaveNation+', value: 'plus' },
        { label: 'Creator', value: 'creator' },
        { label: 'Creator Pro', value: 'creator_pro' },
        { label: 'Enterprise / Partner', value: 'enterprise' },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        rows: 4,
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'billingProvider',
      type: 'select',
      defaultValue: 'stripe',
      options: [
        { label: 'Stripe', value: 'stripe' },
        { label: 'Manual / Offline', value: 'manual' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'pricing',
      type: 'group',
      fields: [
        {
          name: 'currency',
          type: 'select',
          defaultValue: 'usd',
          options: [
            { label: 'USD', value: 'usd' },
            { label: 'EUR', value: 'eur' },
          ],
        },
        {
          name: 'monthlyPriceCents',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'yearlyPriceCents',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'trialDays',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
      ],
    },
    {
      name: 'stripe',
      type: 'group',
      admin: {
        description: 'Stripe product and price identifiers.',
      },
      fields: [
        {
          name: 'stripeProductId',
          type: 'text',
        },
        {
          name: 'stripeMonthlyPriceId',
          type: 'text',
        },
        {
          name: 'stripeYearlyPriceId',
          type: 'text',
        },
        {
          name: 'stripeMonthlyLookupKey',
          type: 'text',
        },
        {
          name: 'stripeYearlyLookupKey',
          type: 'text',
        },
        {
          name: 'stripeCustomerPortalUrl',
          type: 'text',
        },
      ],
    },
    {
      name: 'benefits',
      type: 'relationship',
      relationTo: 'membership-benefits',
      hasMany: true,
    },
    {
      name: 'entitlements',
      type: 'group',
      fields: [
        {
          name: 'adFreeAudio',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'adFreeVideo',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'fullVodLibrary',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'premiumLiveEvents',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'creatorChannels',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'creatorUploadTools',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'advancedAnalytics',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'earlyAccess',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'downloadsAllowed',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'prioritySupport',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'maxCreatorChannels',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'storageLimitGB',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'revenueSharePercent',
          type: 'number',
          defaultValue: 0,
          min: 0,
          max: 100,
        },
      ],
    },
    {
      name: 'featureFlags',
      type: 'array',
      fields: [
        {
          name: 'key',
          type: 'text',
          required: true,
        },
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'limit',
          type: 'number',
        },
        {
          name: 'notes',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'display',
      type: 'group',
      fields: [
        {
          name: 'badgeLabel',
          type: 'text',
        },
        {
          name: 'ctaLabel',
          type: 'text',
          defaultValue: 'Choose Plan',
        },
        {
          name: 'ctaUrl',
          type: 'text',
        },
        {
          name: 'sortOrder',
          type: 'number',
          defaultValue: 100,
        },
      ],
    },
    {
      name: 'legalDocuments',
      type: 'relationship',
      relationTo: 'legal-documents',
      hasMany: true,
      admin: {
        description:
          'Terms, privacy, creator terms, or plan-specific legal docs users must accept.',
      },
    },
    {
      name: 'requiresAcceptance',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    ...standardSystemFields,
  ],
}
