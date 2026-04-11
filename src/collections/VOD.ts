// src/collections/VOD.ts
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

export const VOD: CollectionConfig = {
  slug: 'vod',
  labels: { singular: 'VOD Item', plural: 'VOD Library' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'vodType', 'visibility', 'status', 'publishDate'],
    group: 'Video & TV',
  },
  versions: { drafts: true, maxPerDoc: 25 },
  access: { read: () => true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Core Info',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'textarea' },
            {
              type: 'row',
              fields: [
                {
                  name: 'vodType',
                  type: 'select',
                  required: true,
                  admin: { width: '50%' },
                  options: [
                    { label: 'Episode', value: 'episode' },
                    { label: 'Film', value: 'film' },
                    { label: 'Documentary', value: 'documentary' },
                    { label: 'Clip', value: 'clip' },
                    { label: 'Live Replay', value: 'liveReplay' },
                  ],
                },
                {
                  name: 'source',
                  type: 'select',
                  admin: { width: '50%' },
                  options: [
                    { label: 'WaveNation Original', value: 'original' },
                    { label: 'Creator Hub', value: 'creator' },
                    { label: 'Partner', value: 'partner' },
                  ],
                },
              ],
            },
            {
              name: 'tvShowContext',
              type: 'group',
              admin: { condition: (_, data) => ['episode', 'clip'].includes(data?.vodType) },
              fields: [
                { name: 'series', type: 'relationship', relationTo: 'tvShows' },
                {
                  type: 'row',
                  fields: [
                    { name: 'season', type: 'number', admin: { width: '50%' } },
                    { name: 'episodeNumber', type: 'number', admin: { width: '50%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Video & Playback Assets',
          fields: [
            {
              name: 'streaming',
              type: 'group',
              admin: { description: 'Enterprise streaming delivery (Mux, AWS MediaConvert, etc.)' },
              fields: [
                { name: 'hlsUrl', type: 'text', admin: { description: 'The .m3u8 playback URL.' } },
                {
                  name: 'providerAssetId',
                  type: 'text',
                  admin: { description: 'Asset ID from your encoding provider.' },
                },
                {
                  name: 'runtimeSeconds',
                  type: 'number',
                  admin: { description: 'Total runtime in seconds.' },
                },
              ],
            },
            {
              name: 'fallbackMp4',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Raw fallback MP4.' },
            },
            {
              name: 'poster',
              type: 'upload',
              relationTo: 'media',
              admin: { description: '16:9 Thumbnail' },
            },
            {
              name: 'captions',
              type: 'array',
              fields: [
                { name: 'language', type: 'text', defaultValue: 'en' },
                { name: 'vttFile', type: 'upload', relationTo: 'media' },
              ],
            },
            {
              name: 'chapters',
              type: 'array',
              admin: { description: 'Player seek-bar markers.' },
              fields: [
                { name: 'title', type: 'text' },
                { name: 'timestampSeconds', type: 'number' },
              ],
            },
          ],
        },
        {
          label: 'Access & Monetization',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'visibility',
                  type: 'select',
                  defaultValue: 'free',
                  admin: { width: '50%' },
                  options: [
                    { label: 'Free', value: 'free' },
                    { label: 'WaveNation+ (Premium)', value: 'premium' },
                    { label: 'Pay Per View', value: 'ppv' },
                    { label: 'Unlisted', value: 'unlisted' },
                  ],
                },
                { name: 'releaseDate', type: 'date', admin: { width: '50%' } },
              ],
            },
            {
              name: 'pricing',
              type: 'group',
              admin: { condition: (_, data) => data?.visibility === 'ppv' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'price', type: 'number', admin: { width: '50%' } },
                    {
                      name: 'currency',
                      type: 'text',
                      defaultValue: 'USD',
                      admin: { width: '50%' },
                    },
                  ],
                },
              ],
            },
            {
              name: 'rights',
              type: 'group',
              fields: [
                { name: 'rightsHolder', type: 'text' },
                { name: 'territories', type: 'text' },
                { name: 'expiryDate', type: 'date' },
              ],
            },
          ],
        },
        {
          label: 'AdOps & Sponsorship',
          fields: [
            {
              name: 'sponsor',
              type: 'relationship',
              relationTo: 'sponsors',
              admin: { description: 'Title or presenting sponsor for this VOD.' },
            },
            {
              name: 'ads',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'adsEnabled', type: 'checkbox', defaultValue: true },
                    { name: 'disableForPremium', type: 'checkbox', defaultValue: true },
                  ],
                },
                { name: 'preRoll', type: 'text', admin: { placeholder: 'VAST Tag URL' } },
                { name: 'midRoll', type: 'text', admin: { placeholder: 'VAST Tag URL' } },
                {
                  name: 'midRollOffset',
                  type: 'number',
                  admin: { description: 'Seconds into video to trigger mid-roll' },
                },
                { name: 'postRoll', type: 'text', admin: { placeholder: 'VAST Tag URL' } },
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
        { label: 'Under Review', value: 'review' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'publishDate', type: 'date', admin: { position: 'sidebar' } },
    { name: 'isFeatured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
  ],
}
