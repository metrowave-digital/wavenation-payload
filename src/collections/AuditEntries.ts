import type { CollectionConfig } from 'payload'
import { adminOnly, contentRelationshipCollections, standardSystemFields } from './_shared'

export const AuditEntries: CollectionConfig = {
  slug: 'audit-entries',
  labels: {
    singular: 'Audit Entry',
    plural: 'Audit Entries',
  },
  admin: {
    group: 'System',
    useAsTitle: 'summary',
    defaultColumns: ['summary', 'actionType', 'actor', 'createdAt'],
  },
  access: {
    create: adminOnly,
    read: adminOnly,
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'summary',
      type: 'text',
      required: true,
    },
    {
      name: 'actionType',
      type: 'select',
      required: true,
      options: [
        { label: 'Login', value: 'login' },
        { label: 'Logout', value: 'logout' },
        { label: 'Create', value: 'create' },
        { label: 'Update', value: 'update' },
        { label: 'Delete', value: 'delete' },
        { label: 'Publish', value: 'publish' },
        { label: 'Archive', value: 'archive' },
        { label: 'Status Change', value: 'status-change' },
        { label: 'Role Change', value: 'role-change' },
        { label: 'Permission Change', value: 'permission-change' },
        { label: 'Legal Approval', value: 'legal-approval' },
        { label: 'Moderation Decision', value: 'moderation-decision' },
        { label: 'Billing Change', value: 'billing-change' },
        { label: 'Stripe Webhook', value: 'stripe-webhook' },
        { label: 'Rights Clearance', value: 'rights-clearance' },
        { label: 'System Event', value: 'system-event' },
      ],
    },
    {
      name: 'actor',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'target',
      type: 'relationship',
      relationTo: [
        ...contentRelationshipCollections,
        'users',
        'legal-documents',
        'rights-records',
        'release-forms',
      ],
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'targetCollection',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'targetId',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'changeSet',
      type: 'group',
      fields: [
        {
          name: 'before',
          type: 'json',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'after',
          type: 'json',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'changedFields',
          type: 'array',
          fields: [
            {
              name: 'fieldName',
              type: 'text',
            },
          ],
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'request',
      type: 'group',
      fields: [
        {
          name: 'ipAddress',
          type: 'text',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'userAgent',
          type: 'textarea',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'requestId',
          type: 'text',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'source',
          type: 'select',
          options: [
            { label: 'Admin UI', value: 'admin-ui' },
            { label: 'Frontend App', value: 'frontend-app' },
            { label: 'API', value: 'api' },
            { label: 'Webhook', value: 'webhook' },
            { label: 'System Job', value: 'system-job' },
            { label: 'Import Script', value: 'import-script' },
          ],
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'severity',
      type: 'select',
      defaultValue: 'info',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Warning', value: 'warning' },
        { label: 'Critical', value: 'critical' },
      ],
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    ...standardSystemFields,
  ],
}
