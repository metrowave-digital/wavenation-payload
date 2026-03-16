import type { CollectionConfig } from 'payload'

import { publicRead } from '../access/publicRead'
import { formatSlug } from '../hooks/formatSlug'
import { setEventStatus } from '../hooks/setEventStatus'
import { populateEventbriteData } from '../hooks/populateEventbriteData'
import { setHomepagePriority } from '../hooks/setHomepagePriority'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    group: 'Programming',
    defaultColumns: [
      'title',
      'status',
      'eventType',
      'contentVertical',
      'promotionTier',
      'homepagePlacement',
      'homepagePriority',
      'startDate',
      'isFeatured',
    ],
  },
  access: {
    read: publicRead,
  },
  versions: {
    drafts: true,
  },
  hooks: {
    beforeValidate: [formatSlug],
    beforeChange: [setEventStatus, populateEventbriteData, setHomepagePriority],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        description: 'Auto-generated from title if left blank.',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      maxLength: 280,
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },

    {
      type: 'row',
      fields: [
        {
          name: 'eventType',
          type: 'select',
          required: true,
          defaultValue: 'virtual',
          options: [
            { label: 'Virtual', value: 'virtual' },
            { label: 'In-Person', value: 'in-person' },
            { label: 'Hybrid', value: 'hybrid' },
          ],
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'draft',
          index: true,
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Scheduled', value: 'scheduled' },
            { label: 'Live', value: 'live' },
            { label: 'Ended', value: 'ended' },
          ],
        },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          required: true,
          index: true,
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'endDate',
          type: 'date',
          required: true,
          index: true,
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
      ],
    },

    {
      name: 'timezone',
      type: 'text',
      required: true,
      defaultValue: 'America/Chicago',
    },

    {
      type: 'row',
      fields: [
        {
          name: 'heroImage',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'thumbnail',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'hostName',
          type: 'text',
        },
        {
          name: 'guestName',
          type: 'text',
          hasMany: true,
        },
      ],
    },

    {
      name: 'sponsorNames',
      type: 'text',
      hasMany: true,
    },

    {
      name: 'agenda',
      type: 'array',
      label: 'Agenda',
      fields: [
        {
          name: 'time',
          type: 'text',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },

    {
      name: 'faq',
      type: 'array',
      label: 'FAQ',
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          type: 'textarea',
          required: true,
        },
      ],
    },

    {
      name: 'virtualEventLabel',
      type: 'text',
    },

    {
      type: 'row',
      fields: [
        {
          name: 'livestreamPlatform',
          type: 'select',
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
          name: 'replayUrl',
          type: 'text',
        },
      ],
    },

    {
      name: 'livestreamAccessInstructions',
      type: 'textarea',
    },

    {
      name: 'streamEmbedUrl',
      type: 'text',
      admin: {
        description: 'Optional embed/player URL for livestream or replay.',
      },
    },

    {
      type: 'row',
      fields: [
        {
          name: 'eventbriteEventId',
          type: 'text',
          index: true,
        },
        {
          name: 'eventbriteUrl',
          type: 'text',
        },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'eventbriteSyncEnabled',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'eventbriteLastSyncedAt',
          type: 'date',
          admin: {
            readOnly: true,
          },
        },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'visibility',
          type: 'select',
          defaultValue: 'public',
          options: [
            { label: 'Public', value: 'public' },
            { label: 'Private', value: 'private' },
            { label: 'Unlisted', value: 'unlisted' },
          ],
        },
        {
          name: 'accessType',
          type: 'select',
          defaultValue: 'open',
          options: [
            { label: 'Open', value: 'open' },
            { label: 'Ticketed', value: 'ticketed' },
            { label: 'Invite Only', value: 'invite-only' },
            { label: 'Members Only', value: 'members-only' },
          ],
        },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'registrationRequired',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'capacity',
          type: 'number',
          min: 0,
        },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'ctaLabel',
          type: 'text',
        },
        {
          name: 'ctaUrl',
          type: 'text',
        },
      ],
    },

    {
      type: 'collapsible',
      label: 'Related Content',
      fields: [
        {
          name: 'relatedArticles',
          type: 'relationship',
          relationTo: 'articles',
          hasMany: true,
        },
        {
          name: 'relatedRadioShows',
          type: 'relationship',
          relationTo: 'radioShows',
          hasMany: true,
        },
        {
          name: 'relatedVOD',
          type: 'relationship',
          relationTo: 'vod',
          hasMany: true,
        },
        {
          name: 'relatedPlaylists',
          type: 'relationship',
          relationTo: 'playlists',
          hasMany: true,
        },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'contentVertical',
          type: 'select',
          required: true,
          defaultValue: 'culture',
          options: [
            { label: 'Music', value: 'music' },
            { label: 'Culture', value: 'culture' },
            { label: 'Faith', value: 'faith' },
            { label: 'Creator', value: 'creator' },
            { label: 'Radio', value: 'radio' },
            { label: 'TV', value: 'tv' },
          ],
          index: true,
        },
        {
          name: 'promotionTier',
          type: 'select',
          required: true,
          defaultValue: 'standard',
          options: [
            { label: 'Flagship', value: 'flagship' },
            { label: 'Featured', value: 'featured' },
            { label: 'Standard', value: 'standard' },
          ],
          index: true,
        },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'isFeatured',
          type: 'checkbox',
          defaultValue: false,
          index: true,
        },
        {
          name: 'onAirMention',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'homepagePlacement',
          type: 'select',
          defaultValue: 'none',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Hero', value: 'hero' },
            { label: 'Featured Row', value: 'featured-row' },
            { label: 'Events Grid', value: 'events-grid' },
          ],
        },
        {
          name: 'homepagePriority',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Auto-set by promotion tier and featured logic, but can be adjusted.',
          },
        },
      ],
    },

    {
      name: 'internalNotes',
      type: 'textarea',
      admin: {
        description: 'Internal planning notes for editorial, promo, or production.',
      },
    },

    {
      type: 'collapsible',
      label: 'SEO',
      fields: [
        {
          name: 'seoTitle',
          type: 'text',
        },
        {
          name: 'seoDescription',
          type: 'textarea',
          maxLength: 160,
        },
      ],
    },
  ],
}
