// src/collections/Podcasts.ts
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
  if (data?.title && (operation === 'create' || !value)) return slugify(data.title)
  return value
}

export const Podcasts: CollectionConfig = {
  slug: 'podcasts',
  labels: { singular: 'Podcast', plural: 'Podcasts' },
  admin: {
    useAsTitle: 'title',
    group: 'Audio & Podcasts',
    defaultColumns: ['title', 'status', 'updatedAt'],
  },
  versions: { drafts: true },
  access: {
    read: () => true,
    create: ({ req }) =>
      Boolean(req.user?.roles?.includes('editor') || req.user?.roles?.includes('admin')),
    update: ({ req }) =>
      Boolean(req.user?.roles?.includes('editor') || req.user?.roles?.includes('admin')),
    delete: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Core Info',
          fields: [
            { name: 'title', type: 'text', required: true },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              admin: { description: 'Public summary of the podcast.' },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'podcastFormat',
                  type: 'select',
                  defaultValue: 'episodic',
                  admin: { width: '50%', description: 'Apple Podcasts standard format.' },
                  options: [
                    { label: 'Episodic (Stand-alone)', value: 'episodic' },
                    { label: 'Serial (Season-based)', value: 'serial' },
                  ],
                },
                {
                  name: 'hosts',
                  type: 'relationship',
                  relationTo: 'talent',
                  hasMany: true,
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'seasons',
              type: 'relationship',
              relationTo: 'seasons',
              hasMany: true,
              admin: {
                description: 'Organize this podcast into seasons.',
                condition: (_, data) => data?.podcastFormat === 'serial',
              },
            },
            {
              name: 'coverArt',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: { description: 'Must be 3000x3000px for Apple Podcasts.' },
            },
            {
              name: 'trailer',
              type: 'group',
              admin: { description: 'Optional series trailer.' },
              fields: [
                { name: 'audioFile', type: 'upload', relationTo: 'media' },
                { name: 'duration', type: 'number', admin: { description: 'Duration in seconds' } },
              ],
            },
          ],
        },
        {
          label: 'RSS & Directory Meta',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'author',
                  type: 'text',
                  defaultValue: 'WaveNation',
                  admin: { width: '50%' },
                },
                { name: 'language', type: 'text', defaultValue: 'en-us', admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'copyright',
                  type: 'text',
                  admin: { width: '50%', placeholder: '© 2026 WaveNation' },
                },
                {
                  name: 'isExplicit',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'categories',
              type: 'select',
              hasMany: true,
              admin: { description: 'Apple Podcast Directory Categories' },
              options: [
                { label: 'Music', value: 'Music' },
                { label: 'Society & Culture', value: 'Society & Culture' },
                { label: 'Arts', value: 'Arts' },
                { label: 'News', value: 'News' },
                { label: 'Comedy', value: 'Comedy' },
              ],
            },
            {
              name: 'distribution',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'applePodcasts', type: 'checkbox' },
                    { name: 'spotify', type: 'checkbox' },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'youtube', type: 'checkbox' },
                    { name: 'wavenation', type: 'checkbox', defaultValue: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'AdOps & Monetization',
          fields: [
            {
              name: 'ads',
              type: 'group',
              admin: { description: 'Default ad behavior for all episodes in this series.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'adsEnabled', type: 'checkbox', defaultValue: true },
                    { name: 'disableForPremium', type: 'checkbox', defaultValue: true },
                  ],
                },
                {
                  name: 'sponsorBrand',
                  type: 'text',
                  admin: { description: 'Overall series title sponsor (if applicable).' },
                },
              ],
            },
          ],
        },
      ],
    },
    /* Sidebar */
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
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Active', value: 'active' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}

export default Podcasts
