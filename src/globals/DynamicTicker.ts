import type { GlobalConfig } from 'payload'

export const DynamicTicker: GlobalConfig = {
  slug: 'dynamic-ticker',
  admin: {
    group: 'Settings',
    description: 'Manages the scrolling live data items in the site header.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'medium',
              type: 'select',
              required: true,
              options: [
                { label: 'FM Radio', value: 'FM' },
                { label: 'TV / Monitor', value: 'ONE' },
                { label: 'Digital Plus', value: 'PLUS' },
              ],
              admin: { width: '33%' },
            },
            {
              name: 'status',
              type: 'text',
              required: true,
              admin: {
                placeholder: 'NOW PLAYING',
                width: '33%',
              },
            },
            {
              name: 'isLive',
              type: 'checkbox',
              label: 'Currently Live',
              defaultValue: true,
              admin: { width: '33%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'subtext',
              type: 'text',
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'accent',
          type: 'text',
          required: true,
          defaultValue: '#39FF14',
          admin: {
            description: 'Hex color for the badge and pulse icon.',
          },
        },
      ],
    },
  ],
}
