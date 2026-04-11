// src/collections/Talent.ts
import type { CollectionConfig, FieldHook } from 'payload'

/* ======================================================
   Helpers & Hooks
====================================================== */

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const autoSlug: FieldHook = ({ data, operation, value }) => {
  if (typeof value === 'string' && value.trim()) return slugify(value)
  if (data?.displayName && (operation === 'create' || !value)) return slugify(data.displayName)
  return value
}

/* ======================================================
   Collection Config
====================================================== */

export const Talent: CollectionConfig = {
  slug: 'talent',
  labels: {
    singular: 'Talent',
    plural: 'Talent',
  },

  admin: {
    useAsTitle: 'displayName',
    group: 'People',
    defaultColumns: ['displayName', 'role', 'status', 'isFeatured'],
    description: 'Public-facing profiles for Hosts, DJs, and official WaveNation personalities.',
  },

  access: {
    read: () => true,
    create: ({ req }) =>
      Boolean(req.user?.roles?.includes('admin') || req.user?.roles?.includes('editor')),
    update: ({ req }) =>
      Boolean(req.user?.roles?.includes('admin') || req.user?.roles?.includes('editor')),
    delete: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
  },

  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Profile & Press',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'firstName', type: 'text', admin: { width: '50%' } },
                { name: 'lastName', type: 'text', admin: { width: '50%' } },
              ],
            },
            {
              name: 'displayName',
              type: 'text',
              required: true,
              admin: { description: 'The public stage name or moniker.' },
            },
            {
              name: 'shortBio',
              type: 'textarea',
              maxLength: 160,
              admin: { description: 'A brief summary for UI cards and search results.' },
            },
            {
              name: 'fullBio',
              type: 'richText',
              admin: { description: 'The full biography for the main talent page.' },
            },
            {
              name: 'mediaAssets',
              type: 'group',
              fields: [
                {
                  name: 'headshot',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { description: 'Primary 1:1 or 4:5 portrait.' },
                },
                {
                  name: 'heroBanner',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { description: '16:9 banner for the top of their talent page.' },
                },
                {
                  name: 'pressKit',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { description: 'Optional downloadable EPK (PDF or ZIP).' },
                },
              ],
            },
          ],
        },

        {
          label: 'Programming',
          fields: [
            {
              name: 'associatedShows',
              type: 'relationship',
              relationTo: 'radioShows', // Assumes this collection exists based on your Articles.ts
              hasMany: true,
              admin: { description: 'Radio shows or broadcast blocks this talent hosts.' },
            },
            {
              name: 'associatedPodcasts',
              type: 'relationship',
              relationTo: 'podcasts', // Assumes this collection exists
              hasMany: true,
              admin: { description: 'Podcasts hosted or co-hosted by this talent.' },
            },
            {
              name: 'curatedPlaylists',
              type: 'relationship',
              relationTo: 'playlists',
              hasMany: true,
              admin: { description: 'Editorial playlists this talent officially curates.' },
            },
          ],
        },

        {
          label: 'Social & Contact',
          fields: [
            {
              name: 'socials',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'instagram', type: 'text', admin: { width: '50%' } },
                    { name: 'twitter', type: 'text', admin: { width: '50%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'youtube', type: 'text', admin: { width: '50%' } },
                    { name: 'tiktok', type: 'text', admin: { width: '50%' } },
                  ],
                },
              ],
            },
            {
              name: 'bookingInfo',
              type: 'group',
              admin: { description: 'Internal or public booking/management contacts.' },
              fields: [
                { name: 'managerName', type: 'text' },
                { name: 'bookingEmail', type: 'email' },
                {
                  name: 'isPublic',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { description: 'If checked, display this booking email publicly.' },
                },
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
      unique: true,
      index: true,
      hooks: { beforeValidate: [autoSlug] },
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'On Hiatus', value: 'hiatus' },
        { label: 'Alumni / Inactive', value: 'alumni' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      options: [
        { label: 'Host', value: 'host' },
        { label: 'DJ', value: 'dj' },
        { label: 'Producer', value: 'producer' },
        { label: 'Contributor', value: 'contributor' },
        { label: 'Guest', value: 'guest' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Pin to the top of the Talent directory.' },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar', description: 'Link to internal platform user account.' },
    },
  ],
}

export default Talent
