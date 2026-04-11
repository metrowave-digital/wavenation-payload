// apps/cms/src/collections/Categories.ts
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

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Category', plural: 'Categories' },
  admin: { useAsTitle: 'name', group: 'Taxonomy', defaultColumns: ['name', 'slug', 'status'] },
  access: { read: () => true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            { name: 'name', type: 'text', required: true, unique: true },
            { name: 'description', type: 'textarea' },
            { name: 'parent', type: 'relationship', relationTo: 'categories', required: false },
          ],
        },
        {
          label: 'Display & Styling',
          fields: [
            {
              name: 'themeColor',
              type: 'text',
              admin: { description: 'Hex code (e.g., #FF5733) for UI accents.' },
            },
            {
              name: 'icon',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'SVG or transparent PNG icon for nav menus.' },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            { name: 'seoTitle', type: 'text', maxLength: 60 },
            { name: 'seoDescription', type: 'textarea', maxLength: 160 },
          ],
        },
      ],
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
        { label: 'Archived', value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}

export default Categories
