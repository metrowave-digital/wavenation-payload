import type { CollectionConfig, FieldHook } from 'payload'

const slugify = (val: string) =>
  val
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
const autoSlug: FieldHook = ({ data, operation, value }) => {
  if (value) return slugify(value)
  if (data?.name && operation === 'create') return slugify(data.name)
  return value
}

export const Venues: CollectionConfig = {
  slug: 'venues',
  labels: { singular: 'Venue', plural: 'Venues' },
  admin: {
    useAsTitle: 'name',
    group: 'Programming',
    defaultColumns: ['name', 'venueType', 'city', 'capacity'],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Core Details',
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'description', type: 'textarea' },
            {
              type: 'row',
              fields: [
                {
                  name: 'venueType',
                  type: 'select',
                  options: ['Physical', 'Virtual', 'Hybrid', 'Studio'],
                  admin: { width: '50%' },
                },
                { name: 'capacity', type: 'number', admin: { width: '50%' } },
              ],
            },
            { name: 'photos', type: 'upload', relationTo: 'media', hasMany: true },
          ],
        },
        {
          label: 'Location',
          fields: [
            { name: 'address', type: 'text' },
            {
              type: 'row',
              fields: [
                { name: 'city', type: 'text', admin: { width: '33%' } },
                { name: 'state', type: 'text', admin: { width: '33%' } },
                { name: 'country', type: 'text', admin: { width: '34%' } },
              ],
            },
            { name: 'timezone', type: 'text', defaultValue: 'America/New_York', required: true },
            {
              type: 'row',
              fields: [
                { name: 'lat', type: 'number', admin: { width: '50%' } },
                { name: 'lng', type: 'number', admin: { width: '50%' } },
              ],
            },
          ],
        },
        {
          label: 'Broadcast Tech Specs',
          admin: { description: 'Default streaming configurations for events hosted here.' },
          fields: [
            {
              name: 'internetSpeed',
              type: 'text',
              admin: { placeholder: 'e.g., 1Gbps Up / 1Gbps Down' },
            },
            {
              name: 'defaultRtmpIngest',
              type: 'text',
              admin: { description: 'Standard RTMP URL for this venue’s hardware encoder.' },
            },
            {
              type: 'row',
              fields: [
                { name: 'muxLiveStreamId', type: 'text', admin: { width: '50%' } },
                { name: 'cloudflareLiveInputId', type: 'text', admin: { width: '50%' } },
              ],
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
