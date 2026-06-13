import type { CollectionConfig } from 'payload'
import { authenticated, anyone, staffOnly } from '../access/communityAccess'

export const CommentReactions: CollectionConfig = {
  slug: 'comment-reactions',
  labels: {
    singular: 'Comment Reaction',
    plural: 'Comment Reactions',
  },
  admin: {
    useAsTitle: 'reaction',
    defaultColumns: ['comment', 'user', 'reaction', 'status', 'createdAt'],
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
      name: 'comment',
      type: 'relationship',
      relationTo: 'comments',
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
      name: 'reaction',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'Like', value: 'like' },
        { label: 'Love', value: 'love' },
        { label: 'Fire', value: 'fire' },
        { label: 'Laugh', value: 'laugh' },
        { label: 'Pray', value: 'pray' },
        { label: 'Wave', value: 'wave' },
        { label: '100', value: '100' },
        { label: 'Custom Emoji', value: 'custom' },
      ],
    },
    {
      name: 'customEmoji',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      index: true,
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Removed', value: 'removed' },
      ],
    },
  ],
}
