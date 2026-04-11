import type { CollectionConfig, FieldHook } from 'payload'

const slugify = (val: string) =>
  val
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
const autoSlug: FieldHook = ({ data, operation, value }) =>
  value ? slugify(value) : data?.name ? slugify(data.name) : value

export const Curators: CollectionConfig = {
  slug: 'curators',
  labels: { singular: 'Curator', plural: 'Curators' },
  admin: { useAsTitle: 'name', group: 'People', defaultColumns: ['name', 'curatorType', 'status'] },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
        {
          name: 'curatorType',
          type: 'select',
          required: true,
          options: ['Internal Editorial', 'Guest Artist', 'Brand / Sponsor'],
          admin: { width: '50%' },
        },
      ],
    },
    { name: 'bio', type: 'textarea' },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
    {
      name: 'links',
      type: 'group',
      admin: {
        description: 'Link to internal profiles if this curator already exists in the system.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'linkedUser',
              type: 'relationship',
              relationTo: 'users',
              admin: { width: '50%' },
            },
            {
              name: 'linkedTalent',
              type: 'relationship',
              relationTo: 'talent',
              admin: { width: '50%' },
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
