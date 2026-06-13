import type { CollectionConfig } from 'payload'
import { authenticated, staffOnly } from '../access/communityAccess'

export const ChatInvites: CollectionConfig = {
  slug: 'chat-invites',
  labels: {
    singular: 'Chat Invite',
    plural: 'Chat Invites',
  },
  admin: {
    useAsTitle: 'inviteeEmail',
    defaultColumns: ['channel', 'inviteeEmail', 'invitedUser', 'status', 'expiresAt'],
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
      name: 'invitedBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'invitedUser',
      type: 'relationship',
      relationTo: 'users',
      index: true,
    },
    {
      name: 'inviteeEmail',
      type: 'email',
      index: true,
    },
    {
      name: 'token',
      type: 'text',
      unique: true,
      index: true,
      access: {
        read: staffOnly,
        update: staffOnly,
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      index: true,
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Accepted', value: 'accepted' },
        { label: 'Declined', value: 'declined' },
        { label: 'Expired', value: 'expired' },
        { label: 'Revoked', value: 'revoked' },
      ],
    },
    {
      name: 'expiresAt',
      type: 'date',
      index: true,
    },
    {
      name: 'acceptedAt',
      type: 'date',
    },
    {
      name: 'declinedAt',
      type: 'date',
    },
    {
      name: 'revokedAt',
      type: 'date',
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
}
