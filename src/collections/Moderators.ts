import type { CollectionConfig } from 'payload'

export const Moderators: CollectionConfig = {
  slug: 'moderators',
  labels: { singular: 'Moderator', plural: 'Moderators' },
  admin: {
    useAsTitle: 'displayName',
    group: 'People',
    defaultColumns: ['displayName', 'user', 'permissions', 'status'],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'displayName',
          type: 'text',
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
          admin: {
            width: '50%',
            description: 'The internal user account tied to this moderator.',
          },
        },
      ],
    },
    {
      name: 'permissions',
      type: 'select',
      hasMany: true,
      required: true,
      options: [
        { label: 'Approve Q&A', value: 'approve_q_and_a' },
        { label: 'Delete Chat Messages', value: 'delete_chat_messages' },
        { label: 'Ban Users', value: 'ban_users' },
        { label: 'Pin Messages', value: 'pin_messages' },
        { label: 'Stream Status Override', value: 'stream_status_override' },
      ],
    },
    {
      name: 'assignedEvents',
      type: 'relationship',
      relationTo: 'events',
      hasMany: true,
      admin: {
        description: 'Specific upcoming events this moderator is scheduled for.',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
