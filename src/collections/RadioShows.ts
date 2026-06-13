// src/collections/RadioShows.ts
import type { CollectionConfig, FieldHook } from 'payload'

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const autoSlug: FieldHook = ({ data, operation, value }) => {
  if (typeof value === 'string' && value.trim()) {
    return slugify(value)
  }

  if (data?.title && (operation === 'create' || !value)) {
    return slugify(data.title)
  }

  return value
}

export const RadioShows: CollectionConfig = {
  slug: 'radioShows',

  labels: {
    singular: 'Radio Show',
    plural: 'Radio Shows',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Radio & Programming',
    defaultColumns: ['title', 'showType', 'radioStatus', 'isFeatured'],
    description:
      'Manages WaveNation radio shows, live programs, countdowns, and syndicated blocks.',
  },

  versions: {
    drafts: true,
  },

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
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: {
                description: 'The public title of the radio show.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'showType',
                  type: 'select',
                  required: true,
                  admin: {
                    width: '50%',
                  },
                  options: [
                    {
                      label: 'Live Show',
                      value: 'live',
                    },
                    {
                      label: 'Pre-Recorded',
                      value: 'recorded',
                    },
                    {
                      label: 'Syndicated',
                      value: 'syndicated',
                    },
                    {
                      label: 'Countdown / Chart',
                      value: 'chart',
                    },
                    {
                      label: 'Specialty Block',
                      value: 'specialty-block',
                    },
                    {
                      label: 'Community / Talk',
                      value: 'community-talk',
                    },
                  ],
                },
                {
                  name: 'sponsors',
                  type: 'relationship',
                  relationTo: 'sponsors',
                  hasMany: true,
                  admin: {
                    width: '50%',
                    description: 'Brands officially sponsoring this radio show.',
                  },
                },
              ],
            },
            {
              name: 'description',
              type: 'textarea',
              admin: {
                description: 'A short description of the show, its format, and audience promise.',
              },
            },
            {
              name: 'hosts',
              type: 'relationship',
              relationTo: 'talent',
              hasMany: true,
              admin: {
                description:
                  'Hosts, DJs, contributors, or recurring guests connected to this show.',
              },
            },
          ],
        },
        {
          label: 'Branding & Assets',
          fields: [
            {
              name: 'coverArt',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Primary 1:1 show cover art.',
              },
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Transparent PNG show logo.',
              },
            },
            {
              name: 'themeColor',
              type: 'text',
              admin: {
                description: 'Hex code for the show page UI. Example: #00B3FF.',
                placeholder: '#00B3FF',
              },
            },
          ],
        },
        {
          label: 'Scheduling & Metadata',
          fields: [
            {
              name: 'standardSchedule',
              type: 'group',
              admin: {
                description:
                  'The baseline schedule. Specific airing overrides should happen in the Schedule collection.',
              },
              fields: [
                {
                  name: 'days',
                  type: 'select',
                  hasMany: true,
                  options: [
                    {
                      label: 'Monday',
                      value: 'Monday',
                    },
                    {
                      label: 'Tuesday',
                      value: 'Tuesday',
                    },
                    {
                      label: 'Wednesday',
                      value: 'Wednesday',
                    },
                    {
                      label: 'Thursday',
                      value: 'Thursday',
                    },
                    {
                      label: 'Friday',
                      value: 'Friday',
                    },
                    {
                      label: 'Saturday',
                      value: 'Saturday',
                    },
                    {
                      label: 'Sunday',
                      value: 'Sunday',
                    },
                  ],
                },
                {
                  name: 'startTime',
                  type: 'text',
                  admin: {
                    placeholder: 'Example: 18:00',
                    description: 'Use 24-hour time.',
                  },
                },
                {
                  name: 'endTime',
                  type: 'text',
                  admin: {
                    placeholder: 'Example: 20:00',
                    description: 'Use 24-hour time.',
                  },
                },
                {
                  name: 'timezone',
                  type: 'text',
                  defaultValue: 'America/New_York',
                  admin: {
                    description: 'Default broadcast timezone.',
                  },
                },
              ],
            },
            {
              name: 'genres',
              type: 'select',
              hasMany: true,
              options: [
                {
                  label: 'R&B',
                  value: 'rnb',
                },
                {
                  label: 'Hip-Hop',
                  value: 'hip_hop',
                },
                {
                  label: 'Southern Soul',
                  value: 'southern_soul',
                },
                {
                  label: 'Gospel',
                  value: 'gospel',
                },
                {
                  label: 'Talk',
                  value: 'talk',
                },
                {
                  label: 'Culture',
                  value: 'culture',
                },
                {
                  label: 'News',
                  value: 'news',
                },
                {
                  label: 'Quiet Storm',
                  value: 'quiet_storm',
                },
                {
                  label: 'Urban AC',
                  value: 'urban_ac',
                },
              ],
              admin: {
                description: 'Primary genres or content lanes for this show.',
              },
            },
            {
              name: 'chart',
              type: 'relationship',
              relationTo: 'charts',
              admin: {
                description: 'Link to a chart if this is a countdown show.',
              },
            },
          ],
        },
      ],
    },

    {
      name: 'slug',
      type: 'text',
      unique: true,
      hooks: {
        beforeValidate: [autoSlug],
      },
      admin: {
        position: 'sidebar',
        description: 'Auto-generated from the show title.',
      },
    },
    {
      name: 'radioStatus',
      type: 'select',
      enumName: 'radio_show_status',
      label: 'Radio Show Status',
      defaultValue: 'active',
      options: [
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'On Hiatus',
          value: 'hiatus',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
        {
          label: 'Archived',
          value: 'archived',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Feature this show in promoted radio sections.',
      },
    },
    {
      name: 'isPodcast',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Also distributes as an RSS podcast.',
      },
    },
  ],
}

export default RadioShows
