import type { Access, CollectionConfig, Field } from 'payload'

type UserLike = {
  id?: string | number
  role?: string
  roles?: string[]
}

export const WAVENATION_STAFF_ROLES = [
  'admin',
  'editor',
  'sales',
  'legal',
  'moderator',
  'creator-manager',
] as const

export const hasUserRole = (user: unknown, allowedRoles: string[]) => {
  const currentUser = user as UserLike | null | undefined

  if (!currentUser) return false

  const singleRole = currentUser.role
  const roleList = Array.isArray(currentUser.roles) ? currentUser.roles : []

  return (
    singleRole === 'admin' ||
    roleList.includes('admin') ||
    allowedRoles.includes(singleRole || '') ||
    roleList.some((role) => allowedRoles.includes(role))
  )
}

export const anyone: Access = () => true

export const authenticated: Access = ({ req }) => Boolean(req.user)

export const hasAnyRole =
  (roles: string[]): Access =>
  ({ req }) =>
    hasUserRole(req.user, roles)

export const staffOnly = hasAnyRole([...WAVENATION_STAFF_ROLES])

export const adminOnly = hasAnyRole(['admin'])

export const legalOnly = hasAnyRole(['admin', 'legal'])

export const salesOnly = hasAnyRole(['admin', 'sales'])

export const moderationOnly = hasAnyRole(['admin', 'moderator', 'editor', 'legal'])

export const publishedOrStaff =
  (roles: string[] = [...WAVENATION_STAFF_ROLES]): Access =>
  ({ req }) => {
    if (hasUserRole(req.user, roles)) return true

    return {
      status: {
        equals: 'published',
      },
    }
  }

export const auditHooks: NonNullable<CollectionConfig['hooks']> = {
  beforeChange: [
    ({ data, req, operation }) => {
      const user = req.user as UserLike | null | undefined

      if (user?.id) {
        if (operation === 'create' && !data.createdBy) {
          data.createdBy = user.id
        }

        data.updatedBy = user.id
      }

      return data
    },
  ],
}

export const standardSystemFields: Field[] = [
  {
    name: 'status',
    type: 'select',
    defaultValue: 'draft',
    options: [
      { label: 'Draft', value: 'draft' },
      { label: 'In Review', value: 'in_review' },
      { label: 'Active', value: 'active' },
      { label: 'Published', value: 'published' },
      { label: 'Paused', value: 'paused' },
      { label: 'Archived', value: 'archived' },
    ],
    admin: {
      position: 'sidebar',
    },
  },
  {
    name: 'publishedAt',
    type: 'date',
    admin: {
      position: 'sidebar',
      date: {
        pickerAppearance: 'dayAndTime',
      },
    },
  },
  {
    name: 'archivedAt',
    type: 'date',
    admin: {
      position: 'sidebar',
      date: {
        pickerAppearance: 'dayAndTime',
      },
    },
  },
  {
    name: 'internalNotes',
    type: 'textarea',
    admin: {
      position: 'sidebar',
      rows: 5,
    },
  },
  {
    name: 'createdBy',
    type: 'relationship',
    relationTo: 'users',
    admin: {
      position: 'sidebar',
      readOnly: true,
    },
  },
  {
    name: 'updatedBy',
    type: 'relationship',
    relationTo: 'users',
    admin: {
      position: 'sidebar',
      readOnly: true,
    },
  },
]

export const contentRelationshipCollections = [
  'articles',
  'media',
  'events',
  'event-categories',
  'venues',
  'event-recaps',
  'playlists',
  'tracks',
  'podcasts',
  'radioShows',
  'tvShows',
  'vod',
  'creators',
  'creator-profiles',
  'creator-submissions',
  'creator-assets',
  'promo-banners',
  'sponsor-campaigns',
  'ad-placements',
  'offer-campaigns',
  'comments',
] as const
