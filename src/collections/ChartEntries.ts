
import type { CollectionConfig } from 'payload'

const MUSIC_GROUP = 'Music & Playlists'

const isAuthenticated = ({
  req,
}: {
  req: { user?: unknown }
}) => Boolean(req.user)

export const ChartEntries: CollectionConfig = {
  slug: 'chart-entries',

  labels: {
    singular: 'Chart Entry',
    plural: 'Chart Entries',
  },

  admin: {
    group: MUSIC_GROUP,
    useAsTitle: 'entryLabel',
    defaultColumns: [
      'entryLabel',
      'chart',
      'position',
      'lastWeekPosition',
      'movementDirection',
      'updatedAt',
    ],
  },

  /*
   * ACCESS CONTROL
   *
   * Public visitors can read entries belonging to
   * published or approved charts.
   *
   * CMS users can manage entries.
   *
   * Replace the authenticated-user checks with
   * role-based checks if your CMS has distinct roles.
   */
  access: {
    read: ({ req }) => {
      if (req.user) {
        return true
      }

      return {
        or: [
          {
            'chart.editorialStatus': {
              equals: 'published',
            },
          },
          {
            'chart.editorialStatus': {
              equals: 'approved',
            },
          },
        ],
      }
    },

    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated,

    readVersions: isAuthenticated,
  },

  versions: {
    maxPerDoc: 50,
  },

  /*
   * Automatically generate the admin entry label
   * when one has not been provided.
   */
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data

        if (!data.entryLabel) {
          const title =
            data.fallbackTitle || 'Chart Entry'

          const artist = data.fallbackArtistName
            ? ` — ${data.fallbackArtistName}`
            : ''

          const position = data.position
            ? `#${data.position} `
            : ''

          data.entryLabel =
            `${position}${title}${artist}`
        }

        return data
      },
    ],
  },

  fields: [
    {
      type: 'tabs',
      tabs: [
        /*
         * ENTRY
         */
        {
          label: 'Entry',
          fields: [
            {
              name: 'entryLabel',
              type: 'text',
              index: true,
              admin: {
                description:
                  'Auto-filled if blank. Useful for list views and relationship selectors.',
              },
            },

            {
              name: 'chart',
              type: 'relationship',
              relationTo: 'charts',
              index: true,
              required: true,
              admin: {
                description:
                  'Select the chart this entry belongs to. Required for public chart display.',
              },
            },

            {
              name: 'track',
              type: 'relationship',
              relationTo: 'tracks',
              admin: {
                description:
                  'Select a track from the WaveNation Tracks collection.',
              },
            },

            {
              type: 'row',
              fields: [
                {
                  name: 'position',
                  type: 'number',
                  index: true,
                  min: 1,
                  admin: {
                    width: '25%',
                  },
                },
                {
                  name: 'lastWeekPosition',
                  type: 'number',
                  min: 1,
                  admin: {
                    width: '25%',
                  },
                },
                {
                  name: 'peakPosition',
                  type: 'number',
                  min: 1,
                  admin: {
                    width: '25%',
                  },
                },
                {
                  name: 'weeksOnChart',
                  type: 'number',
                  min: 0,
                  admin: {
                    width: '25%',
                  },
                },
              ],
            },

            {
              type: 'row',
              fields: [
                {
                  name: 'movementDirection',
                  type: 'select',
                  defaultValue: 'same',
                  options: [
                    { label: 'New', value: 'new' },
                    { label: 'Up', value: 'up' },
                    { label: 'Down', value: 'down' },
                    { label: 'Same', value: 'same' },
                    {
                      label: 'Re-Entry',
                      value: 're_entry',
                    },
                    {
                      label: 'Drop-Off',
                      value: 'drop_off',
                    },
                  ],
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'movementValue',
                  type: 'number',
                  min: 0,
                  admin: {
                    width: '50%',
                    description:
                      'Optional number of chart positions moved.',
                  },
                },
              ],
            },

            {
              name: 'fallbackTitle',
              type: 'text',
              admin: {
                description:
                  'Use if the track has not been added to the Tracks collection yet.',
              },
            },

            {
              name: 'fallbackArtistName',
              type: 'text',
              admin: {
                description:
                  'Artist name used when no linked track is available.',
              },
            },
          ],
        },

        /*
         * MANUAL SCORING
         *
         * Internal scoring data is hidden from
         * unauthenticated public API requests.
         */
        {
          label: 'Manual Scoring',
          fields: [
            {
              name: 'listenerVotes',
              type: 'number',
              min: 0,
              access: {
                read: isAuthenticated,
              },
            },
            {
              name: 'streamCount',
              type: 'number',
              min: 0,
              access: {
                read: isAuthenticated,
              },
            },
            {
              name: 'radioSpins',
              type: 'number',
              min: 0,
              access: {
                read: isAuthenticated,
              },
            },
            {
              name: 'socialMomentumScore',
              type: 'number',
              min: 0,
              max: 100,
              access: {
                read: isAuthenticated,
              },
              admin: {
                description:
                  'Optional manual 1-100 score.',
              },
            },
            {
              name: 'editorialScore',
              type: 'number',
              min: 0,
              max: 100,
              access: {
                read: isAuthenticated,
              },
              admin: {
                description:
                  'Optional manual 1-100 editorial score.',
              },
            },
            {
              name: 'finalScore',
              type: 'number',
              access: {
                read: isAuthenticated,
              },
              admin: {
                description:
                  'Optional manual final score. Leave blank if ranking is purely manual.',
              },
            },
          ],
        },

        /*
         * BADGES
         */
        {
          label: 'Badges',
          fields: [
            {
              name: 'isNewEntry',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'isReEntry',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'isIndieSpotlight',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'isPremiere',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'isStaffPick',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'badgeLabel',
              type: 'text',
              admin: {
                description:
                  'Optional custom label like Biggest Mover or Gospel Pick.',
              },
            },
          ],
        },

        /*
         * EDITORIAL
         */
        {
          label: 'Editorial',
          fields: [
            {
              name: 'publicNote',
              type: 'textarea',
              admin: {
                description:
                  'Optional short copy for chart article, app, or web display.',
              },
            },

            {
              name: 'internalNotes',
              type: 'textarea',
              access: {
                read: isAuthenticated,
              },
              admin: {
                description:
                  'Private editorial notes. Not visible through public API requests.',
              },
            },
          ],
        },
      ],
    },
  ],
}
