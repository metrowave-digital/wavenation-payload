import type { GlobalConfig } from 'payload'

export const EventSettings: GlobalConfig = {
  slug: 'event-settings',
  admin: {
    group: 'Settings',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'defaultTimezone',
      type: 'text',
      defaultValue: 'America/Chicago',
    },
    {
      name: 'defaultVirtualPlatform',
      type: 'select',
      defaultValue: 'streamlabs',
      options: [
        { label: 'WaveNation Native', value: 'wavenation-native' },
        { label: 'Streamlabs', value: 'streamlabs' },
        { label: 'YouTube', value: 'youtube' },
        { label: 'Vimeo', value: 'vimeo' },
        { label: 'Zoom', value: 'zoom' },
        { label: 'Eventbrite', value: 'eventbrite' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'defaultCTAName',
      type: 'text',
      defaultValue: 'Register Now',
    },
    {
      name: 'homepageFeaturedEventLimit',
      type: 'number',
      defaultValue: 6,
      min: 1,
    },
    {
      name: 'heroEventLimit',
      type: 'number',
      defaultValue: 1,
      min: 1,
    },
    {
      name: 'enableEventbriteSync',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'eventbriteOrganizationId',
      type: 'text',
    },
  ],
}
