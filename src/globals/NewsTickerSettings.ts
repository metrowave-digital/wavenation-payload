import type { GlobalConfig } from 'payload'

export const NewsTickerSettings: GlobalConfig = {
  slug: 'news-ticker-settings',
  admin: {
    group: 'Settings',
    description: 'Controls the global news ticker behavior and emergency overrides.',
  },
  access: { read: () => true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Behavior & Style',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'defaultLabel',
                  type: 'text',
                  defaultValue: 'LATEST STORIES',
                  admin: { width: '50%' },
                },
                {
                  name: 'scrollSpeed',
                  type: 'number',
                  defaultValue: 40,
                  admin: { description: 'Duration in seconds for a full loop.', width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'isCrisisMode',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { width: '30%' },
                },
                {
                  name: 'crisisPrimaryColor',
                  type: 'text',
                  defaultValue: '#FF0000',
                  admin: { width: '35%', condition: (data) => data.isCrisisMode },
                },
                {
                  name: 'crisisTextColor',
                  type: 'text',
                  defaultValue: '#FFFFFF',
                  admin: { width: '35%', condition: (data) => data.isCrisisMode },
                },
              ],
            },
          ],
        },
        {
          label: 'Manual Injects',
          fields: [
            {
              name: 'manualInjects',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', required: true, admin: { width: '40%' } },
                    { name: 'href', type: 'text', admin: { width: '40%' } },
                    {
                      name: 'accentOverride',
                      type: 'text',
                      admin: { width: '20%', placeholder: '#HEX' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'isBreaking', type: 'checkbox', admin: { width: '25%' } },
                    {
                      name: 'validUntil',
                      type: 'date',
                      admin: { width: '75%', description: 'Auto-hide after this time.' },
                    },
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
