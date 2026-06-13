import type { CollectionConfig } from 'payload'
import { authenticated, staffOnly } from '../access/communityAccess'

export const CommentSubscriptions: CollectionConfig = {
  slug: 'comment-subscriptions',
  labels: {
    singular: 'Comment Subscription',
    plural: 'Comment Subscriptions',
  },
  admin: {
    useAsTitle: 'notificationLevel',
    defaultColumns: ['thread', 'user', 'notificationLevel', 'status', 'updatedAt'],
    group: 'Community',
  },
  access: {
    create: authenticated,
    read: authenticated,
    update: authenticated,
    delete: staffOnly,
  },
  timestamps: true,
  fields: [
    {
      name: 'thread',
      type: 'relationship',
      relationTo: 'comment-threads',
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
      name: 'notificationLevel',
      type: 'select',
      required: true,
      defaultValue: 'replies',
      options: [
        { label: 'All Comments', value: 'all' },
        { label: 'Replies Only', value: 'replies' },
        { label: 'Mentions Only', value: 'mentions' },
        { label: 'No Notifications', value: 'none' },
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
        { label: 'Paused', value: 'paused' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
      ],
    },
    {
      name: 'lastNotifiedAt',
      type: 'date',
    },
  ],
}
