import type { CollectionConfig, FieldHook } from 'payload'

const slugify = (val: string) =>
  val
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
const autoSlug: FieldHook = ({ data, operation, value }) =>
  value ? slugify(value) : data?.name ? slugify(data.name) : value

export const Sponsors: CollectionConfig = {
  slug: 'sponsors',
  labels: { singular: 'Sponsor', plural: 'Sponsors' },
  admin: { useAsTitle: 'name', group: 'Monetization', defaultColumns: ['name', 'tier', 'status'] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Brand Info',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
                { name: 'website', type: 'text', admin: { width: '50%' } },
              ],
            },
            { name: 'description', type: 'textarea' },
            {
              type: 'row',
              fields: [
                {
                  name: 'logoDark',
                  label: 'Logo (For Dark Backgrounds)',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { width: '50%' },
                },
                {
                  name: 'logoLight',
                  label: 'Logo (For Light Backgrounds)',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
        {
          label: 'Business',
          fields: [
            {
              name: 'tier',
              type: 'select',
              options: ['Title Sponsor', 'Presenting', 'Standard', 'Media Partner'],
            },
            {
              name: 'activeCampaigns',
              type: 'relationship',
              relationTo: 'ads',
              hasMany: true,
              admin: {
                description: 'Link to specific Ad inventory/campaigns running for this brand.',
              },
            },
            {
              name: 'contactInfo',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'contactName', type: 'text', admin: { width: '50%' } },
                    { name: 'email', type: 'email', admin: { width: '50%' } },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      hooks: { beforeValidate: [autoSlug] },
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: ['active', 'inactive'],
      admin: { position: 'sidebar' },
    },
  ],
}
