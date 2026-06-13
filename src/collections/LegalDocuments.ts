import type { CollectionConfig } from 'payload'
import { auditHooks, legalOnly, publishedOrStaff, standardSystemFields } from './_shared'

export const LegalDocuments: CollectionConfig = {
  slug: 'legal-documents',
  labels: {
    singular: 'Legal Document',
    plural: 'Legal Documents',
  },
  admin: {
    group: 'Legal & Compliance',
    useAsTitle: 'title',
    defaultColumns: ['title', 'documentType', 'versionNumber', 'effectiveDate', 'status'],
  },
  versions: {
    drafts: true,
    maxPerDoc: 25,
  },
  access: {
    create: legalOnly,
    read: publishedOrStaff(['admin', 'legal', 'editor']),
    update: legalOnly,
    delete: legalOnly,
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
      name: 'documentType',
      type: 'select',
      required: true,
      options: [
        { label: 'Terms of Service', value: 'terms-of-service' },
        { label: 'Privacy Policy', value: 'privacy-policy' },
        { label: 'Community Guidelines', value: 'community-guidelines' },
        { label: 'DMCA Policy', value: 'dmca-policy' },
        { label: 'Accessibility Statement', value: 'accessibility-statement' },
        { label: 'Creator Terms', value: 'creator-terms' },
        { label: 'Subscriber Terms', value: 'subscriber-terms' },
        { label: 'Advertising Terms', value: 'advertising-terms' },
        { label: 'Sponsorship Terms', value: 'sponsorship-terms' },
        { label: 'Release Form Template', value: 'release-form-template' },
        { label: 'Contest Rules', value: 'contest-rules' },
        { label: 'Cookie Policy', value: 'cookie-policy' },
      ],
    },
    {
      name: 'versionNumber',
      type: 'text',
      required: true,
      defaultValue: '1.0',
    },
    {
      name: 'effectiveDate',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'supersedes',
      type: 'relationship',
      relationTo: 'legal-documents',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'visibility',
      type: 'select',
      defaultValue: 'public',
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Members Only', value: 'members-only' },
        { label: 'Creators Only', value: 'creators-only' },
        { label: 'Internal Only', value: 'internal-only' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'requiresUserAcceptance',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'requiresCreatorAcceptance',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      admin: {
        rows: 4,
      },
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
    },
    {
      name: 'plainTextBody',
      type: 'textarea',
      admin: {
        description: 'Optional plain-text copy for emails, exports, or external signing providers.',
        rows: 10,
      },
    },
    {
      name: 'attachments',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'file',
          type: 'relationship',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'acceptance',
      type: 'group',
      fields: [
        {
          name: 'acceptanceLabel',
          type: 'text',
          defaultValue: 'I have read and agree to these terms.',
        },
        {
          name: 'acceptanceRequiredFor',
          type: 'select',
          enumName: 'legal_accept_for',
          dbName: 'legal_accept_for',
          hasMany: true,
          options: [
            { label: 'Account Signup', value: 'account-signup' },
            { label: 'WaveNation+ Subscription', value: 'plus-subscription' },
            { label: 'Creator Hub Access', value: 'creator-hub-access' },
            { label: 'Music Submission', value: 'music-submission' },
            { label: 'Event Registration', value: 'event-registration' },
            { label: 'Sponsor / Advertiser Portal', value: 'sponsor-advertiser-portal' },
          ],
        },
      ],
    },
    {
      name: 'review',
      type: 'group',
      fields: [
        {
          name: 'reviewedBy',
          type: 'relationship',
          relationTo: 'users',
        },
        {
          name: 'reviewedAt',
          type: 'date',
        },
        {
          name: 'approvedBy',
          type: 'relationship',
          relationTo: 'users',
        },
        {
          name: 'approvedAt',
          type: 'date',
        },
        {
          name: 'legalNotes',
          type: 'textarea',
        },
      ],
    },
    ...standardSystemFields,
  ],
}
