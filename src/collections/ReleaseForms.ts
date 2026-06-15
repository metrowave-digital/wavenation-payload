import type { CollectionConfig } from 'payload'
import {
  auditHooks,
  contentRelationshipCollections,
  legalOnly,
  staffOnly,
  standardSystemFields,
} from './_shared'

export const ReleaseForms: CollectionConfig = {
  slug: 'release-forms',
  labels: {
    singular: 'Release Form',
    plural: 'Release Forms',
  },
  admin: {
    group: 'Legal & Compliance',
    useAsTitle: 'title',
    defaultColumns: ['title', 'releaseType', 'signingStatus', 'signerName', 'status'],
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
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'releaseType',
      type: 'select',
      required: true,
      options: [
        { label: 'Talent Release', value: 'talent_release' },
        { label: 'Creator Agreement', value: 'creator_agreement' },
        { label: 'Photo Release', value: 'photo_release' },
        { label: 'Video Release', value: 'video_release' },
        { label: 'Audio / Podcast Release', value: 'audio_podcast_release' },
        { label: 'Music Release', value: 'music_release' },
        { label: 'Venue Release', value: 'venue_release' },
        { label: 'Event Release', value: 'event_release' },
        { label: 'Minor Release', value: 'minor_release' },
        { label: 'Sponsor / Brand Release', value: 'sponsor_brand_release' },
        { label: 'General Liability Release', value: 'general_liability_release' },
      ],
    },
    {
      name: 'relatedContent',
      type: 'relationship',
      relationTo: [...contentRelationshipCollections],
      hasMany: true,
    },
    {
      name: 'rightsRecord',
      type: 'relationship',
      relationTo: 'rights-records',
    },
    {
      name: 'legalDocumentTemplate',
      type: 'relationship',
      relationTo: 'legal-documents',
    },
    {
      name: 'signer',
      type: 'group',
      fields: [
        {
          name: 'signerName',
          type: 'text',
          required: true,
        },
        {
          name: 'signerEmail',
          type: 'email',
          required: true,
        },
        {
          name: 'signerPhone',
          type: 'text',
        },
        {
          name: 'signerRole',
          type: 'text',
          admin: {
            description:
              'Artist, guest, creator, venue owner, parent/guardian, sponsor contact, etc.',
          },
        },
        {
          name: 'relatedUser',
          type: 'relationship',
          relationTo: 'users',
        },
        {
          name: 'relatedCreatorProfile',
          type: 'relationship',
          relationTo: 'creator-profiles',
        },
      ],
    },
    {
      name: 'minorRelease',
      type: 'group',
      fields: [
        {
          name: 'isMinorRelease',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'minorName',
          type: 'text',
        },
        {
          name: 'guardianName',
          type: 'text',
        },
        {
          name: 'guardianEmail',
          type: 'email',
        },
      ],
    },
    {
      name: 'signing',
      type: 'group',
      fields: [
        {
          name: 'signingProvider',
          type: 'select',
          defaultValue: 'third_party',
          options: [
            { label: 'Third-Party Provider', value: 'third_party' },
            { label: 'DocuSign', value: 'docusign' },
            { label: 'Dropbox Sign', value: 'dropbox_sign' },
            { label: 'Adobe Sign', value: 'adobe_sign' },
            { label: 'Manual Upload', value: 'manual_upload' },
          ],
        },
        {
          name: 'providerEnvelopeId',
          type: 'text',
        },
        {
          name: 'providerTemplateId',
          type: 'text',
        },
        {
          name: 'signingUrl',
          type: 'text',
        },
        {
          name: 'signedDocumentUrl',
          type: 'text',
        },
        {
          name: 'signingStatus',
          type: 'select',
          required: true,
          defaultValue: 'draft',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Sent', value: 'sent' },
            { label: 'Viewed', value: 'viewed' },
            { label: 'Signed', value: 'signed' },
            { label: 'Declined', value: 'declined' },
            { label: 'Expired', value: 'expired' },
            { label: 'Voided', value: 'voided' },
            { label: 'Manual Complete', value: 'manual_complete' },
          ],
        },
        {
          name: 'sentAt',
          type: 'date',
        },
        {
          name: 'signedAt',
          type: 'date',
        },
        {
          name: 'expiresAt',
          type: 'date',
        },
      ],
    },
    {
      name: 'files',
      type: 'group',
      fields: [
        {
          name: 'unsignedFile',
          type: 'relationship',
          relationTo: 'media',
        },
        {
          name: 'signedFile',
          type: 'relationship',
          relationTo: 'media',
        },
        {
          name: 'supportingFiles',
          type: 'relationship',
          relationTo: 'media',
          hasMany: true,
        },
      ],
    },
    {
      name: 'permissions',
      type: 'group',
      fields: [
        {
          name: 'commercialUseAllowed',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'promotionalUseAllowed',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'editorialUseAllowed',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'perpetualUse',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'territories',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Worldwide', value: 'worldwide' },
            { label: 'United States', value: 'us' },
            { label: 'North America', value: 'north_america' },
            { label: 'Europe', value: 'europe' },
            { label: 'Digital Only', value: 'digital_only' },
            { label: 'Custom', value: 'custom' },
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
          name: 'reviewNotes',
          type: 'textarea',
        },
      ],
    },
    ...standardSystemFields,
  ],
}
