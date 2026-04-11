// src/collections/TVSchedule.ts
import type { CollectionConfig } from 'payload'

export const TVSchedule: CollectionConfig = {
  slug: 'tvSchedule',
  labels: {
    singular: 'TV Schedule Entry',
    plural: 'TV Schedule',
  },

  admin: {
    useAsTitle: 'label',
    group: 'Video & TV',
    defaultColumns: ['label', 'tvShow', 'scheduleType', 'status'],
    description: 'Manages the linear broadcast schedule for WaveNation TV.',
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
          label: 'Programming',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: { description: 'Internal reference (e.g. "Morning News - Weekdays")' },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'tvShow',
                  type: 'relationship',
                  relationTo: 'tvShows',
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'vodEpisode',
                  type: 'relationship',
                  relationTo: 'vod',
                  admin: {
                    width: '50%',
                    description:
                      'Optional: Link the specific episode being aired to populate the TV Guide with accurate metadata.',
                  },
                },
              ],
            },
            {
              name: 'programmingType',
              type: 'select',
              required: true,
              options: [
                { label: 'Live Broadcast / Event', value: 'live' },
                { label: 'Linear Playout (Automated)', value: 'automation' },
                { label: 'Encore / Replay', value: 'replay' },
              ],
            },
            {
              name: 'liveStream',
              type: 'group',
              admin: { condition: (_, data) => data?.programmingType === 'live' },
              fields: [
                {
                  name: 'hlsUrl',
                  type: 'text',
                  admin: {
                    description:
                      'The .m3u8 HLS manifest URL for overriding the default 24/7 channel stream during live events.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Time & Rules',
          fields: [
            {
              name: 'scheduleType',
              type: 'select',
              required: true,
              options: [
                { label: 'Recurring Block', value: 'recurring' },
                { label: 'One-Time Event', value: 'oneTime' },
                { label: 'Special / Override', value: 'special' },
              ],
            },
            {
              name: 'timezone',
              type: 'text',
              defaultValue: 'America/New_York',
              required: true,
            },
            {
              name: 'recurringRules',
              type: 'group',
              admin: { condition: (_, data) => data?.scheduleType === 'recurring' },
              fields: [
                {
                  name: 'daysOfWeek',
                  type: 'select',
                  hasMany: true,
                  options: [
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday',
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'startTime',
                      type: 'text',
                      required: true,
                      admin: { width: '50%', placeholder: 'e.g. 20:00' },
                    },
                    {
                      name: 'endTime',
                      type: 'text',
                      required: true,
                      admin: { width: '50%', placeholder: 'e.g. 21:00' },
                    },
                  ],
                },
                {
                  name: 'effectiveStartDate',
                  type: 'date',
                  admin: { description: 'When this block starts applying to the calendar.' },
                },
                {
                  name: 'effectiveEndDate',
                  type: 'date',
                  admin: { description: 'When this block stops applying to the calendar.' },
                },
              ],
            },
            {
              name: 'absoluteTime',
              type: 'group',
              admin: { condition: (_, data) => data?.scheduleType !== 'recurring' },
              fields: [
                {
                  name: 'startDateTime',
                  type: 'date',
                  required: true,
                  admin: { date: { pickerAppearance: 'dayAndTime' } },
                },
                {
                  name: 'endDateTime',
                  type: 'date',
                  required: true,
                  admin: { date: { pickerAppearance: 'dayAndTime' } },
                },
              ],
            },
            {
              name: 'conflictPriority',
              type: 'number',
              defaultValue: 1,
              admin: {
                description:
                  'Higher numbers override lower numbers. (e.g., Breaking News = 100, Standard Programming = 1)',
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
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Suspended', value: 'suspended' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}

export default TVSchedule
