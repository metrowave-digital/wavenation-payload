import type { CollectionConfig } from 'payload'
import {
  auditHooks,
  contentRelationshipCollections,
  legalOnly,
  staffOnly,
  standardSystemFields,
} from './_shared'

export const RightsRecords: CollectionConfig = {
  slug: 'rights-records',
  labels: {
    singular: 'Rights Record',
    plural: 'Rights Records',
  },
  admin: {
    group: 'Legal & Compliance',
    useAsTitle: 'title',
    defaultColumns: ['title', 'clearanceStatus', 'licenseType', 'expiresAt', 'status'],
  },
  access: {
    create: legalOnly,
    read: staffOnly,
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
      name: 'recordNumber',
      type: 'text',
      unique: true,
      admin: {
        description: 'Optional internal legal or clearance record number.',
      },
    },
    {
      name: 'content',
      type: 'relationship',
      relationTo: [...contentRelationshipCollections],
      hasMany: true,
      admin: {
        description:
          'Content, asset, campaign, event, playlist, or creator item covered by this rights record.',
      },
    },
    {
      name: 'primaryAsset',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'clearanceStatus',
      type: 'select',
      required: true,
      defaultValue: 'pending-review',
      options: [
        { label: 'Pending Review', value: 'pending-review' },
        { label: 'Cleared', value: 'cleared' },
        { label: 'Partially Cleared', value: 'partially-cleared' },
        { label: 'Needs License', value: 'needs-license' },
        { label: 'Expired', value: 'expired' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Takedown Required', value: 'takedown-required' },
      ],
    },
    {
      name: 'licenseType',
      type: 'select',
      required: true,
      options: [
        { label: 'Owned by WaveNation', value: 'owned' },
        { label: 'Licensed', value: 'licensed' },
        { label: 'Creator-Owned / Platform License', value: 'creator-owned-platform-license' },
        { label: 'Work Made for Hire', value: 'work-made-for-hire' },
        { label: 'Fair Use Review', value: 'fair-use-review' },
        { label: 'Public Domain', value: 'public-domain' },
        { label: 'Creative Commons', value: 'creative-commons' },
        { label: 'Third-Party Permission', value: 'third-party-permission' },
      ],
    },
    {
      name: 'rightsHolder',
      type: 'group',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'email',
          type: 'email',
        },
        {
          name: 'phone',
          type: 'text',
        },
        {
          name: 'organization',
          type: 'text',
        },
        {
          name: 'address',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'usageRights',
      type: 'group',
      fields: [
        {
          name: 'platforms',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Website', value: 'web' },
            { label: 'Mobile App', value: 'mobile' },
            { label: 'TV App', value: 'tv-app' },
            { label: 'WaveNation FM', value: 'radio' },
            { label: 'WaveNation One', value: 'tv' },
            { label: 'WaveNation+', value: 'plus' },
            { label: 'Podcast', value: 'podcast' },
            { label: 'Newsletter', value: 'newsletter' },
            { label: 'Social Media', value: 'social' },
            { label: 'Events', value: 'events' },
            { label: 'Advertising', value: 'advertising' },
          ],
        },
        {
          name: 'territories',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Worldwide', value: 'worldwide' },
            { label: 'United States', value: 'us' },
            { label: 'North America', value: 'north-america' },
            { label: 'Europe', value: 'europe' },
            { label: 'Digital Only', value: 'digital-only' },
            { label: 'Custom', value: 'custom' },
          ],
        },
        {
          name: 'exclusive',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'commercialUseAllowed',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'sublicensingAllowed',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'modificationAllowed',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'term',
      type: 'group',
      fields: [
        {
          name: 'startsAt',
          type: 'date',
        },
        {
          name: 'expiresAt',
          type: 'date',
        },
        {
          name: 'perpetual',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'renewalTerms',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'documents',
      type: 'group',
      fields: [
        {
          name: 'contractFile',
          type: 'relationship',
          relationTo: 'media',
        },
        {
          name: 'proofOfPermission',
          type: 'relationship',
          relationTo: 'media',
        },
        {
          name: 'releaseForms',
          type: 'relationship',
          relationTo: 'release-forms',
          hasMany: true,
        },
        {
          name: 'legalDocument',
          type: 'relationship',
          relationTo: 'legal-documents',
        },
      ],
    },
    {
      name: 'risk',
      type: 'group',
      fields: [
        {
          name: 'riskLevel',
          type: 'select',
          defaultValue: 'low',
          options: [
            { label: 'Low', value: 'low' },
            { label: 'Medium', value: 'medium' },
            { label: 'High', value: 'high' },
            { label: 'Critical', value: 'critical' },
          ],
        },
        {
          name: 'takedownRisk',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'reviewedByLegal',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'reviewedAt',
          type: 'date',
        },
        {
          name: 'riskNotes',
          type: 'textarea',
        },
      ],
    },
    ...standardSystemFields,
  ],
}
