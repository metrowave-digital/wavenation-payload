// src/collections/Moods.ts
import type { CollectionConfig, FieldHook } from 'payload'

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const autoSlug: FieldHook = ({ data, operation, value }) => {
  if (typeof value === 'string' && value.trim()) return slugify(value)
  if (data?.name && (operation === 'create' || !value)) return slugify(data.name)
  return value
}

export const Moods: CollectionConfig = {
  slug: 'moods',
  labels: {
    singular: 'Mood',
    plural: 'Moods',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Taxonomy',
    defaultColumns: ['name', 'slug', 'status'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      hooks: {
        beforeValidate: [autoSlug],
      },
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Internal or public description of this mood vibe.',
      },
    },
    {
      name: 'themeColor',
      type: 'text',
      admin: {
        description: 'Hex code (e.g., #FF5733) for UI accents on mood hubs.',
      },
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'SVG or transparent PNG icon for nav menus.',
      },
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
      admin: {
        position: 'sidebar',
      },
    },
  ],
}

export default Moods
