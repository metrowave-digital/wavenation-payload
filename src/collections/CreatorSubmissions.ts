import type { Access, CollectionConfig } from 'payload'

type PayloadUser = {
  id?: string | number
  role?: string | string[] | null
  roles?: string[] | null
}

const formatSlug = (value?: string | null) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

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

const staffOrSubmitter: Access = ({ req: { user } }) => {
  if (isStaffUser(user)) return true

  const userID = getUserID(user)

  if (!userID) return false

  return {
    submittedBy: {
      equals: userID,
    },
  }
}

export const CreatorSubmissions: CollectionConfig = {
  slug: 'creator-submissions',
  labels: {
    singular: 'Creator Submission',
    plural: 'Creator Submissions',
  },
  admin: {
    group: 'Creator Hub',
    useAsTitle: 'title',
    defaultColumns: ['title', 'submissionType', 'submissionStatus', 'creator', 'submittedAt'],
    listSearchableFields: ['title', 'description', 'artistName', 'songTitle'],
  },
  access: {
    create: authenticated,
    read: staffOrSubmitter,
    update: staffOrSubmitter,
    delete: staffOnly,
  },
  timestamps: true,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Submission',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              index: true,
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              index: true,
              hooks: {
                beforeValidate: [({ value, data }) => value || formatSlug(data?.title)],
              },
            },
            {
              name: 'submissionType',
              type: 'select',
              required: true,
              defaultValue: 'music',
              options: [
                { label: 'Music', value: 'music' },
                { label: 'Video', value: 'video' },
                { label: 'Podcast', value: 'podcast' },
                { label: 'Article / Editorial Pitch', value: 'article' },
                { label: 'Show Pitch', value: 'show-pitch' },
                { label: 'Playlist Placement', value: 'playlist-placement' },
                { label: 'Event Performance', value: 'event-performance' },
                { label: 'Sponsor Collaboration', value: 'sponsor-collab' },
                { label: 'General Creator Upload', value: 'general-upload' },
              ],
            },
            {
              name: 'description',
              type: 'textarea',
            },
            {
              name: 'submittedBy',
              type: 'relationship',
              relationTo: 'users',
              required: true,
              index: true,
            },
            {
              name: 'creator',
              type: 'relationship',
              relationTo: 'creators',
              required: true,
              index: true,
            },
            {
              name: 'submittedAt',
              type: 'date',
              defaultValue: () => new Date(),
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'submissionStatus',
              type: 'select',
              required: true,
              defaultValue: 'submitted',
              admin: {
                position: 'sidebar',
              },
              options: [
                { label: 'Submitted', value: 'submitted' },
                { label: 'Under Review', value: 'under-review' },
                { label: 'Changes Requested', value: 'changes-requested' },
                { label: 'Approved', value: 'approved' },
                { label: 'Rejected', value: 'rejected' },
                { label: 'Published', value: 'published' },
                { label: 'Archived', value: 'archived' },
              ],
            },
            {
              name: 'priority',
              type: 'select',
              defaultValue: 'normal',
              admin: {
                position: 'sidebar',
              },
              options: [
                { label: 'Low', value: 'low' },
                { label: 'Normal', value: 'normal' },
                { label: 'High', value: 'high' },
                { label: 'Urgent', value: 'urgent' },
              ],
            },
          ],
        },
        {
          label: 'Music',
          fields: [
            {
              name: 'artistName',
              type: 'text',
              admin: {
                condition: (_, siblingData) =>
                  ['music', 'playlist-placement'].includes(siblingData?.submissionType),
              },
            },
            {
              name: 'songTitle',
              type: 'text',
              admin: {
                condition: (_, siblingData) =>
                  ['music', 'playlist-placement'].includes(siblingData?.submissionType),
              },
            },
            {
              name: 'isrc',
              label: 'ISRC',
              type: 'text',
              admin: {
                condition: (_, siblingData) =>
                  ['music', 'playlist-placement'].includes(siblingData?.submissionType),
              },
            },
            {
              name: 'genre',
              type: 'text',
              admin: {
                condition: (_, siblingData) =>
                  ['music', 'playlist-placement'].includes(siblingData?.submissionType),
              },
            },
            {
              name: 'moodTags',
              type: 'array',
              admin: {
                condition: (_, siblingData) =>
                  ['music', 'playlist-placement'].includes(siblingData?.submissionType),
              },
              fields: [
                {
                  name: 'mood',
                  type: 'text',
                },
              ],
            },
            {
              name: 'explicit',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                condition: (_, siblingData) =>
                  ['music', 'playlist-placement'].includes(siblingData?.submissionType),
              },
            },
            {
              name: 'streamingLinks',
              type: 'array',
              admin: {
                condition: (_, siblingData) =>
                  ['music', 'playlist-placement'].includes(siblingData?.submissionType),
              },
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  options: [
                    { label: 'Spotify', value: 'spotify' },
                    { label: 'Apple Music', value: 'apple-music' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'SoundCloud', value: 'soundcloud' },
                    { label: 'Audiomack', value: 'audiomack' },
                    { label: 'Tidal', value: 'tidal' },
                    { label: 'Other', value: 'other' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Video / Podcast / Article',
          fields: [
            {
              name: 'episodeTitle',
              type: 'text',
              admin: {
                condition: (_, siblingData) =>
                  ['video', 'podcast', 'show-pitch'].includes(siblingData?.submissionType),
              },
            },
            {
              name: 'seasonNumber',
              type: 'number',
              admin: {
                condition: (_, siblingData) =>
                  ['video', 'podcast', 'show-pitch'].includes(siblingData?.submissionType),
              },
            },
            {
              name: 'episodeNumber',
              type: 'number',
              admin: {
                condition: (_, siblingData) =>
                  ['video', 'podcast', 'show-pitch'].includes(siblingData?.submissionType),
              },
            },
            {
              name: 'duration',
              type: 'text',
              admin: {
                description: 'Example: 00:24:35.',
                condition: (_, siblingData) =>
                  ['video', 'podcast'].includes(siblingData?.submissionType),
              },
            },
            {
              name: 'articlePitch',
              type: 'textarea',
              admin: {
                condition: (_, siblingData) => siblingData?.submissionType === 'article',
              },
            },
            {
              name: 'sourceLinks',
              type: 'array',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Event / Sponsor',
          fields: [
            {
              name: 'eventInterest',
              type: 'relationship',
              relationTo: 'events',
              admin: {
                condition: (_, siblingData) =>
                  ['event-performance', 'sponsor-collab'].includes(siblingData?.submissionType),
              },
            },
            {
              name: 'performanceType',
              type: 'text',
              admin: {
                description: 'Example: DJ set, live performance, host, panelist.',
                condition: (_, siblingData) => siblingData?.submissionType === 'event-performance',
              },
            },
            {
              name: 'sponsorInterest',
              type: 'relationship',
              relationTo: 'sponsors',
              admin: {
                condition: (_, siblingData) => siblingData?.submissionType === 'sponsor-collab',
              },
            },
            {
              name: 'collaborationNotes',
              type: 'textarea',
              admin: {
                condition: (_, siblingData) =>
                  ['event-performance', 'sponsor-collab'].includes(siblingData?.submissionType),
              },
            },
          ],
        },
        {
          label: 'Assets',
          fields: [
            {
              name: 'primaryAsset',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'thumbnail',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'artwork',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'supportingFiles',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
            },
            {
              name: 'creatorAssets',
              type: 'relationship',
              relationTo: 'creator-assets',
              hasMany: true,
            },
          ],
        },
        {
          label: 'Rights & Safety',
          fields: [
            {
              name: 'rightsOwnershipConfirmed',
              type: 'checkbox',
              required: true,
              defaultValue: false,
            },
            {
              name: 'copyrightOwner',
              type: 'text',
            },
            {
              name: 'contentRating',
              type: 'select',
              defaultValue: 'general',
              options: [
                { label: 'General', value: 'general' },
                { label: 'Clean', value: 'clean' },
                { label: 'Explicit', value: 'explicit' },
                { label: 'Mature Themes', value: 'mature-themes' },
              ],
            },
            {
              name: 'contentWarnings',
              type: 'array',
              fields: [
                {
                  name: 'warning',
                  type: 'text',
                },
              ],
            },
            {
              name: 'releasePermission',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description:
                  'Creator grants WaveNation permission to review, store, and potentially publish this submission.',
              },
            },
          ],
        },
        {
          label: 'Review',
          fields: [
            {
              name: 'assignedReviewer',
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
              name: 'reviewNotes',
              type: 'textarea',
            },
            {
              name: 'approvalRecords',
              type: 'relationship',
              relationTo: 'creator-approvals',
              hasMany: true,
            },
          ],
        },
      ],
    },
  ],
}
