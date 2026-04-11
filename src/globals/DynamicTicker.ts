import type { GlobalConfig } from 'payload'

export const DynamicTicker: GlobalConfig = {
  slug: 'dynamic-ticker',
  admin: {
    group: 'Settings',
    description: 'Live broadcast data with transition and scheduling logic.',
  },
  access: { read: () => true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Global Setup',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'displayDuration',
                  type: 'number',
                  defaultValue: 5000,
                  admin: { description: 'MS per slide.', width: '50%' },
                },
                {
                  name: 'transitionSpeed',
                  type: 'number',
                  defaultValue: 400,
                  admin: { description: 'Animation speed in MS.', width: '50%' },
                },
              ],
            },
            { name: 'showVisualizer', type: 'checkbox', defaultValue: true },
          ],
        },
        {
          label: 'Broadcast Items',
          fields: [
            {
              name: 'items',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'medium',
                      type: 'select',
                      options: [
                        { label: 'FM Radio', value: 'FM' },
                        { label: 'TV / Monitor', value: 'ONE' },
                        { label: 'Digital Plus', value: 'PLUS' },
                      ],
                      admin: { width: '30%' },
                    },
                    { name: 'status', type: 'text', admin: { width: '40%' } },
                    { name: 'isLive', type: 'checkbox', admin: { width: '30%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'title', type: 'text', required: true, admin: { width: '50%' } },
                    { name: 'subtext', type: 'text', admin: { width: '50%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'accent',
                      type: 'text',
                      defaultValue: '#39FF14',
                      admin: { width: '30%' },
                    },
                    { name: 'scheduledStart', type: 'date', admin: { width: '35%' } },
                    { name: 'scheduledEnd', type: 'date', admin: { width: '35%' } },
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
