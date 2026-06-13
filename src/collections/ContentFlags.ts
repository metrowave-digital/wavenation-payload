import type { CollectionConfig } from 'payload'
import {
  auditHooks,
  contentRelationshipCollections,
  moderationOnly,
  staffOnly,
  standardSystemFields,
} from './_shared'

export const ContentFlags: CollectionConfig = {
  slug: 'content-flags',
  labels: {
    singular: 'Content Flag',
    plural: 'Content Flags',
  },
  admin: {
    group: 'Moderation',
    useAsTitle: 'reason',
    defaultColumns: ['flagCategory', 'severity', 'reviewStatus', 'status'],
  },
  access: {
    create: () => true,
    read: staffOnly,
    update: moderationOnly,
    delete: moderationOnly,
  },
  hooks: auditHooks,
  fields: [
    {
      name: 'flaggedContent',
      type: 'relationship',
      relationTo: [...contentRelationshipCollections],
      required: true,
    },
    {
      name: 'flagCategory',
      type: 'select',
      required: true,
      options: [
        { label: 'Copyright / Rights Issue', value: 'copyright' },
        { label: 'Hate Speech', value: 'hate-speech' },
        { label: 'Harassment / Bullying', value: 'harassment' },
        { label: 'Violence / Threats', value: 'violence-threats' },
        { label: 'Explicit Sexual Content', value: 'explicit-sexual-content' },
        { label: 'Graphic Content', value: 'graphic-content' },
        { label: 'Misinformation', value: 'misinformation' },
        { label: 'Spam / Scam', value: 'spam-scam' },
        { label: 'Privacy / Doxxing', value: 'privacy-doxxing' },
        { label: 'Defamation / Legal Risk', value: 'defamation-legal-risk' },
        { label: 'Brand Safety', value: 'brand-safety' },
        { label: 'Accessibility Issue', value: 'accessibility' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'severity',
      type: 'select',
      required: true,
      defaultValue: 'medium',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
        { label: 'Critical', value: 'critical' },
      ],
    },
    {
      name: 'reason',
      type: 'textarea',
      required: true,
      admin: {
        rows: 5,
      },
    },
    {
      name: 'reporter',
      type: 'group',
      fields: [
        {
          name: 'reporterType',
          type: 'select',
          required: true,
          defaultValue: 'user',
          options: [
            { label: 'User', value: 'user' },
            { label: 'Creator', value: 'creator' },
            { label: 'Staff', value: 'staff' },
            { label: 'Automated System', value: 'automated-system' },
            { label: 'Rights Holder', value: 'rights-holder' },
            { label: 'Anonymous', value: 'anonymous' },
          ],
        },
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
        },
        {
          name: 'creatorProfile',
          type: 'relationship',
          relationTo: 'creator-profiles',
        },
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'email',
          type: 'email',
        },
      ],
    },
    {
      name: 'reviewStatus',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Triaged', value: 'triaged' },
        { label: 'Under Review', value: 'under-review' },
        { label: 'Escalated', value: 'escalated' },
        { label: 'Resolved', value: 'resolved' },
        { label: 'Dismissed', value: 'dismissed' },
      ],
    },
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'evidence',
      type: 'array',
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
          name: 'file',
          type: 'relationship',
          relationTo: 'media',
        },
        {
          name: 'notes',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'automatedDetection',
      type: 'group',
      fields: [
        {
          name: 'detectedBySystem',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'systemName',
          type: 'text',
        },
        {
          name: 'confidenceScore',
          type: 'number',
          min: 0,
          max: 100,
        },
        {
          name: 'rawSignal',
          type: 'json',
        },
      ],
    },
    {
      name: 'relatedModerationActions',
      type: 'relationship',
      relationTo: 'moderation-actions',
      hasMany: true,
    },
    ...standardSystemFields,
  ],
}
