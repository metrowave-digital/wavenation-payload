import type { CollectionConfig } from 'payload'
import { authenticated, anyone, staffOnly } from '../access/communityAccess'

export const ChatChannels: CollectionConfig = {
  slug: 'chat-channels',
  labels: {
    singular: 'Chat Channel',
    plural: 'Chat Channels',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'channelType', 'visibility', 'status', 'lastMessageAt'],
    group: 'Community',
  },
  access: {
    create: staffOnly,
    read: anyone,
    update: staffOnly,
    delete: staffOnly,
  },
  timestamps: true,
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Used in URLs and front-end channel routing.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'channelType',
      type: 'select',
      required: true,
      defaultValue: 'public',
      index: true,
      options: [
        { label: 'Public Community Channel', value: 'public' },
        { label: 'Live Show Chat', value: 'live_show' },
        { label: 'Live TV / Stream Chat', value: 'live_stream' },
        { label: 'Creator Channel', value: 'creator' },
        { label: 'Event Channel', value: 'event' },
        { label: 'Article Discussion Channel', value: 'article' },
        { label: 'Private Group', value: 'private_group' },
        { label: 'Direct Message Channel', value: 'direct' },
        { label: 'Support Channel', value: 'support' },
        { label: 'Staff Channel', value: 'staff' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      index: true,
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Locked', value: 'locked' },
        { label: 'Archived', value: 'archived' },
        { label: 'Hidden', value: 'hidden' },
        { label: 'Deleted', value: 'deleted' },
      ],
    },
    {
      name: 'visibility',
      type: 'select',
      required: true,
      defaultValue: 'public',
      index: true,
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Logged-In Users Only', value: 'authenticated' },
        { label: 'Subscribers Only', value: 'subscribers' },
        { label: 'WaveNation+ Only', value: 'plus' },
        { label: 'Creator Members Only', value: 'creator_members' },
        { label: 'Invite Only', value: 'invite_only' },
        { label: 'Staff Only', value: 'staff_only' },
      ],
    },
    {
      name: 'coverImage',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Primary owner or staff/admin owner of this channel.',
      },
    },
    {
      name: 'creatorProfileId',
      type: 'text',
      admin: {
        description:
          'Optional external/related creator profile ID. Kept as text so this channel can connect to any creator collection without breaking schema.',
      },
    },
    {
      name: 'relatedContent',
      type: 'group',
      fields: [
        {
          name: 'targetCollection',
          type: 'select',
          options: [
            { label: 'Article', value: 'articles' },
            { label: 'Event', value: 'events' },
            { label: 'Show', value: 'shows' },
            { label: 'Episode', value: 'episodes' },
            { label: 'Playlist', value: 'playlists' },
            { label: 'Creator', value: 'creators' },
            { label: 'Creator Profile', value: 'creator_profiles' },
            { label: 'Live Stream', value: 'live_streams' },
            { label: 'Custom', value: 'custom' },
          ],
        },
        {
          name: 'targetDocumentId',
          type: 'text',
        },
        {
          name: 'targetSlug',
          type: 'text',
        },
        {
          name: 'targetTitle',
          type: 'text',
        },
        {
          name: 'canonicalUrl',
          type: 'text',
        },
      ],
    },
    {
      name: 'permissions',
      type: 'group',
      fields: [
        {
          name: 'allowMessages',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'allowReplies',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'allowReactions',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'allowMedia',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'allowLinks',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'requireMessageApproval',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'slowModeSeconds',
          type: 'number',
          min: 0,
          defaultValue: 0,
          admin: {
            description: '0 disables slow mode.',
          },
        },
        {
          name: 'maxMessageLength',
          type: 'number',
          defaultValue: 1000,
          min: 120,
        },
      ],
    },
    {
      name: 'moderation',
      type: 'group',
      fields: [
        {
          name: 'moderationMode',
          type: 'select',
          defaultValue: 'post-moderation',
          options: [
            { label: 'Post Moderation', value: 'post_moderation' },
            { label: 'Pre Moderation', value: 'pre_moderation' },
            { label: 'Staff Only', value: 'staff_only' },
            { label: 'Locked', value: 'locked' },
          ],
        },
        {
          name: 'profanityFilterLevel',
          type: 'select',
          defaultValue: 'standard',
          options: [
            { label: 'Off', value: 'off' },
            { label: 'Standard', value: 'standard' },
            { label: 'Strict', value: 'strict' },
          ],
        },
        {
          name: 'lockedReason',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'counts',
      type: 'group',
      admin: {
        description: 'Denormalized counters. Update through hooks/jobs/server actions.',
      },
      fields: [
        {
          name: 'memberCount',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'messageCount',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'reportedMessageCount',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
      ],
    },
    {
      name: 'lastMessageAt',
      type: 'date',
      index: true,
    },
    {
      name: 'lastMessagePreview',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      index: true,
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 100,
      index: true,
    },
  ],
}
