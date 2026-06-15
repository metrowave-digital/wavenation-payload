import type { Access, CollectionConfig } from 'payload'

type PayloadUser = {
  id?: string | number
  role?: string | string[] | null
  roles?: string[] | null
}

const getUserID = (user: unknown) => {
  const typedUser = user as PayloadUser | null | undefined
  return typedUser?.id
}

const getRoles = (user: unknown): string[] => {
  const typedUser = user as PayloadUser | null | undefined
  const role = typedUser?.role
  const roles = typedUser?.roles

  return [
    ...(Array.isArray(role) ? role : role ? [role] : []),
    ...(Array.isArray(roles) ? roles : []),
  ]
}

const hasRole = (user: unknown, allowed: string[]) =>
  getRoles(user).some((role) => allowed.includes(role))

const isStaffUser = (user: unknown) =>
  hasRole(user, ['admin', 'super-admin', 'editor', 'producer', 'creator-manager'])

const authenticated: Access = ({ req: { user } }) => Boolean(user)

const staffOnly: Access = ({ req: { user } }) => isStaffUser(user)

const staffOrUploader: Access = ({ req: { user } }) => {
  if (isStaffUser(user)) return true

  const userID = getUserID(user)

  if (!userID) return false

  return {
    uploadedBy: {
      equals: userID,
    },
  }
}

export const CreatorAssets: CollectionConfig = {
  slug: 'creator-assets',
  labels: {
    singular: 'Creator Asset',
    plural: 'Creator Assets',
  },
  admin: {
    group: 'Creator Hub',
    useAsTitle: 'title',
    defaultColumns: ['title', 'assetType', 'assetStatus', 'creator', 'publicUsable'],
    listSearchableFields: ['title', 'description', 'attribution'],
  },
  access: {
    create: authenticated,
    read: staffOrUploader,
    update: staffOrUploader,
    delete: staffOnly,
  },
  timestamps: true,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Asset',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              index: true,
            },
            {
              name: 'description',
              type: 'textarea',
            },
            {
              name: 'creator',
              type: 'relationship',
              relationTo: 'creators',
              required: true,
              index: true,
            },
            {
              name: 'uploadedBy',
              type: 'relationship',
              relationTo: 'users',
              required: true,
              index: true,
            },
            {
              name: 'submission',
              type: 'relationship',
              relationTo: 'creator-submissions',
            },
            {
              name: 'assetType',
              type: 'select',
              required: true,
              defaultValue: 'other',
              options: [
                { label: 'Master Audio', value: 'master_audio' },
                { label: 'Stem', value: 'stem' },
                { label: 'Video', value: 'video' },
                { label: 'Thumbnail', value: 'thumbnail' },
                { label: 'Image', value: 'image' },
                { label: 'PDF', value: 'pdf' },
                { label: 'Contract / Agreement', value: 'contract' },
                { label: 'Brand Kit', value: 'brand_kit' },
                { label: 'Press Kit', value: 'press_kit' },
                { label: 'Transcript', value: 'transcript' },
                { label: 'Caption File', value: 'caption_file' },
                { label: 'Other', value: 'other' },
              ],
            },
            {
              name: 'assetStatus',
              type: 'select',
              defaultValue: 'uploaded',
              admin: {
                position: 'sidebar',
              },
              options: [
                { label: 'Uploaded', value: 'uploaded' },
                { label: 'Processing', value: 'processing' },
                { label: 'Under Review', value: 'under_review' },
                { label: 'Approved', value: 'approved' },
                { label: 'Rejected', value: 'rejected' },
                { label: 'Archived', value: 'archived' },
              ],
            },
            {
              name: 'publicUsable',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                position: 'sidebar',
              },
            },
          ],
        },
        {
          label: 'File',
          fields: [
            {
              name: 'file',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'altText',
              type: 'text',
              admin: {
                description: 'Required for images used publicly.',
              },
            },
            {
              name: 'caption',
              type: 'textarea',
            },
            {
              name: 'duration',
              type: 'text',
              admin: {
                description: 'For audio/video. Example: 00:03:42.',
              },
            },
          ],
        },
        {
          label: 'Rights',
          fields: [
            {
              name: 'rightsOwner',
              type: 'text',
            },
            {
              name: 'licenseType',
              type: 'select',
              defaultValue: 'creator_owned',
              options: [
                { label: 'Creator Owned', value: 'creator_owned' },
                { label: 'WaveNation Licensed', value: 'wavenation_licensed' },
                { label: 'Third-Party Licensed', value: 'third_party_licensed' },
                { label: 'Royalty Free', value: 'royalty_free' },
                { label: 'Creative Commons', value: 'creative_commons' },
                { label: 'Unknown / Needs Review', value: 'needs_review' },
              ],
            },
            {
              name: 'usagePermissions',
              type: 'array',
              fields: [
                {
                  name: 'permission',
                  type: 'select',
                  options: [
                    { label: 'Website', value: 'website' },
                    { label: 'Mobile App', value: 'mobile_app' },
                    { label: 'TV / OTT', value: 'tv_ott' },
                    { label: 'Social Media', value: 'social_media' },
                    { label: 'Advertising', value: 'advertising' },
                    { label: 'Editorial', value: 'editorial' },
                    { label: 'Sponsor Use', value: 'sponsor_use' },
                    { label: 'Internal Only', value: 'internal_only' },
                  ],
                },
              ],
            },
            {
              name: 'attribution',
              type: 'text',
            },
            {
              name: 'expiresAt',
              type: 'date',
            },
            {
              name: 'rightsNotes',
              type: 'textarea',
            },
          ],
        },
        {
          label: 'Tags & Admin',
          fields: [
            {
              name: 'tags',
              type: 'array',
              fields: [
                {
                  name: 'tag',
                  type: 'text',
                },
              ],
            },
            {
              name: 'reviewedBy',
              type: 'relationship',
              relationTo: 'users',
            },
            {
              name: 'reviewedAt',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'internalNotes',
              type: 'textarea',
            },
          ],
        },
      ],
    },
  ],
}
