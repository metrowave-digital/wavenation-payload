import type { CollectionConfig } from 'payload'

type UploadMeta = {
  crop?: unknown
  focalPoint?: unknown
}

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Media',
    description: 'Images, audio, video, and documents used across WaveNation platforms.',
  },
  access: {
    read: () => true, // Public read required for rendering assets
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*', 'audio/*', 'video/*', 'application/pdf', 'text/vtt'],
    imageSizes: [
      { name: 'hero', width: 1600 },
      { name: 'card', width: 800 },
      { name: 'thumb', width: 400 },
      { name: 'square', width: 600, height: 600, crop: 'center' },
    ],
  },
  hooks: {
    beforeChange: [
      async ({ data }) => {
        // Clean up UI-only crop data before saving to DB
        if (data && typeof data === 'object') {
          const mutableData = data as UploadMeta
          if ('crop' in mutableData) delete mutableData.crop
          if ('focalPoint' in mutableData) delete mutableData.focalPoint
        }
        return data
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Metadata',
          fields: [
            {
              name: 'alt',
              type: 'text',
              label: 'Alt Text',
              admin: { description: 'Crucial for screen readers and SEO.' },
            },
            { name: 'caption', type: 'textarea', label: 'Caption' },
            { name: 'credit', type: 'text', label: 'Image / Media Credit' },
          ],
        },
        {
          label: 'Asset Organization',
          fields: [
            {
              name: 'mediaType',
              type: 'select',
              admin: { description: 'Helps editors filter the media library.' },
              options: [
                { label: 'Image', value: 'image' },
                { label: 'Audio', value: 'audio' },
                { label: 'Video', value: 'video' },
                { label: 'Document / Text', value: 'document' },
              ],
            },
            {
              name: 'tags',
              type: 'array',
              admin: {
                description:
                  'Internal keywords to find this asset later (e.g., "Summer Fest 2026", "Logo").',
              },
              fields: [{ name: 'tag', type: 'text' }],
            },
          ],
        },
      ],
    },
  ],
}
