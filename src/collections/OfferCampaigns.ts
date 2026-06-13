import type { CollectionConfig } from 'payload'
import { auditHooks, staffOnly, standardSystemFields } from './_shared'

export const OfferCampaigns: CollectionConfig = {
  slug: 'offer-campaigns',
  labels: {
    singular: 'Offer Campaign',
    plural: 'Offer Campaigns',
  },
  admin: {
    group: 'Marketing & Promotions',
    useAsTitle: 'name',
    defaultColumns: ['name', 'code', 'offerType', 'status'],
  },
  access: {
    create: staffOnly,
    read: staffOnly,
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
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Promo code shown to users, for example: WELCOME25.',
      },
    },
    {
      name: 'offerType',
      type: 'select',
      required: true,
      defaultValue: 'percent-off',
      options: [
        { label: 'Percent Off', value: 'percent-off' },
        { label: 'Fixed Amount Off', value: 'fixed-amount-off' },
        { label: 'Free Trial Extension', value: 'free-trial-extension' },
        { label: 'Free Month', value: 'free-month' },
        { label: 'Creator Promo', value: 'creator-promo' },
        { label: 'Partner / Sponsor Promo', value: 'partner-sponsor-promo' },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        rows: 4,
      },
    },
    {
      name: 'eligiblePlans',
      type: 'relationship',
      relationTo: 'subscription-plans',
      hasMany: true,
    },
    {
      name: 'stripe',
      type: 'group',
      fields: [
        {
          name: 'stripeCouponId',
          type: 'text',
        },
        {
          name: 'stripePromotionCodeId',
          type: 'text',
        },
        {
          name: 'stripeCheckoutUrl',
          type: 'text',
        },
      ],
    },
    {
      name: 'discount',
      type: 'group',
      fields: [
        {
          name: 'percentOff',
          type: 'number',
          min: 0,
          max: 100,
        },
        {
          name: 'amountOffCents',
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
        {
          name: 'trialDays',
          type: 'number',
          min: 0,
        },
        {
          name: 'duration',
          type: 'select',
          defaultValue: 'once',
          options: [
            { label: 'Once', value: 'once' },
            { label: 'Forever', value: 'forever' },
            { label: 'Repeating', value: 'repeating' },
          ],
        },
        {
          name: 'durationMonths',
          type: 'number',
          min: 0,
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
      name: 'limits',
      type: 'group',
      fields: [
        {
          name: 'maxTotalRedemptions',
          type: 'number',
          min: 0,
        },
        {
          name: 'maxRedemptionsPerUser',
          type: 'number',
          min: 0,
          defaultValue: 1,
        },
        {
          name: 'newCustomersOnly',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'requiresLoggedInUser',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'redemptionStats',
      type: 'group',
      admin: {
        description: 'Can be updated by webhook or backend job later.',
      },
      fields: [
        {
          name: 'totalRedemptions',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'lastRedeemedAt',
          type: 'date',
        },
      ],
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'internal',
      options: [
        { label: 'Internal', value: 'internal' },
        { label: 'Sponsor', value: 'sponsor' },
        { label: 'Creator', value: 'creator' },
        { label: 'Event', value: 'event' },
        { label: 'Newsletter', value: 'newsletter' },
        { label: 'Social', value: 'social' },
      ],
    },
    {
      name: 'relatedSponsorCampaign',
      type: 'relationship',
      relationTo: 'sponsor-campaigns',
    },
    ...standardSystemFields,
  ],
}
