import type { CollectionConfig } from 'payload'
import { authenticated, staffOnly } from '../access/communityAccess'

export const ChatMembers: CollectionConfig = {
  slug: 'chat-members',
  labels: {
    singular: 'Chat Member',
    plural: 'Chat Members',
  },
  admin: {
    useAsTitle: 'displayNameSnapshot',
    defaultColumns: ['user', 'channel', 'role', 'status', 'joinedAt'],
    group: 'Community',
  },
  access: {
    create: authenticated,
    read: authenticated,
    update: staffOnly,
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
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'member',
      index: true,
      options: [
        { label: 'Owner', value: 'owner' },
        { label: 'Admin', value: 'admin' },
        { label: 'Moderator', value: 'moderator' },
        { label: 'Member', value: 'member' },
        { label: 'Guest', value: 'guest' },
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
        { label: 'Pending', value: 'pending' },
        { label: 'Muted', value: 'muted' },
        { label: 'Banned', value: 'banned' },
        { label: 'Left', value: 'left' },
        { label: 'Removed', value: 'removed' },
      ],
    },
    {
      name: 'displayNameSnapshot',
      type: 'text',
      admin: {
        description: 'Optional display name captured at join time.',
      },
    },
    {
      name: 'notificationLevel',
      type: 'select',
      defaultValue: 'mentions',
      options: [
        { label: 'All Messages', value: 'all' },
        { label: 'Mentions Only', value: 'mentions' },
        { label: 'Muted', value: 'muted' },
      ],
    },
    {
      name: 'joinedAt',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      index: true,
    },
    {
      name: 'lastReadAt',
      type: 'date',
    },
    {
      name: 'mutedUntil',
      type: 'date',
    },
    {
      name: 'bannedReason',
      type: 'textarea',
      access: {
        read: staffOnly,
        update: staffOnly,
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      access: {
        read: staffOnly,
        update: staffOnly,
      },
    },
  ],
}
