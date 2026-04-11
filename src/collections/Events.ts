import type { CollectionConfig } from 'payload'

import { publicRead } from '../access/publicRead'
import { formatSlug } from '../hooks/formatSlug'
import { setEventStatus } from '../hooks/setEventStatus'
import { populateEventbriteData } from '../hooks/populateEventbriteData'
import { setHomepagePriority } from '../hooks/setHomepagePriority'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: { singular: 'Event', plural: 'Events' },
  admin: {
    useAsTitle: 'title',
    group: 'Programming',
    defaultColumns: ['title', 'status', 'eventType', 'startDate', 'promotionTier'],
    description:
      'Manages physical, virtual, and hybrid live events, including streaming and ticketing integrations.',
  },
  access: {
    read: publicRead,
  },
  versions: {
    drafts: true,
  },
  hooks: {
    // formatSlug is correctly applied at the collection level here
    beforeValidate: [formatSlug],
    beforeChange: [setEventStatus, populateEventbriteData, setHomepagePriority],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        /* =======================================
           TAB 1: Core Info & Content
        ======================================= */
        {
          label: 'Core Info',
          fields: [
            { name: 'title', type: 'text', required: true },
            {
              name: 'excerpt',
              type: 'textarea',
              required: true,
              maxLength: 280,
              admin: { description: 'Short summary for event cards.' },
            },
            { name: 'description', type: 'richText', required: true },
            {
              type: 'row',
              fields: [
                {
                  name: 'eventType',
                  type: 'select',
                  required: true,
                  defaultValue: 'virtual',
                  admin: { width: '50%' },
                  options: [
                    { label: 'Virtual', value: 'virtual' },
                    { label: 'In-Person', value: 'in-person' },
                    { label: 'Hybrid', value: 'hybrid' },
                  ],
                },
                {
                  name: 'contentVertical',
                  type: 'select',
                  required: true,
                  defaultValue: 'culture',
                  admin: { width: '50%' },
                  options: [
                    { label: 'Music', value: 'music' },
                    { label: 'Culture', value: 'culture' },
                    { label: 'Faith', value: 'faith' },
                    { label: 'Creator', value: 'creator' },
                    { label: 'Radio', value: 'radio' },
                    { label: 'TV', value: 'tv' },
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
                  admin: { width: '50%', date: { pickerAppearance: 'dayAndTime' } },
                },
                {
                  name: 'endDate',
                  type: 'date',
                  required: true,
                  admin: { width: '50%', date: { pickerAppearance: 'dayAndTime' } },
                },
              ],
            },
            { name: 'timezone', type: 'text', required: true, defaultValue: 'America/Chicago' },
            {
              type: 'row',
              fields: [
                {
                  name: 'heroImage',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { width: '50%', description: '16:9 Desktop Hero' },
                },
                {
                  name: 'thumbnail',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { width: '50%', description: '1:1 or 4:5 Mobile Card' },
                },
              ],
            },
            {
              name: 'agenda',
              type: 'array',
              label: 'Event Agenda',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'time', type: 'text', admin: { width: '30%' } },
                    { name: 'title', type: 'text', required: true, admin: { width: '70%' } },
                  ],
                },
                { name: 'description', type: 'textarea' },
              ],
            },
            {
              name: 'faq',
              type: 'array',
              label: 'FAQ',
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'textarea', required: true },
              ],
            },
          ],
        },

        /* =======================================
           TAB 2: Location, Talent & Sponsors
        ======================================= */
        {
          label: 'Location & People',
          fields: [
            {
              name: 'venue',
              type: 'relationship',
              relationTo: 'venues',
              admin: {
                description: 'Physical or primary studio location.',
                condition: (_, data) => ['in-person', 'hybrid'].includes(data?.eventType),
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'hosts',
                  type: 'relationship',
                  relationTo: 'talent',
                  hasMany: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'guests',
                  type: 'relationship',
                  relationTo: 'talent',
                  hasMany: true,
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'sponsors',
              type: 'relationship',
              relationTo: 'sponsors',
              hasMany: true,
              admin: { description: 'Brands officially sponsoring this event.' },
            },
          ],
        },

        /* =======================================
           TAB 3: Live Stream & Replay
        ======================================= */
        {
          label: 'Stream & Replay',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'watchPageEnabled',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    width: '50%',
                    description: 'Enable the dedicated WaveNation watch page.',
                  },
                },
                {
                  name: 'watchPagePath',
                  type: 'text',
                  admin: { width: '50%', description: 'Leave blank to use /events/[slug]/watch' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'livestreamPlatform',
                  type: 'select',
                  admin: { width: '50%' },
                  options: [
                    { label: 'WaveNation Native', value: 'wavenation-native' },
                    { label: 'Cloudflare Stream', value: 'cloudflare' },
                    { label: 'Mux', value: 'mux' },
                    { label: 'Streamlabs', value: 'streamlabs' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'Other', value: 'other' },
                  ],
                },
                {
                  name: 'streamHealthStatus',
                  type: 'select',
                  defaultValue: 'unknown',
                  admin: { width: '50%' },
                  options: [
                    { label: 'Unknown', value: 'unknown' },
                    { label: 'Ready', value: 'ready' },
                    { label: 'Live', value: 'live' },
                    { label: 'Offline', value: 'offline' },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'cloudflarePlaybackId',
                  type: 'text',
                  admin: { width: '50%', description: 'Cloudflare/Mux Stream playback ID.' },
                },
                {
                  name: 'streamEmbedUrl',
                  type: 'text',
                  admin: { width: '50%', description: 'Fallback iframe embed URL.' },
                },
              ],
            },
            {
              name: 'messaging',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'preLiveMessage', type: 'text', admin: { width: '50%' } },
                    { name: 'postEventMessage', type: 'text', admin: { width: '50%' } },
                  ],
                },
                { name: 'livestreamAccessInstructions', type: 'textarea' },
              ],
            },
            {
              name: 'replay',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'replayEnabled',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: { width: '50%' },
                    },
                    {
                      name: 'replayAvailableImmediately',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'replayAvailableAt',
                      type: 'date',
                      admin: { width: '50%', date: { pickerAppearance: 'dayAndTime' } },
                    },
                    {
                      name: 'replayExpiresAt',
                      type: 'date',
                      admin: { width: '50%', date: { pickerAppearance: 'dayAndTime' } },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'cloudflareReplayPlaybackId', type: 'text', admin: { width: '50%' } },
                    {
                      name: 'replayUrl',
                      type: 'text',
                      admin: {
                        width: '50%',
                        description: 'External replay link (e.g. YouTube VOD)',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },

        /* =======================================
           TAB 4: Ticketing & Entitlements
        ======================================= */
        {
          label: 'Ticketing & Access',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'visibility',
                  type: 'select',
                  defaultValue: 'public',
                  admin: { width: '50%' },
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
                  admin: { width: '50%' },
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
                  admin: { width: '33%' },
                },
                {
                  name: 'loginRequired',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { width: '33%' },
                },
                {
                  name: 'ticketVerificationRequired',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { width: '34%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'capacity', type: 'number', min: 0, admin: { width: '50%' } },
                {
                  name: 'requiredSubscriptionTier',
                  type: 'relationship',
                  relationTo: 'subscriptions',
                  admin: {
                    width: '50%',
                    description: 'Gate access to specific WaveNation+ tiers.',
                  },
                },
              ],
            },
            { name: 'accessDeniedMessage', type: 'textarea' },
            {
              name: 'eventbrite',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'eventbriteEventId', type: 'text', admin: { width: '50%' } },
                    { name: 'eventbriteUrl', type: 'text', admin: { width: '50%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'eventbriteSyncEnabled',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: { width: '50%' },
                    },
                    {
                      name: 'eventbriteLastSyncedAt',
                      type: 'date',
                      admin: { width: '50%', readOnly: true },
                    },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'ctaLabel', type: 'text', admin: { width: '50%' } },
                { name: 'ctaUrl', type: 'text', admin: { width: '50%' } },
              ],
            },
          ],
        },

        /* =======================================
           TAB 5: Audience Engagement
        ======================================= */
        {
          label: 'Audience & Chat',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'chatEnabled', type: 'checkbox', defaultValue: true },
                { name: 'qaEnabled', type: 'checkbox', defaultValue: true },
                { name: 'reactionsEnabled', type: 'checkbox', defaultValue: false },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'chatMode',
                  type: 'select',
                  defaultValue: 'disabled',
                  admin: { width: '50%' },
                  options: [
                    { label: 'Disabled', value: 'disabled' },
                    { label: 'Native Chat', value: 'native' },
                    { label: 'Moderated Q&A Only', value: 'qa-only' },
                    { label: 'External Chat', value: 'external' },
                  ],
                },
                {
                  name: 'chatEmbedUrl',
                  type: 'text',
                  admin: { width: '50%', description: 'External chat embed URL (e.g. Arena.im).' },
                },
              ],
            },
            {
              name: 'moderators',
              type: 'relationship',
              relationTo: 'moderators',
              hasMany: true,
              admin: { description: 'Staff assigned to moderate the chat for this event.' },
            },
            {
              name: 'qaPrompt',
              type: 'text',
              admin: { description: 'Optional prompt shown above the question form.' },
            },
            {
              name: 'viewerNotice',
              type: 'text',
              admin: {
                description: 'Short notice shown in the live room (e.g. moderation rules).',
              },
            },
            { name: 'audienceGuidelines', type: 'textarea' },
          ],
        },

        /* =======================================
           TAB 6: Production & SEO
        ======================================= */
        {
          label: 'Production & Meta',
          fields: [
            {
              name: 'productionTeam',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'producerName', type: 'text', admin: { width: '50%' } },
                    { name: 'technicalDirectorName', type: 'text', admin: { width: '50%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'runOfShowUrl', type: 'text', admin: { width: '50%' } },
                    { name: 'greenRoomUrl', type: 'text', admin: { width: '50%' } },
                  ],
                },
                { name: 'productionNotes', type: 'textarea' },
                { name: 'streamTestingNotes', type: 'textarea' },
              ],
            },
            {
              name: 'relatedContent',
              type: 'group',
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
                { name: 'relatedVOD', type: 'relationship', relationTo: 'vod', hasMany: true },
                {
                  name: 'relatedPlaylists',
                  type: 'relationship',
                  relationTo: 'playlists',
                  hasMany: true,
                },
              ],
            },
            {
              name: 'seo',
              type: 'group',
              fields: [
                { name: 'seoTitle', type: 'text' },
                { name: 'seoDescription', type: 'textarea', maxLength: 160 },
                { name: 'seoImage', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
      ],
    },

    /* =======================================
       SIDEBAR: Status & Promotion
    ======================================= */
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Auto-generated from title if left blank.' },
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
      admin: { position: 'sidebar' },
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
      admin: { position: 'sidebar' },
      index: true,
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      admin: { position: 'sidebar' },
    },
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
      admin: { position: 'sidebar' },
    },
    {
      name: 'homepagePriority',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', readOnly: true },
    },
    { name: 'onAirMention', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'internalNotes', type: 'textarea', admin: { position: 'sidebar' } },
  ],
}
