import type { CollectionConfig, FieldHook } from 'payload'

const slugify = (val: string) =>
  val
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
const autoSlug: FieldHook = ({ data, operation, value }) =>
  value ? slugify(value) : data?.tierName ? slugify(data.tierName) : value

export const Subscriptions: CollectionConfig = {
  slug: 'subscriptions',
  labels: { singular: 'Subscription Tier', plural: 'Subscriptions' },
  admin: {
    useAsTitle: 'tierName',
    group: 'Monetization',
    defaultColumns: ['tierName', 'price', 'billingInterval', 'status'],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Tier Details',
          fields: [
            {
              name: 'tierName',
              type: 'text',
              required: true,
              admin: { description: 'e.g., "WaveNation+"' },
            },
            { name: 'description', type: 'textarea' },
            {
              name: 'features',
              type: 'array',
              fields: [
                {
                  name: 'feature',
                  type: 'text',
                  required: true,
                  admin: { placeholder: 'e.g., Ad-Free VOD Viewing' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'price', type: 'number', required: true, admin: { width: '50%' } },
                {
                  name: 'billingInterval',
                  type: 'select',
                  required: true,
                  options: ['monthly', 'yearly', 'one-time'],
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
        {
          label: 'API Integrations',
          fields: [
            { name: 'stripeProductId', type: 'text' },
            { name: 'stripePriceId', type: 'text' },
            {
              name: 'appleIapId',
              type: 'text',
              admin: { description: 'Apple App Store In-App Purchase ID' },
            },
            { name: 'googlePlayId', type: 'text', admin: { description: 'Google Play Store ID' } },
          ],
        },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      hooks: { beforeValidate: [autoSlug] },
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: ['active', 'legacy', 'draft'],
      admin: {
        position: 'sidebar',
        description: 'Legacy means active for current users but hidden from sign-up.',
      },
    },
  ],
}
