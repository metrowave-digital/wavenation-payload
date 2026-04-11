// apps/cms/src/collections/Subcategories.ts
import type { CollectionConfig, FieldHook } from 'payload'

const slugify = (input: string) =>
  input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)

const autoSlug: FieldHook = ({ value, data }) => {
  if (typeof value === 'string' && value.trim()) return value
  const name = typeof data?.name === 'string' ? data.name : null
  return name ? slugify(name) : value
}

export const Subcategories: CollectionConfig = {
  slug: 'subcategories',
  labels: { singular: 'Subcategory', plural: 'Subcategories' },
  admin: { useAsTitle: 'name', group: 'Taxonomy', defaultColumns: ['name', 'category', 'status'] },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'category', type: 'relationship', relationTo: 'categories', required: true },
    {
      name: 'themeColorOverride',
      type: 'text',
      admin: { description: 'Leave blank to inherit parent Category color.' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      hooks: { beforeValidate: [autoSlug] },
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Hidden', value: 'hidden' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}

export default Subcategories
