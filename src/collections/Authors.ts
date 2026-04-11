// apps/cms/src/collections/Authors.ts
import type { CollectionConfig, FieldHook, CollectionBeforeChangeHook } from 'payload'

/* ======================================================
   Helpers & Hooks
====================================================== */

const slugify = (input: string) =>
  input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)

const autoNameAndSlug: CollectionBeforeChangeHook = ({ data, operation }) => {
  if (operation === 'create' || operation === 'update') {
    // Generate Full Name
    const first = data.firstName || ''
    const last = data.lastName || ''
    data.fullName = `${first} ${last}`.trim()

    // Generate Slug if not provided or if auto-updating is preferred
    if (!data.slug && data.fullName) {
      data.slug = slugify(data.fullName)
    }
  }
  return data
}

/* ======================================================
   Collection Config
====================================================== */

export const Authors: CollectionConfig = {
  slug: 'authors',
  labels: { singular: 'Author', plural: 'Authors' },
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'role', 'status', 'email'],
    group: 'Editorial',
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [autoNameAndSlug],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Profile',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'firstName', type: 'text', required: true, admin: { width: '50%' } },
                { name: 'lastName', type: 'text', required: true, admin: { width: '50%' } },
              ],
            },
            {
              name: 'fullName',
              type: 'text',
              admin: { readOnly: true, description: 'Auto-generated from First and Last name.' },
            },
            { name: 'email', type: 'email' },
            { name: 'bio', type: 'richText' },
            { name: 'avatar', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          label: 'Social & Links',
          fields: [
            {
              name: 'socialLinks',
              type: 'array',
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  options: [
                    { label: 'Twitter / X', value: 'twitter' },
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'Website', value: 'website' },
                  ],
                },
                { name: 'url', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Editorial Metadata',
          fields: [
            {
              name: 'beats',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
              admin: { description: 'Primary topics or categories this author covers.' },
            },
            {
              name: 'aiAuthorityScore',
              type: 'number',
              min: 1,
              max: 10,
              defaultValue: 5,
              admin: {
                description:
                  'Internal score used to boost author content in AI ranking algorithms.',
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
      name: 'slug',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'contributor',
      options: [
        { label: 'Staff Writer', value: 'staff' },
        { label: 'Guest Contributor', value: 'contributor' },
        { label: 'Editor', value: 'editor' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}

export default Authors
