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

    /**
     * NEW: Live Stream Controls
     * Adds structured support for WaveNation-native watch pages
     * and Cloudflare/Streamlabs workflows without changing existing fields.
     */
    {
      type: 'collapsible',
      label: 'Live Stream Controls',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'watchPageEnabled',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Enable the dedicated WaveNation watch page for this event.',
              },
            },
            {
              name: 'watchPagePath',
              type: 'text',
              admin: {
                description: 'Optional custom watch path. Leave blank to use /events/[slug]/watch.',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'cloudflarePlaybackId',
              type: 'text',
              index: true,
              admin: {
                description: 'Primary Cloudflare Stream playback ID used for live playback.',
              },
            },
            {
              name: 'cloudflareReplayPlaybackId',
              type: 'text',
              index: true,
              admin: {
                description: 'Cloudflare Stream playback ID for the replay version, if different.',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'streamProviderLabel',
              type: 'text',
              admin: {
                description:
                  'Optional display label such as Cloudflare Stream, Streamlabs Ultra, or Private Player.',
              },
            },
            {
              name: 'streamHealthStatus',
              type: 'select',
              defaultValue: 'unknown',
              options: [
                { label: 'Unknown', value: 'unknown' },
                { label: 'Ready', value: 'ready' },
                { label: 'Testing', value: 'testing' },
                { label: 'Live', value: 'live' },
                { label: 'Issue', value: 'issue' },
                { label: 'Offline', value: 'offline' },
              ],
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'preLiveMessage',
              type: 'text',
              admin: {
                description: 'Message shown before the event goes live.',
              },
            },
            {
              name: 'postEventMessage',
              type: 'text',
              admin: {
                description: 'Message shown after the live stream ends.',
              },
            },
          ],
        },
        {
          name: 'streamTestingNotes',
          type: 'textarea',
          admin: {
            description:
              'Internal notes for stream checks, embeds, player setup, or rehearsal findings.',
          },
        },
      ],
    },

    /**
     * NEW: Audience Experience
     */
    {
      type: 'collapsible',
      label: 'Audience Experience',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'chatEnabled',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'qaEnabled',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'reactionsEnabled',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'chatMode',
              type: 'select',
              defaultValue: 'disabled',
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
              admin: {
                description: 'Optional external chat embed URL if using a third-party chat.',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'qaPrompt',
              type: 'text',
              admin: {
                description: 'Optional prompt shown above the question form.',
              },
            },
            {
              name: 'viewerNotice',
              type: 'text',
              admin: {
                description:
                  'Short notice shown in the live room, such as moderation or access reminders.',
              },
            },
          ],
        },
        {
          name: 'audienceGuidelines',
          type: 'textarea',
          admin: {
            description:
              'Optional community guidelines or participation rules displayed on the watch page.',
          },
        },
      ],
    },

    /**
     * NEW: Replay Settings
     */
    {
      type: 'collapsible',
      label: 'Replay Settings',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'replayEnabled',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'replayAvailableImmediately',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'replayAvailableAt',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
                description: 'Optional date/time when replay becomes available.',
              },
            },
            {
              name: 'replayExpiresAt',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
                description: 'Optional date/time when replay access expires.',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'replayLabel',
              type: 'text',
              admin: {
                description: 'Optional label for replay CTA, such as Watch Replay.',
              },
            },
            {
              name: 'replayThumbnailOverride',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
      ],
    },

    /**
     * NEW: Access & Entitlements
     */
    {
      type: 'collapsible',
      label: 'Access & Entitlements',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'loginRequired',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Require a WaveNation account session before viewing.',
              },
            },
            {
              name: 'ticketVerificationRequired',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Require a verified ticket/registration entitlement before viewing.',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'memberTierRequired',
              type: 'text',
              admin: {
                description: 'Optional membership tier required for access.',
              },
            },
            {
              name: 'accessCodeLabel',
              type: 'text',
              admin: {
                description: 'Optional label if access code entry is used on the watch page.',
              },
            },
          ],
        },
        {
          name: 'accessDeniedMessage',
          type: 'textarea',
          admin: {
            description: 'Custom message shown when a viewer does not have access.',
          },
        },
      ],
    },

    /**
     * NEW: Production & Operations
     */
    {
      type: 'collapsible',
      label: 'Production & Operations',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'producerName',
              type: 'text',
            },
            {
              name: 'moderatorName',
              type: 'text',
            },
            {
              name: 'technicalDirectorName',
              type: 'text',
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'runOfShowUrl',
              type: 'text',
              admin: {
                description:
                  'Optional internal URL to a run of show, cue sheet, or production doc.',
              },
            },
            {
              name: 'greenRoomUrl',
              type: 'text',
              admin: {
                description: 'Optional private host/guest backstage or green room link.',
              },
            },
          ],
        },
        {
          name: 'productionNotes',
          type: 'textarea',
          admin: {
            description:
              'Internal production notes for cues, transitions, sponsor reads, backups, or contingency plans.',
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

        /**
         * NEW: Extra SEO / Sharing fields
         */
        {
          name: 'seoImage',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'socialShareTitle',
          type: 'text',
        },
        {
          name: 'socialShareDescription',
          type: 'textarea',
          maxLength: 200,
        },
      ],
    },
  ],
}
