import type { CollectionConfig } from 'payload'

export const Podcasts: CollectionConfig = {
  slug: 'podcasts',
  labels: {
    singular: 'Podcast',
    plural: 'Podcasts',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Audio & Podcasts',
    defaultColumns: ['title', 'status', 'updatedAt'],
  },

  versions: {
    drafts: true,
  },

  access: {
    read: () => true,

    create: ({ req }) =>
      Boolean(
        req.user && (req.user.roles?.includes('editor') || req.user.roles?.includes('admin')),
      ),

    update: ({ req }) =>
      Boolean(
        req.user && (req.user.roles?.includes('editor') || req.user.roles?.includes('admin')),
      ),

    delete: ({ req }) => Boolean(req.user && req.user.roles?.includes('admin')),
  },

  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true },

    { name: 'description', type: 'textarea' },

    {
      name: 'hosts',
      type: 'relationship',
      relationTo: 'talent',
      hasMany: true,
    },

    {
      name: 'coverArt',
      type: 'upload',
      relationTo: 'media',
    },

    {
      name: 'distribution',
      type: 'group',
      fields: [
        { name: 'applePodcasts', type: 'checkbox' },
        { name: 'spotify', type: 'checkbox' },
        { name: 'youtube', type: 'checkbox' },
        { name: 'wavenation', type: 'checkbox', defaultValue: true },
      ],
    },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Active', value: 'active' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },

    {
      name: 'audio',
      type: 'group',
      admin: {
        description: 'Primary audio source',
      },
      fields: [
        {
          name: 'audioSource',
          type: 'select',
          defaultValue: 'upload',
          options: [
            { label: 'Upload Audio File', value: 'upload' },
            { label: 'External Audio URL', value: 'external' },
          ],
        },

        {
          name: 'audioFile',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (_, data) => data?.audio?.audioSource === 'upload',
          },
        },

        {
          name: 'audioUrl',
          type: 'text',
          admin: {
            placeholder: 'https://...',
            condition: (_, data) => data?.audio?.audioSource === 'external',
          },
        },

        {
          name: 'duration',
          type: 'number',
          admin: {
            description: 'Duration in seconds (optional)',
          },
        },
      ],
    },

    {
      name: 'ads',
      type: 'group',
      admin: {
        description: 'Podcast advertising (Google Ad Manager)',
      },
      fields: [
        {
          name: 'adsEnabled',
          type: 'checkbox',
          defaultValue: true,
        },

        {
          name: 'disableForPremium',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Disable ads for WaveNation+ subscribers',
          },
        },

        {
          name: 'placements',
          type: 'group',
          fields: [
            {
              name: 'preRoll',
              type: 'text',
              admin: {
                placeholder: 'GAM VAST URL – Pre-roll audio',
              },
            },
            {
              name: 'midRoll',
              type: 'array',
              admin: {
                description: 'Mid-roll audio ads',
              },
              fields: [
                {
                  name: 'offset',
                  type: 'number',
                  admin: {
                    description: 'Seconds into audio',
                  },
                },
                {
                  name: 'vastUrl',
                  type: 'text',
                  admin: {
                    placeholder: 'GAM VAST URL',
                  },
                },
              ],
            },
            {
              name: 'postRoll',
              type: 'text',
              admin: {
                placeholder: 'GAM VAST URL – Post-roll audio',
              },
            },
          ],
        },
      ],
    },

    {
      name: 'sponsor',
      type: 'group',
      admin: {
        description: 'Host-read or branded sponsorship',
      },
      fields: [
        { name: 'brandName', type: 'text' },
        { name: 'disclosure', type: 'text' },
        {
          name: 'audioClip',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Optional sponsor audio intro/outro',
          },
        },
      ],
    },
  ],
}
