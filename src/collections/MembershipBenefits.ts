import type { CollectionConfig } from 'payload'
import { auditHooks, staffOnly, standardSystemFields } from './_shared'

export const MembershipBenefits: CollectionConfig = {
  slug: 'membership-benefits',
  labels: {
    singular: 'Membership Benefit',
    plural: 'Membership Benefits',
  },
  admin: {
    group: 'Subscriptions',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'benefitKey', 'status'],
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
      name: 'benefitKey',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description:
          'Machine-readable key, for example: ad_free_audio, vod_access, creator_analytics.',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Streaming', value: 'streaming' },
        { label: 'Video / VOD', value: 'video-vod' },
        { label: 'Creator Tools', value: 'creator-tools' },
        { label: 'Events', value: 'events' },
        { label: 'Community', value: 'community' },
        { label: 'Commerce', value: 'commerce' },
        { label: 'Support', value: 'support' },
      ],
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      admin: {
        rows: 3,
      },
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'iconKey',
      type: 'text',
      admin: {
        description: 'Frontend icon key, for example: radio, tv, ticket, shield, analytics.',
      },
    },
    {
      name: 'benefitType',
      type: 'select',
      defaultValue: 'included',
      options: [
        { label: 'Included Feature', value: 'included' },
        { label: 'Limit / Allowance', value: 'limit' },
        { label: 'Discount', value: 'discount' },
        { label: 'Early Access', value: 'early-access' },
        { label: 'Exclusive Access', value: 'exclusive-access' },
      ],
    },
    {
      name: 'valueLabel',
      type: 'text',
      admin: {
        description: 'Human-facing value, for example: Unlimited, 10GB, 20% off.',
      },
    },
    {
      name: 'numericValue',
      type: 'number',
      admin: {
        description: 'Optional numeric limit for entitlement checks.',
      },
    },
    {
      name: 'includedInPlans',
      type: 'relationship',
      relationTo: 'subscription-plans',
      hasMany: true,
    },
    {
      name: 'visibility',
      type: 'select',
      defaultValue: 'public',
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Members Only', value: 'members-only' },
        { label: 'Internal Only', value: 'internal-only' },
      ],
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
