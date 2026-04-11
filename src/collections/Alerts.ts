// src/collections/Alerts.ts
import type { CollectionConfig } from 'payload'

export const Alerts: CollectionConfig = {
  slug: 'alerts',
  labels: { singular: 'Alert / Banner', plural: 'Alerts & Banners' },
  admin: {
    useAsTitle: 'internalName',
    group: 'Marketing',
    defaultColumns: ['internalName', 'alertType', 'status'],
  },
  access: { read: () => true },
  fields: [
    { name: 'internalName', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'alertType',
          type: 'select',
          required: true,
          options: ['Top Announcement Bar', 'Modal Popup', 'Toast Notification'],
          admin: { width: '50%' },
        },
        {
          name: 'theme',
          type: 'select',
          defaultValue: 'info',
          options: ['info', 'warning', 'emergency', 'promo'],
          admin: { width: '50%' },
        },
      ],
    },
    { name: 'headline', type: 'text', required: true },
    { name: 'message', type: 'textarea' },
    {
      type: 'row',
      fields: [
        { name: 'ctaLabel', type: 'text', admin: { width: '50%' } },
        { name: 'ctaUrl', type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      name: 'targeting',
      type: 'group',
      fields: [
        {
          name: 'showOnPaths',
          type: 'text',
          admin: {
            description: 'Comma-separated paths (e.g. /, /news, /radio). Leave blank for sitewide.',
          },
        },
        { name: 'dismissible', type: 'checkbox', defaultValue: true },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: ['draft', 'scheduled', 'active', 'archived'],
      admin: { position: 'sidebar' },
    },
    {
      name: 'startDate',
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },
  ],
}
