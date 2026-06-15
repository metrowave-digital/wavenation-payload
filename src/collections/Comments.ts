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
 * Do not reuse collection-level access functions like staffOnly inside field access.
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

export const Comments: CollectionConfig = {
  slug: 'comments',
  labels: {
    singular: 'Comment',
    plural: 'Comments',
  },
  admin: {
    useAsTitle: 'body',
    defaultColumns: ['body', 'thread', 'author', 'status', 'createdAt'],
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
      name: 'thread',
      type: 'relationship',
      relationTo: 'comment-threads',
      required: true,
      index: true,
    },
    {
      name: 'parentComment',
      type: 'relationship',
      relationTo: 'comments',
      index: true,
      admin: {
        description: 'Used for nested replies.',
      },
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
        description: 'Snapshot of display name at comment time.',
      },
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      maxLength: 10000,
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
          name: 'alt',
          type: 'text',
          admin: {
            description: 'Required when image/video is displayed in the comment.',
          },
        },
        {
          name: 'caption',
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
      defaultValue: 'public',
      index: true,
      options: [
        { label: 'Public', value: 'public' },
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
            { label: 'Trolling / Bad Faith', value: 'trolling' },
            { label: 'Off-Topic Flooding', value: 'off_topic_flooding' },
            { label: 'Graphic Content', value: 'graphic_content' },
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
      name: 'isPinned',
      type: 'checkbox',
      defaultValue: false,
      index: true,
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      index: true,
    },
    {
      name: 'isStaffPick',
      type: 'checkbox',
      defaultValue: false,
      index: true,
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
        {
          name: 'editCount',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
      ],
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
