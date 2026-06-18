import type { CollectionConfig } from 'payload'

const MUSIC_GROUP = 'Music & Playlists'

type AccessArgs = {
  req: {
    user?: unknown
  }
}

type HookArgs = {
  data?: Record<string, unknown>
}

const formatSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const authenticated = ({ req }: AccessArgs) => Boolean(req.user)

const readCharts = ({ req }: AccessArgs) => {
  if (req.user) return true

  return {
    and: [
      {
        _status: {
          equals: 'published',
        },
      },
      {
        editorialStatus: {
          equals: 'published',
        },
      },
    ],
  }
}

export const Charts: CollectionConfig = {
  slug: 'charts',
  labels: {
    singular: 'Chart',
    plural: 'Charts',
  },
  admin: {
    group: MUSIC_GROUP,
    useAsTitle: 'title',
    defaultColumns: ['title', 'chartType', 'weekLabel', 'publishedAt', 'updatedAt'],
  },

  access: {
    read: readCharts,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },

  versions: {
    drafts: true,
    maxPerDoc: 75,
  },

  hooks: {
    beforeValidate: [
      ({ data }: HookArgs) => {
        if (!data) return data

        const title = typeof data.title === 'string' ? data.title : ''
        const weekLabel = typeof data.weekLabel === 'string' ? data.weekLabel : ''
        const existingSlug = typeof data.slug === 'string' ? data.slug : ''

        const base = [title, weekLabel].filter(Boolean).join(' ')

        if (base && !existingSlug) {
          data.slug = formatSlug(base)
        }

        return data
      },
    ],
  },

  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Chart Info',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              index: true,
              admin: {
                description: 'Example: The Hitlist 20 — Week of June 12, 2026',
              },
            },
            {
              name: 'slug',
              type: 'text',
              unique: true,
              index: true,
            },
            {
              name: 'chartType',
              type: 'select',
              required: true,
              defaultValue: 'hitlist',
              index: true,
              options: [
                { label: 'The Hitlist', value: 'hitlist' },
                { label: 'Gospel', value: 'gospel' },
                { label: 'Southern Soul', value: 'southern_soul' },
                { label: 'Hip-Hop', value: 'hip_hop' },
                { label: 'R&B/Soul', value: 'rb_soul' },
                { label: 'BPM', value: 'bpm' },
              ],
            },
            {
              name: 'publicDescription',
              type: 'textarea',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'weekLabel',
                  type: 'text',
                  admin: {
                    width: '33.33%',
                    description: 'Example: Week of June 12, 2026',
                  },
                },
                {
                  name: 'weekStart',
                  type: 'date',
                  index: true,
                  admin: {
                    width: '33.33%',
                  },
                },
                {
                  name: 'weekEnd',
                  type: 'date',
                  admin: {
                    width: '33.33%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'chartSize',
                  type: 'number',
                  defaultValue: 20,
                  admin: {
                    width: '33.33%',
                  },
                },
                {
                  name: 'publishedAt',
                  type: 'date',
                  index: true,
                  admin: {
                    width: '33.33%',
                  },
                },
                {
                  name: 'isCurrent',
                  type: 'checkbox',
                  defaultValue: false,
                  index: true,
                  admin: {
                    width: '33.33%',
                    description: 'Use for the active/current chart of this type.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Entries',
          fields: [
            {
              name: 'entries',
              type: 'relationship',
              relationTo: 'chart-entries',
              hasMany: true,
              admin: {
                isSortable: true,
                description:
                  'Create Chart Entry records first, then attach and drag them here into chart order.',
              },
            },
          ],
        },
        {
          label: 'Copy / History',
          fields: [
            {
              name: 'sourceChart',
              type: 'relationship',
              relationTo: 'charts',
              admin: {
                description: 'Use this to track which previous chart this issue was copied from.',
              },
            },
            {
              name: 'copyNotes',
              type: 'textarea',
              admin: {
                description: 'Notes for what changed after duplicating/copying last week’s chart.',
              },
            },
            {
              name: 'previousIssueUrl',
              type: 'text',
            },
          ],
        },
        {
          label: 'Visuals',
          fields: [
            {
              name: 'coverArt',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'socialCard',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'accentColor',
              type: 'select',
              defaultValue: 'electric_blue',
              options: [
                { label: 'Electric Blue', value: 'electric_blue' },
                { label: 'Neon Green', value: 'neon_green' },
                { label: 'Magenta Pulse', value: 'magenta_pulse' },
                { label: 'Signal Teal', value: 'signal_teal' },
                { label: 'Custom', value: 'custom' },
              ],
            },
          ],
        },
        {
          label: 'Methodology',
          fields: [
            {
              name: 'rankingMode',
              type: 'select',
              defaultValue: 'manual_editorial',
              options: [
                { label: 'Manual Editorial', value: 'manual_editorial' },
                { label: 'Votes + Editorial', value: 'votes_editorial' },
                { label: 'Streams + Radio + Editorial', value: 'streams_radio_editorial' },
                { label: 'Custom', value: 'custom' },
              ],
            },
            {
              name: 'methodologyNote',
              type: 'textarea',
              defaultValue:
                'Rankings are curated manually by the WaveNation music team using listener response, cultural impact, editorial judgment, and platform activity.',
            },
            {
              name: 'dataReviewed',
              type: 'array',
              labels: {
                singular: 'Data Source',
                plural: 'Data Sources',
              },
              fields: [
                {
                  name: 'sourceName',
                  type: 'text',
                },
                {
                  name: 'sourceNotes',
                  type: 'textarea',
                },
              ],
            },
          ],
        },
        {
          label: 'Publishing',
          fields: [
            {
              name: 'editorialStatus',
              type: 'select',
              defaultValue: 'draft',
              index: true,
              options: [
                { label: 'Draft', value: 'draft' },
                { label: 'In Review', value: 'in_review' },
                { label: 'Approved', value: 'approved' },
                { label: 'Published', value: 'published' },
                { label: 'Archived', value: 'archived' },
              ],
            },
            {
              name: 'featuredOnHomepage',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'featuredOnMusicPage',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'relatedArticleUrl',
              type: 'text',
              admin: {
                description: 'Optional chart article or countdown write-up URL.',
              },
            },
            {
              name: 'internalNotes',
              type: 'textarea',
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seoTitle',
              type: 'text',
            },
            {
              name: 'seoDescription',
              type: 'textarea',
            },
          ],
        },
      ],
    },
  ],
}
