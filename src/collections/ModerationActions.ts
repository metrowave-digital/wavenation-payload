import type { CollectionConfig } from 'payload'
import {
  auditHooks,
  contentRelationshipCollections,
  moderationOnly,
  staffOnly,
  standardSystemFields,
} from './_shared'

export const ModerationActions: CollectionConfig = {
  slug: 'moderation-actions',
  labels: {
    singular: 'Moderation Action',
    plural: 'Moderation Actions',
  },
  admin: {
    group: 'Moderation',
    useAsTitle: 'actionSummary',
    defaultColumns: ['actionType', 'decisionStatus', 'moderator', 'status'],
  },
  access: {
    create: moderationOnly,
    read: staffOnly,
    update: moderationOnly,
    delete: moderationOnly,
  },
  hooks: auditHooks,
  fields: [
    {
      name: 'actionSummary',
      type: 'text',
      required: true,
    },
    {
      name: 'relatedFlag',
      type: 'relationship',
      relationTo: 'content-flags',
    },
    {
      name: 'targetContent',
      type: 'relationship',
      relationTo: [...contentRelationshipCollections],
      hasMany: true,
    },
    {
      name: 'actionType',
      type: 'select',
      required: true,
      options: [
        { label: 'Approve Content', value: 'approve-content' },
        { label: 'Reject Content', value: 'reject-content' },
        { label: 'Hide Content', value: 'hide-content' },
        { label: 'Remove Content', value: 'remove-content' },
        { label: 'Restore Content', value: 'restore-content' },
        { label: 'Add Warning Label', value: 'add-warning-label' },
        { label: 'Age Restrict', value: 'age-restrict' },
        { label: 'Demonetize', value: 'demonetize' },
        { label: 'Suspend Creator', value: 'suspend-creator' },
        { label: 'Terminate Creator', value: 'terminate-creator' },
        { label: 'Escalate to Legal', value: 'escalate-to-legal' },
        { label: 'Escalate to Editorial', value: 'escalate-to-editorial' },
        { label: 'No Violation Found', value: 'no-violation-found' },
      ],
    },
    {
      name: 'decisionStatus',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Executed', value: 'executed' },
        { label: 'Reversed', value: 'reversed' },
        { label: 'Appealed', value: 'appealed' },
        { label: 'Final', value: 'final' },
      ],
    },
    {
      name: 'moderator',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'subjectUser',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'subjectCreatorProfile',
      type: 'relationship',
      relationTo: 'creator-profiles',
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
      name: 'policyCategory',
      type: 'select',
      options: [
        { label: 'Community Guidelines', value: 'community-guidelines' },
        { label: 'Creator Terms', value: 'creator-terms' },
        { label: 'Copyright / DMCA', value: 'copyright-dmca' },
        { label: 'Brand Safety', value: 'brand-safety' },
        { label: 'Legal Risk', value: 'legal-risk' },
        { label: 'Editorial Standards', value: 'editorial-standards' },
        { label: 'Accessibility', value: 'accessibility' },
      ],
    },
    {
      name: 'statusChange',
      type: 'group',
      fields: [
        {
          name: 'previousStatus',
          type: 'text',
        },
        {
          name: 'newStatus',
          type: 'text',
        },
        {
          name: 'effectiveAt',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'expiresAt',
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
      name: 'appeal',
      type: 'group',
      fields: [
        {
          name: 'appealAllowed',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'appealStatus',
          type: 'select',
          defaultValue: 'not-submitted',
          options: [
            { label: 'Not Submitted', value: 'not-submitted' },
            { label: 'Submitted', value: 'submitted' },
            { label: 'Under Review', value: 'under-review' },
            { label: 'Granted', value: 'granted' },
            { label: 'Denied', value: 'denied' },
            { label: 'Final', value: 'final' },
          ],
        },
        {
          name: 'appealSubmittedAt',
          type: 'date',
        },
        {
          name: 'appealReason',
          type: 'textarea',
        },
        {
          name: 'appealReviewedBy',
          type: 'relationship',
          relationTo: 'users',
        },
        {
          name: 'appealDecisionNotes',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'legalEscalation',
      type: 'group',
      fields: [
        {
          name: 'requiresLegalReview',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'legalReviewer',
          type: 'relationship',
          relationTo: 'users',
        },
        {
          name: 'legalReviewedAt',
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
