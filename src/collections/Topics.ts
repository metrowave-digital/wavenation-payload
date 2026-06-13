// src/collections/Topics.ts
import type { CollectionConfig, FieldHook } from 'payload'

/* ======================================================
   Slug Helper
====================================================== */

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120)
}

const autoSlug: FieldHook = ({ value, data, originalDoc, operation }) => {
  if (typeof value === 'string' && value.trim()) return value

  if (operation === 'update' && originalDoc?.slug) {
    return originalDoc.slug
  }

  const name = typeof data?.name === 'string' ? data.name : null
  return name ? slugify(name) : value
}

/* ======================================================
   Topic Collection
====================================================== */

export const Topics: CollectionConfig = {
  slug: 'topics',
  labels: {
    singular: 'Topic',
    plural: 'Topics',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'topicType', 'status', 'sortOrder'],
    group: 'Editorial',
    description:
      'Cross-category editorial topics used to connect articles, playlists, shows, creators, culture coverage, and evergreen content.',
  },
  timestamps: true,
  versions: {
    drafts: false,
    maxPerDoc: 25,
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Topic',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              unique: true,
              admin: {
                description:
                  'Public-facing topic name. Examples: Southern Soul, R&B, Gospel, Black Film, HBCU Culture, Creator Economy.',
              },
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              hooks: {
                beforeValidate: [autoSlug],
              },
              admin: {
                description: 'Auto-generated from the topic name. Edit only if needed.',
              },
            },
            {
              name: 'shortLabel',
              type: 'text',
              maxLength: 40,
              admin: {
                description:
                  'Optional shorter display name for cards, badges, menus, and mobile layouts.',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              maxLength: 600,
              admin: {
                description:
                  'Public description for topic archive pages, SEO, and editorial context.',
              },
            },
            {
              name: 'topicType',
              type: 'select',
              required: true,
              defaultValue: 'general',
              options: [
                { label: 'General Topic', value: 'general' },
                { label: 'Music Genre', value: 'music-genre' },
                { label: 'Culture Trend', value: 'culture-trend' },
                { label: 'Community Issue', value: 'community-issue' },
                { label: 'Location / Region', value: 'location' },
                { label: 'Event / Festival', value: 'event' },
                { label: 'Artist / Public Figure', value: 'person' },
                { label: 'Show / Franchise', value: 'show-franchise' },
                { label: 'Playlist Theme', value: 'playlist-theme' },
                { label: 'Faith & Inspiration', value: 'faith-inspiration' },
                { label: 'Creator Economy', value: 'creator-economy' },
                { label: 'Technology / Platform', value: 'technology' },
              ],
            },
            {
              name: 'aliases',
              type: 'array',
              admin: {
                description:
                  'Optional alternate names, search terms, or older labels for this topic.',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Relationships',
          fields: [
            {
              name: 'parent',
              type: 'relationship',
              relationTo: 'topics',
              admin: {
                description: 'Optional parent topic. Example: Southern Soul can sit under Music.',
              },
            },
            {
              name: 'relatedCategories',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
              admin: {
                description:
                  'Optional category links used for filtering, archive pages, and recommendations.',
              },
            },
            {
              name: 'relatedSubcategories',
              type: 'relationship',
              relationTo: 'subcategories',
              hasMany: true,
            },
            {
              name: 'relatedTags',
              type: 'relationship',
              relationTo: 'tags',
              hasMany: true,
            },
          ],
        },
        {
          label: 'Visual Identity',
          fields: [
            {
              name: 'hero',
              type: 'group',
              fields: [
                {
                  name: 'image',
                  type: 'relationship',
                  relationTo: 'media',
                },
                {
                  name: 'caption',
                  type: 'textarea',
                },
                {
                  name: 'credit',
                  type: 'text',
                },
              ],
            },
            {
              name: 'accentColor',
              type: 'select',
              defaultValue: 'electric-blue',
              options: [
                { label: 'Electric Blue', value: 'electric-blue' },
                { label: 'Neon Green', value: 'neon-green' },
                { label: 'Magenta Pulse', value: 'magenta-pulse' },
                { label: 'Signal Teal', value: 'signal-teal' },
                { label: 'Charcoal', value: 'charcoal' },
                { label: 'Deep Indigo', value: 'deep-indigo' },
              ],
              admin: {
                description:
                  'Used by the frontend for topic badges, archive accents, and editorial modules.',
              },
            },
            {
              name: 'displayStyle',
              type: 'select',
              defaultValue: 'standard',
              options: [
                { label: 'Standard', value: 'standard' },
                { label: 'Editorial', value: 'editorial' },
                { label: 'Music / Playlist', value: 'music' },
                { label: 'Cinematic', value: 'cinematic' },
                { label: 'News Mode', value: 'news' },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seoTitle',
              type: 'text',
              maxLength: 70,
            },
            {
              name: 'seoDescription',
              type: 'textarea',
              maxLength: 160,
            },
            {
              name: 'socialImage',
              type: 'relationship',
              relationTo: 'media',
              admin: {
                description: 'Optional Open Graph / social share image for this topic archive.',
              },
            },
          ],
        },
        {
          label: 'Governance',
          fields: [
            {
              name: 'editorialNotes',
              type: 'textarea',
              admin: {
                description:
                  'Internal notes about usage, naming rules, sensitive framing, or topic boundaries.',
              },
            },
            {
              name: 'isSensitive',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description:
                  'Mark true for topics requiring extra editorial review or careful framing.',
              },
            },
            {
              name: 'requiresReview',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Use for topics that should trigger editor review before publishing.',
              },
            },
          ],
        },
      ],
    },

    /* ===============================
       Sidebar Fields
    =============================== */

    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Hidden', value: 'hidden' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 100,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first in topic lists.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'showInMegaMenu',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}

export default Topics
