import type { CollectionConfig } from 'payload'
import { authenticated, anyone, staffOnly } from '../access/communityAccess'

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
      defaultValue: 'public',
      index: true,
      options: [
        { label: 'Public', value: 'public' },
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
            { label: 'Trolling / Bad Faith', value: 'trolling' },
            { label: 'Off-Topic Flooding', value: 'off-topic-flooding' },
            { label: 'Graphic Content', value: 'graphic-content' },
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
