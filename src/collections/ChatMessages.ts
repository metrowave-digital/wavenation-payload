import type { CollectionConfig } from 'payload'
import { authenticated, anyone, staffOnly } from '../access/communityAccess'

export const ChatMessages: CollectionConfig = {
  slug: 'chat-messages',
  labels: {
    singular: 'Chat Message',
    plural: 'Chat Messages',
  },
  admin: {
    useAsTitle: 'body',
    defaultColumns: ['body', 'channel', 'author', 'status', 'createdAt'],
    group: 'Community',
  },
  access: {
    create: authenticated,
    read: anyone,
    update: authenticated,
    delete: staffOnly,
  },
  timestamps: true,
  fields: [
    {
      name: 'channel',
      type: 'relationship',
      relationTo: 'chat-channels',
      required: true,
      index: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'authorDisplayName',
      type: 'text',
      admin: {
        description: 'Snapshot of the author display name at send time.',
      },
    },
    {
      name: 'parentMessage',
      type: 'relationship',
      relationTo: 'chat-messages',
      index: true,
      admin: {
        description: 'Used for threaded replies.',
      },
    },
    {
      name: 'messageType',
      type: 'select',
      required: true,
      defaultValue: 'text',
      options: [
        { label: 'Text', value: 'text' },
        { label: 'Image', value: 'image' },
        { label: 'Audio', value: 'audio' },
        { label: 'Video', value: 'video' },
        { label: 'Link', value: 'link' },
        { label: 'System', value: 'system' },
        { label: 'Moderation Notice', value: 'moderation-notice' },
      ],
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      maxLength: 5000,
    },
    {
      name: 'attachments',
      type: 'array',
      fields: [
        {
          name: 'file',
          type: 'relationship',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
        },
        {
          name: 'alt',
          type: 'text',
          admin: {
            description: 'Required for accessibility when displaying media.',
          },
        },
      ],
    },
    {
      name: 'linkPreview',
      type: 'group',
      fields: [
        {
          name: 'url',
          type: 'text',
        },
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'imageUrl',
          type: 'text',
        },
        {
          name: 'provider',
          type: 'text',
        },
      ],
    },
    {
      name: 'mentions',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      index: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'published',
      index: true,
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Needs Review', value: 'needs-review' },
        { label: 'Hidden', value: 'hidden' },
        { label: 'Removed', value: 'removed' },
        { label: 'Deleted Placeholder', value: 'deleted-placeholder' },
        { label: 'Spam', value: 'spam' },
      ],
    },
    {
      name: 'visibility',
      type: 'select',
      defaultValue: 'channel',
      options: [
        { label: 'Channel Visible', value: 'channel' },
        { label: 'Staff Only', value: 'staff-only' },
        { label: 'Deleted Placeholder', value: 'deleted-placeholder' },
      ],
    },
    {
      name: 'moderationFlags',
      type: 'array',
      access: {
        read: staffOnly,
        update: staffOnly,
      },
      fields: [
        {
          name: 'flag',
          type: 'select',
          required: true,
          options: [
            { label: 'Spam', value: 'spam' },
            { label: 'Harassment', value: 'harassment' },
            { label: 'Threat', value: 'threat' },
            { label: 'Hate Speech', value: 'hate-speech' },
            { label: 'Misinformation', value: 'misinformation' },
            { label: 'Off-Topic Flooding', value: 'off-topic-flooding' },
            { label: 'Private Information', value: 'private-information' },
            { label: 'Solicitation / Scam', value: 'solicitation-scam' },
            { label: 'Copyright Concern', value: 'copyright-concern' },
            { label: 'Brand Safety', value: 'brand-safety' },
          ],
        },
        {
          name: 'source',
          type: 'select',
          defaultValue: 'automated',
          options: [
            { label: 'Automated Filter', value: 'automated' },
            { label: 'User Report', value: 'user-report' },
            { label: 'Moderator', value: 'moderator' },
          ],
        },
        {
          name: 'note',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'moderationNotes',
      type: 'textarea',
      access: {
        read: staffOnly,
        update: staffOnly,
      },
    },
    {
      name: 'counts',
      type: 'group',
      fields: [
        {
          name: 'reactionCount',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'replyCount',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'reportCount',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
      ],
    },
    {
      name: 'isPinned',
      type: 'checkbox',
      defaultValue: false,
      index: true,
    },
    {
      name: 'pinnedUntil',
      type: 'date',
    },
    {
      name: 'editedAt',
      type: 'date',
    },
    {
      name: 'deletedAt',
      type: 'date',
    },
    {
      name: 'metadata',
      type: 'group',
      access: {
        read: staffOnly,
        update: staffOnly,
      },
      fields: [
        {
          name: 'ipHash',
          type: 'text',
        },
        {
          name: 'userAgent',
          type: 'text',
        },
        {
          name: 'source',
          type: 'select',
          defaultValue: 'web',
          options: [
            { label: 'Web', value: 'web' },
            { label: 'Mobile App', value: 'mobile' },
            { label: 'TV App', value: 'tv' },
            { label: 'Admin', value: 'admin' },
            { label: 'API', value: 'api' },
          ],
        },
      ],
    },
  ],
}
