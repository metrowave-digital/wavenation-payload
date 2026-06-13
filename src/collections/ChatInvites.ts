import type { CollectionConfig, FieldAccess } from 'payload'
import { authenticated, staffOnly } from '../access/communityAccess'

type WaveNationUser = {
  id?: string | number
  role?: string | null
  roles?: string[] | null
  isAdmin?: boolean | null
}

/**
 * Field-level access must use FieldAccess, not collection-level Access.
 * This protects sensitive fields like invite tokens from normal authenticated users.
 */
const staffFieldOnly: FieldAccess = ({ req }) => {
  const user = req.user as WaveNationUser | null | undefined

  if (!user) return false
  if (user.isAdmin) return true

  if (typeof user.role === 'string') {
    return ['admin', 'staff', 'editor', 'moderator', 'super-admin'].includes(user.role)
  }

  if (Array.isArray(user.roles)) {
    return user.roles.some((role) =>
      ['admin', 'staff', 'editor', 'moderator', 'super-admin'].includes(role),
    )
  }

  return false
}

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
        read: staffFieldOnly,
        update: staffFieldOnly,
      },
      admin: {
        description: 'Sensitive invite token. Only staff can view or update this field.',
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
