import type { CollectionConfig } from 'payload'

const MUSIC_GROUP = 'Music & Playlists'

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
  versions: {
    maxPerDoc: 50,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data

        if (!data.entryLabel) {
          const title = data.fallbackTitle || 'Chart Entry'
          const artist = data.fallbackArtistName ? ` — ${data.fallbackArtistName}` : ''
          const position = data.position ? `#${data.position} ` : ''
          data.entryLabel = `${position}${title}${artist}`
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
              admin: {
                description:
                  'Optional but recommended. Attach this entry to the chart it belongs to.',
              },
            },
            {
              name: 'track',
              type: 'relationship',
              relationTo: 'tracks',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'position',
                  type: 'number',
                  index: true,
                  admin: {
                    width: '25%',
                  },
                },
                {
                  name: 'lastWeekPosition',
                  type: 'number',
                  admin: {
                    width: '25%',
                  },
                },
                {
                  name: 'peakPosition',
                  type: 'number',
                  admin: {
                    width: '25%',
                  },
                },
                {
                  name: 'weeksOnChart',
                  type: 'number',
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
                    { label: 'Re-Entry', value: 're-entry' },
                    { label: 'Drop-Off', value: 'drop-off' },
                  ],
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'movementValue',
                  type: 'number',
                  admin: {
                    width: '50%',
                    description: 'Optional number of positions moved.',
                  },
                },
              ],
            },
            {
              name: 'fallbackTitle',
              type: 'text',
              admin: {
                description: 'Use if the track has not been added to the Tracks collection yet.',
              },
            },
            {
              name: 'fallbackArtistName',
              type: 'text',
            },
          ],
        },
        {
          label: 'Manual Scoring',
          fields: [
            {
              name: 'listenerVotes',
              type: 'number',
            },
            {
              name: 'streamCount',
              type: 'number',
            },
            {
              name: 'radioSpins',
              type: 'number',
            },
            {
              name: 'socialMomentumScore',
              type: 'number',
              admin: {
                description: 'Optional manual 1-100 score.',
              },
            },
            {
              name: 'editorialScore',
              type: 'number',
              admin: {
                description: 'Optional manual 1-100 editorial score.',
              },
            },
            {
              name: 'finalScore',
              type: 'number',
              admin: {
                description:
                  'Optional manual final score. Leave blank if ranking is purely manual.',
              },
            },
          ],
        },
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
                description: 'Optional custom label like Biggest Mover or Gospel Pick.',
              },
            },
          ],
        },
        {
          label: 'Editorial',
          fields: [
            {
              name: 'publicNote',
              type: 'textarea',
              admin: {
                description: 'Optional short copy for chart article, app, or web display.',
              },
            },
            {
              name: 'internalNotes',
              type: 'textarea',
            },
          ],
        },
      ],
    },
  ],
}
