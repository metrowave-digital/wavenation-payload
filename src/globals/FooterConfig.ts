// src/globals/FooterConfig.ts
import type { GlobalConfig } from 'payload'

export const FooterConfig: GlobalConfig = {
  slug: 'footer-config',
  admin: { group: 'Settings' },
  access: { read: () => true },
  fields: [
    {
      name: 'columns',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
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
          ],
        },
      ],
    },
    {
      name: 'legalLinks',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', required: true, admin: { width: '50%' } },
            { name: 'href', type: 'text', required: true, admin: { width: '50%' } },
          ],
        },
      ],
    },
  ],
}
