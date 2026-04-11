// src/globals/NewsTickerSettings.ts
import type { GlobalConfig } from 'payload'

export const NewsTickerSettings: GlobalConfig = {
  slug: 'news-ticker-settings',
  admin: { group: 'Settings', description: 'Controls the global news ticker behavior.' },
  access: { read: () => true },
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
          name: 'isCrisisMode',
          type: 'checkbox',
          defaultValue: false,
          admin: { width: '50%', description: 'DANGER: Overrides the ticker red for emergencies.' },
        },
      ],
    },
    {
      name: 'manualInjects',
      type: 'array',
      admin: {
        description: 'Force specific links/text into the ticker rotation alongside API data.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', required: true, admin: { width: '50%' } },
            { name: 'href', type: 'text', admin: { width: '50%' } },
            { name: 'isBreaking', type: 'checkbox' },
          ],
        },
      ],
    },
  ],
}
