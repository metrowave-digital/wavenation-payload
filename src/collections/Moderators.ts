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
        { name: 'displayName', type: 'text', required: true, admin: { width: '50%' } },
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
          admin: { width: '50%', description: 'The internal user account tied to this moderator.' },
        },
      ],
    },
    {
      name: 'permissions',
      type: 'select',
      hasMany: true,
      required: true,
      options: [
        'Approve Q&A',
        'Delete Chat Messages',
        'Ban Users',
        'Pin Messages',
        'Stream Status Override',
      ],
    },
    {
      name: 'assignedEvents',
      type: 'relationship',
      relationTo: 'events',
      hasMany: true,
      admin: { description: 'Specific upcoming events this moderator is scheduled for.' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: ['active', 'inactive'],
      admin: { position: 'sidebar' },
    },
  ],
}
