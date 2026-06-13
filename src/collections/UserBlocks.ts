import type { CollectionConfig } from 'payload'
import { authenticated, staffOnly } from '../access/communityAccess'

export const UserBlocks: CollectionConfig = {
  slug: 'user-blocks',
  labels: {
    singular: 'User Block',
    plural: 'User Blocks',
  },
  admin: {
    useAsTitle: 'reason',
    defaultColumns: ['blocker', 'blockedUser', 'scope', 'status', 'createdAt'],
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
      name: 'blocker',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'blockedUser',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'scope',
      type: 'select',
      required: true,
      defaultValue: 'both',
      index: true,
      options: [
        { label: 'Chat Only', value: 'chat' },
        { label: 'Comments Only', value: 'comments' },
        { label: 'Both Chat and Comments', value: 'both' },
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
        { label: 'Removed', value: 'removed' },
      ],
    },
    {
      name: 'reason',
      type: 'textarea',
    },
    {
      name: 'expiresAt',
      type: 'date',
      admin: {
        description: 'Optional. Leave empty for permanent user-created block.',
      },
    },
  ],
}
