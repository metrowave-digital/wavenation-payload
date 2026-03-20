import type { CollectionConfig } from 'payload'

export const EventQuestions: CollectionConfig = {
  slug: 'event-questions',
  admin: {
    useAsTitle: 'displayTitle',
    group: 'Programming',
    defaultColumns: ['displayTitle', 'event', 'status', 'isHighlighted', 'createdAt'],
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
        description: 'Internal admin label for this question.',
      },
      hooks: {
        beforeValidate: [
          ({ data }) => {
            const name = data?.name?.trim?.() || 'Guest'
            const question = data?.question?.trim?.() || 'Question'
            return `${name}: ${question.slice(0, 60)}`
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
      defaultValue: 'pending',
      index: true,
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Answered', value: 'answered' },
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
          name: 'email',
          type: 'email',
        },
      ],
    },

    {
      name: 'question',
      type: 'textarea',
      required: true,
    },

    {
      name: 'isHighlighted',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Mark for producer/host priority.',
      },
    },

    {
      name: 'source',
      type: 'select',
      defaultValue: 'watch-page',
      options: [
        { label: 'Watch Page', value: 'watch-page' },
        { label: 'Moderator Entry', value: 'moderator' },
        { label: 'Imported', value: 'imported' },
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
