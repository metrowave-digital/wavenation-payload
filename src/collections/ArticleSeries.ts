// apps/cms/src/collections/ArticleSeries.ts
import type { CollectionConfig, CollectionBeforeChangeHook, FieldHook } from 'payload'

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
  const title = typeof data?.title === 'string' ? data.title : null
  return title ? slugify(title) : value
}

// Hook to automatically calculate the total number of articles in the series
const calculateSeriesMetrics: CollectionBeforeChangeHook = ({ data }) => {
  if (Array.isArray(data.articles)) {
    data.totalArticles = data.articles.length
  } else {
    data.totalArticles = 0
  }
  return data
}

export const ArticleSeries: CollectionConfig = {
  slug: 'article-series',
  labels: { singular: 'Article Series', plural: 'Article Series' },
  admin: {
    useAsTitle: 'title',
    group: 'Editorial',
    defaultColumns: ['title', 'sponsor', 'status', 'totalArticles', 'updatedAt'],
    description: 'Manage multi-part editorial series, deep-dives, and sponsored content hubs.',
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  timestamps: true,
  hooks: {
    beforeChange: [calculateSeriesMetrics],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Overview & Branding',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: { description: 'Series title (e.g. “Justice Rides a White Horse”)' },
            },
            {
              name: 'subtitle',
              type: 'text',
              admin: { description: 'Optional subtitle or theme line.' },
            },
            {
              name: 'description',
              type: 'textarea',
              admin: { description: 'Overview of the series purpose, scope, or narrative arc.' },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'sponsor',
                  type: 'relationship',
                  relationTo: 'sponsors',
                  admin: { width: '50%', description: 'Optional: Title sponsor for this series.' },
                },
                {
                  name: 'leadEditor',
                  type: 'relationship',
                  relationTo: 'authors',
                  admin: { width: '50%', description: 'Lead journalist, editor, or curator.' },
                },
              ],
            },
            {
              name: 'branding',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'image',
                      label: 'Hero Image',
                      type: 'upload',
                      relationTo: 'media',
                      admin: { width: '50%', description: 'Primary 16:9 banner.' },
                    },
                    {
                      name: 'seriesLogo',
                      type: 'upload',
                      relationTo: 'media',
                      admin: {
                        width: '50%',
                        description: 'Transparent PNG logo for the hub header.',
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'themeColor',
                      type: 'text',
                      admin: {
                        width: '50%',
                        placeholder: '#FF0000',
                        description: 'Hex color for frontend accents.',
                      },
                    },
                    {
                      name: 'credit',
                      type: 'text',
                      admin: { width: '50%', description: 'Artwork credit.' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Articles / Content',
          fields: [
            {
              name: 'articles',
              type: 'array',
              admin: { description: 'Articles included in this series, in reading order.' },
              fields: [
                { name: 'article', type: 'relationship', relationTo: 'articles', required: true },
                {
                  name: 'order',
                  type: 'number',
                  required: true,
                  admin: {
                    width: '50%',
                    description: 'Reading order within the series (1, 2, 3…).',
                  },
                },
                {
                  name: 'label',
                  type: 'text',
                  admin: {
                    width: '50%',
                    description: 'Optional display label (e.g. “Part II”, “Chapter 3”).',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Taxonomy',
          fields: [
            { name: 'categories', type: 'relationship', relationTo: 'categories', hasMany: true },
            { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true },
          ],
        },
        {
          label: 'Editorial',
          fields: [
            {
              name: 'editorialNotes',
              type: 'array',
              admin: {
                description: 'Internal notes about the series direction, updates, or changes.',
              },
              fields: [
                { name: 'note', type: 'textarea', required: true },
                { name: 'createdAt', type: 'date', admin: { readOnly: true } },
              ],
            },
          ],
        },
      ],
    },
    /* ===============================
       Sidebar Fields
    =============================== */
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
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Active', value: 'active' },
        { label: 'Completed', value: 'completed' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Feature this series on landing pages or homepage.',
      },
    },
    {
      name: 'totalArticles',
      type: 'number',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Auto-calculated count of articles.',
      },
    },
    {
      name: 'seo',
      type: 'group',
      admin: { position: 'sidebar' },
      fields: [
        { name: 'metaTitle', type: 'text', maxLength: 60 },
        { name: 'metaDescription', type: 'textarea', maxLength: 160 },
        { name: 'noIndex', type: 'checkbox', defaultValue: false },
      ],
    },
  ],
}

export default ArticleSeries
