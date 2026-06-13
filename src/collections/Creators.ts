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

const staffOnly: Access = ({ req: { user } }) => isStaffUser(user)

const staffOrOwner: Access = ({ req: { user } }) => {
  if (isStaffUser(user)) return true

  const userID = getUserID(user)

  if (!userID) return false

  return {
    user: {
      equals: userID,
    },
  }
}

export const Creators: CollectionConfig = {
  slug: 'creators',
  labels: {
    singular: 'Creator',
    plural: 'Creators',
  },
  admin: {
    group: 'Creator Hub',
    useAsTitle: 'displayName',
    defaultColumns: [
      'displayName',
      'creatorType',
      'creatorStatus',
      'verificationStatus',
      'isActive',
    ],
    listSearchableFields: ['displayName', 'legalName', 'email', 'city', 'state'],
  },
  access: {
    create: staffOnly,
    read: staffOrOwner,
    update: staffOnly,
    delete: staffOnly,
  },
  timestamps: true,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Creator',
          fields: [
            {
              name: 'displayName',
              type: 'text',
              required: true,
              index: true,
            },
            {
              name: 'legalName',
              type: 'text',
            },
            {
              name: 'user',
              type: 'relationship',
              relationTo: 'users',
              required: true,
              unique: true,
              index: true,
            },
            {
              name: 'email',
              type: 'email',
              required: true,
              index: true,
            },
            {
              name: 'creatorType',
              type: 'select',
              required: true,
              defaultValue: 'artist',
              options: [
                { label: 'Artist', value: 'artist' },
                { label: 'Podcaster', value: 'podcaster' },
                { label: 'Filmmaker / Videographer', value: 'filmmaker' },
                { label: 'DJ', value: 'dj' },
                { label: 'Influencer', value: 'influencer' },
                { label: 'Journalist / Writer', value: 'journalist' },
                { label: 'Producer', value: 'producer' },
                { label: 'Community Voice', value: 'community-voice' },
                { label: 'Host / Personality', value: 'host-personality' },
                { label: 'Other', value: 'other' },
              ],
            },
            {
              name: 'creatorStatus',
              type: 'select',
              required: true,
              defaultValue: 'applicant',
              admin: {
                position: 'sidebar',
              },
              options: [
                { label: 'Applicant', value: 'applicant' },
                { label: 'Onboarding', value: 'onboarding' },
                { label: 'Active', value: 'active' },
                { label: 'Paused', value: 'paused' },
                { label: 'Suspended', value: 'suspended' },
                { label: 'Rejected', value: 'rejected' },
                { label: 'Alumni', value: 'alumni' },
              ],
            },
            {
              name: 'verificationStatus',
              type: 'select',
              defaultValue: 'unverified',
              admin: {
                position: 'sidebar',
              },
              options: [
                { label: 'Unverified', value: 'unverified' },
                { label: 'Pending Review', value: 'pending-review' },
                { label: 'Verified', value: 'verified' },
                { label: 'Denied', value: 'denied' },
              ],
            },
            {
              name: 'isActive',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                position: 'sidebar',
              },
            },
          ],
        },
        {
          label: 'Profile Basics',
          fields: [
            {
              name: 'profile',
              type: 'relationship',
              relationTo: 'creator-profiles',
              admin: {
                description: 'Optional public-facing creator profile record.',
              },
            },
            {
              name: 'bio',
              type: 'textarea',
            },
            {
              name: 'primaryGenre',
              type: 'text',
            },
            {
              name: 'secondaryGenres',
              type: 'array',
              fields: [
                {
                  name: 'genre',
                  type: 'text',
                },
              ],
            },
            {
              name: 'city',
              type: 'text',
            },
            {
              name: 'state',
              type: 'text',
            },
            {
              name: 'country',
              type: 'text',
              defaultValue: 'United States',
            },
            {
              name: 'website',
              type: 'text',
            },
            {
              name: 'socialLinks',
              type: 'array',
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  options: [
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'TikTok', value: 'tiktok' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'X', value: 'x' },
                    { label: 'Spotify', value: 'spotify' },
                    { label: 'Apple Music', value: 'apple-music' },
                    { label: 'SoundCloud', value: 'soundcloud' },
                    { label: 'Website', value: 'website' },
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
          label: 'Media',
          fields: [
            {
              name: 'avatar',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'headshot',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'pressKit',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          label: 'Monetization',
          fields: [
            {
              name: 'monetizationEligible',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'monetizationStatus',
              type: 'select',
              defaultValue: 'not-enabled',
              options: [
                { label: 'Not Enabled', value: 'not-enabled' },
                { label: 'Pending', value: 'pending' },
                { label: 'Enabled', value: 'enabled' },
                { label: 'Paused', value: 'paused' },
              ],
            },
            {
              name: 'revenueSharePercentage',
              type: 'number',
              min: 0,
              max: 100,
            },
            {
              name: 'payoutProvider',
              type: 'select',
              options: [
                { label: 'Stripe', value: 'stripe' },
                { label: 'PayPal', value: 'paypal' },
                { label: 'Manual', value: 'manual' },
                { label: 'Other', value: 'other' },
              ],
            },
            {
              name: 'payoutEmail',
              type: 'email',
            },
          ],
        },
        {
          label: 'Relations',
          fields: [
            {
              name: 'agreements',
              type: 'relationship',
              relationTo: 'creator-agreements',
              hasMany: true,
            },
            {
              name: 'sponsors',
              type: 'relationship',
              relationTo: 'sponsors',
              hasMany: true,
            },
            {
              name: 'featuredEvents',
              type: 'relationship',
              relationTo: 'events',
              hasMany: true,
            },
          ],
        },
        {
          label: 'Admin',
          fields: [
            {
              name: 'assignedManager',
              type: 'relationship',
              relationTo: 'users',
            },
            {
              name: 'onboardingNotes',
              type: 'textarea',
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
