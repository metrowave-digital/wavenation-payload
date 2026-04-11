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

export const Episodes: CollectionConfig = {
  slug: 'episodes',
  labels: { singular: 'Episode', plural: 'Episodes' },
  admin: {
    useAsTitle: 'title',
    group: 'Audio & Episodes',
    defaultColumns: ['title', 'episodeType', 'podcast', 'status', 'publishDate'],
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
              name: 'showNotes',
              type: 'richText',
              required: true,
              admin: {
                description: 'Episode description, links, and credits. Displayed in podcast apps.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'episodeType',
                  type: 'select',
                  required: true,
                  admin: { width: '50%' },
                  options: [
                    { label: 'Podcast Episode', value: 'podcast' },
                    { label: 'Radio Replay', value: 'radio' },
                    { label: 'Special / Bonus', value: 'special' },
                  ],
                },
                {
                  name: 'format',
                  type: 'select',
                  defaultValue: 'full',
                  admin: { width: '50%', description: 'RSS standard format.' },
                  options: [
                    { label: 'Full', value: 'full' },
                    { label: 'Trailer', value: 'trailer' },
                    { label: 'Bonus', value: 'bonus' },
                  ],
                },
              ],
            },
            {
              name: 'context',
              type: 'group',
              fields: [
                {
                  name: 'podcast',
                  type: 'relationship',
                  relationTo: 'podcasts',
                  admin: { condition: (_, data) => data?.episodeType === 'podcast' },
                },
                {
                  name: 'radioShow',
                  type: 'relationship',
                  relationTo: 'radioShows',
                  admin: { condition: (_, data) => data?.episodeType === 'radio' },
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'seasonNumber', type: 'number', admin: { width: '50%' } },
                    { name: 'episodeNumber', type: 'number', admin: { width: '50%' } },
                  ],
                },
              ],
            },
            { name: 'hosts', type: 'relationship', relationTo: 'talent', hasMany: true },
          ],
        },
        {
          label: 'Audio & Media',
          fields: [
            {
              name: 'audioSource',
              type: 'select',
              defaultValue: 'upload',
              options: [
                { label: 'Local Upload', value: 'upload' },
                { label: 'External Hosting (Omny/Megaphone)', value: 'external' },
              ],
            },
            {
              name: 'audioFile',
              type: 'upload',
              relationTo: 'media',
              admin: { condition: (_, data) => data?.audioSource === 'upload' },
            },
            {
              name: 'externalAudioUrl',
              type: 'text',
              admin: {
                placeholder: 'https://...',
                condition: (_, data) => data?.audioSource === 'external',
              },
            },
            {
              name: 'duration',
              type: 'number',
              admin: { description: 'Duration in seconds. Critical for player UI.' },
            },
            {
              name: 'videoContext',
              type: 'group',
              fields: [
                { name: 'hasVideo', type: 'checkbox', defaultValue: false },
                {
                  name: 'vodLink',
                  type: 'relationship',
                  relationTo: 'vod',
                  admin: { condition: (_, data) => data?.hasVideo === true },
                },
              ],
            },
          ],
        },
        {
          label: 'Accessibility & Extras',
          fields: [
            {
              name: 'transcript',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'VTT or text file for closed captioning/transcripts.' },
            },
            {
              name: 'chapters',
              type: 'array',
              admin: { description: 'Interactive timestamp markers.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'timestamp', type: 'text', admin: { placeholder: '00:00:00' } },
                    { name: 'title', type: 'text' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'AdOps',
          fields: [
            {
              name: 'ads',
              type: 'group',
              fields: [
                { name: 'overrideSeriesDefaults', type: 'checkbox', defaultValue: false },
                { name: 'preRoll', type: 'text', admin: { placeholder: 'GAM VAST URL' } },
                {
                  name: 'midRolls',
                  type: 'array',
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'offsetSeconds', type: 'number' },
                        { name: 'vastUrl', type: 'text' },
                      ],
                    },
                  ],
                },
                { name: 'postRoll', type: 'text' },
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
    { name: 'isExplicit', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'isFeatured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'publishDate', type: 'date', admin: { position: 'sidebar' } },
  ],
}
