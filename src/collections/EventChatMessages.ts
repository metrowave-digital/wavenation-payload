import type { CollectionConfig } from 'payload'

export const EventChatMessages: CollectionConfig = {
  slug: 'event-chat-messages',
  admin: {
    useAsTitle: 'displayTitle',
    group: 'Programming',
    defaultColumns: ['displayTitle', 'event', 'status', 'isPinned', 'createdAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'displayTitle',
      type: 'text',
      admin: {
        description: 'Internal admin label for this message.',
      },
      hooks: {
        beforeValidate: [
          ({ data }) => {
            const name = data?.name?.trim?.() || 'Guest'
            const message = data?.message?.trim?.() || 'Message'
            return `${name}: ${message.slice(0, 60)}`
          },
        ],
      },
    },

    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      required: true,
      index: true,
    },

    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'approved',
      index: true,
      options: [
        { label: 'Approved', value: 'approved' },
        { label: 'Pending', value: 'pending' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Hidden', value: 'hidden' },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'role',
          type: 'select',
          defaultValue: 'viewer',
          options: [
            { label: 'Viewer', value: 'viewer' },
            { label: 'Moderator', value: 'moderator' },
            { label: 'Host', value: 'host' },
            { label: 'Producer', value: 'producer' },
            { label: 'System', value: 'system' },
          ],
        },
      ],
    },

    {
      name: 'message',
      type: 'textarea',
      required: true,
    },

    {
      type: 'row',
      fields: [
        {
          name: 'isPinned',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'isAnnouncement',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },

    {
      name: 'source',
      type: 'select',
      defaultValue: 'watch-page',
      options: [
        { label: 'Watch Page', value: 'watch-page' },
        { label: 'Moderator Entry', value: 'moderator' },
        { label: 'System', value: 'system' },
      ],
    },

    {
      name: 'viewerSessionId',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'ipAddress',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'moderatorNotes',
      type: 'textarea',
    },
  ],
}
