import type { CollectionConfig, FieldAccess } from 'payload'
import { authenticated, anyone, staffOnly } from '../access/communityAccess'

type WaveNationUser = {
  id?: string | number
  role?: string | null
  roles?: string[] | null
  isAdmin?: boolean | null
}

const STAFF_ROLES = ['admin', 'staff', 'editor', 'moderator', 'super-admin']

/**
 * Field-level access must use FieldAccess.
 * Do not reuse collection-level access functions like staffOnly inside fields.
 */
const staffFieldOnly: FieldAccess = ({ req }) => {
  const user = req.user as WaveNationUser | null | undefined

  if (!user) return false
  if (user.isAdmin) return true

  if (typeof user.role === 'string') {
    return STAFF_ROLES.includes(user.role)
  }

  if (Array.isArray(user.roles)) {
    return user.roles.some((role) => STAFF_ROLES.includes(role))
  }

  return false
}

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
        { label: 'Moderation Notice', value: 'moderation_notice' },
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
        { label: 'Needs Review', value: 'needs_review' },
        { label: 'Hidden', value: 'hidden' },
        { label: 'Removed', value: 'removed' },
        { label: 'Deleted Placeholder', value: 'deleted_placeholder' },
        { label: 'Spam', value: 'spam' },
      ],
    },
    {
      name: 'visibility',
      type: 'select',
      defaultValue: 'channel',
      options: [
        { label: 'Channel Visible', value: 'channel' },
        { label: 'Staff Only', value: 'staff_only' },
        { label: 'Deleted Placeholder', value: 'deleted_placeholder' },
      ],
    },
    {
      name: 'moderationFlags',
      type: 'array',
      access: {
        read: staffFieldOnly,
        update: staffFieldOnly,
      },
      admin: {
        description: 'Internal moderation flags. Staff only.',
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
            { label: 'Hate Speech', value: 'hate_speech' },
            { label: 'Misinformation', value: 'misinformation' },
            { label: 'Off-Topic Flooding', value: 'off_topic_flooding' },
            { label: 'Private Information', value: 'private_information' },
            { label: 'Solicitation / Scam', value: 'solicitation_scam' },
            { label: 'Copyright Concern', value: 'copyright_concern' },
            { label: 'Brand Safety', value: 'brand_safety' },
          ],
        },
        {
          name: 'source',
          type: 'select',
          defaultValue: 'automated',
          options: [
            { label: 'Automated Filter', value: 'automated' },
            { label: 'User Report', value: 'user_report' },
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
        read: staffFieldOnly,
        update: staffFieldOnly,
      },
      admin: {
        description: 'Internal moderation notes. Staff only.',
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
        read: staffFieldOnly,
        update: staffFieldOnly,
      },
      admin: {
        description: 'Internal request metadata. Staff only.',
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
