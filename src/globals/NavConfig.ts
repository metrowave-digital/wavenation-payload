// src/globals/NavConfig.ts
import type { GlobalConfig } from 'payload'

export const NavConfig: GlobalConfig = {
  slug: 'nav-config',
  admin: {
    group: 'Settings',
    description: 'Manage the main mega-menu navigation.',
  },
  access: { read: () => true },
  fields: [
    {
      name: 'mainNav',
      type: 'array',
      // Removed the inline RowLabel component causing the TS error.
      // Payload will automatically use the 'label' field below to name the rows.
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', required: true, admin: { width: '50%' } },
            { name: 'href', type: 'text', required: true, admin: { width: '50%' } },
          ],
        },
        {
          name: 'featured',
          type: 'group',
          admin: { description: 'The highlighted card on the left side of the mega menu.' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'eyebrow', type: 'text', admin: { width: '50%' } },
                { name: 'title', type: 'text', admin: { width: '50%' } },
              ],
            },
            { name: 'description', type: 'textarea' },
            {
              type: 'row',
              fields: [
                { name: 'href', type: 'text', admin: { width: '50%' } },
                {
                  name: 'accent',
                  type: 'select',
                  options: ['blue', 'magenta', 'news', 'brand'],
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
        {
          name: 'columns',
          type: 'array',
          admin: { description: 'Link columns displayed in the mega menu.' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'label', type: 'text', required: true, admin: { width: '50%' } },
                {
                  name: 'icon',
                  type: 'text',
                  admin: { width: '50%', description: 'Lucide Icon name (e.g. "Music4")' },
                },
              ],
            },
            {
              name: 'links',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', required: true, admin: { width: '50%' } },
                    { name: 'href', type: 'text', required: true, admin: { width: '50%' } },
                  ],
                },
                {
                  name: 'badge',
                  type: 'select',
                  options: [
                    { label: 'None', value: 'none' },
                    { label: 'New', value: 'new' },
                    { label: 'Live', value: 'live' },
                    { label: 'Trending', value: 'trending' },
                    { label: 'Editor Pick', value: 'editor-pick' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
