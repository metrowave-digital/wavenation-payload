// apps/cms/src/collections/Tags.ts
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
  const label = typeof data?.label === 'string' ? data.label : null
  return label ? slugify(label) : value
}

export const Tags: CollectionConfig = {
  slug: 'tags',
  labels: { singular: 'Tag', plural: 'Tags' },
  admin: {
    useAsTitle: 'label',
    group: 'Taxonomy',
    defaultColumns: ['label', 'tagType', 'isFeatured', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  timestamps: true,
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          unique: true,
          admin: { description: 'Human-readable tag name.', width: '50%' },
        },
        {
          name: 'tagType',
          type: 'select',
          defaultValue: 'general',
          options: [
            { label: 'General', value: 'general' },
            { label: 'Genre / Sound', value: 'genre' },
            { label: 'Location', value: 'location' },
            { label: 'Mood / Vibe', value: 'mood' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      admin: { description: 'Optional context for editors and AI classification' },
    },
    {
      name: 'synonyms',
      type: 'array',
      admin: {
        description: 'Alternative names for AI and search algorithms to route to this primary tag.',
      },
      fields: [{ name: 'term', type: 'text', required: true }],
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      hooks: { beforeValidate: [autoSlug] },
      admin: { position: 'sidebar', description: 'Auto-generated URL-safe identifier' },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Used for trending tags, homepage features, or playlists',
      },
    },
  ],
}

export default Tags
