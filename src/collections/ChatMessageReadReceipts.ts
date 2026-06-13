import type { CollectionConfig } from 'payload'
import { authenticated, staffOnly } from '../access/communityAccess'

export const ChatMessageReadReceipts: CollectionConfig = {
  slug: 'chat-message-read-receipts',
  labels: {
    singular: 'Chat Message Read Receipt',
    plural: 'Chat Message Read Receipts',
  },
  admin: {
    useAsTitle: 'user',
    defaultColumns: ['user', 'channel', 'message', 'readAt'],
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
      name: 'channel',
      type: 'relationship',
      relationTo: 'chat-channels',
      required: true,
      index: true,
    },
    {
      name: 'message',
      type: 'relationship',
      relationTo: 'chat-messages',
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
      name: 'readAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      index: true,
    },
  ],
}
