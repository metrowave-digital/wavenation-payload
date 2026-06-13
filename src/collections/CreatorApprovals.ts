import type { Access, CollectionConfig, Where } from 'payload'

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

const staffOrAssigned: Access = ({ req: { user } }) => {
  if (isStaffUser(user)) return true

  const userID = getUserID(user)

  if (!userID) return false

  const where: Where = {
    or: [
      {
        requestedBy: {
          equals: userID,
        },
      },
      {
        assignedTo: {
          equals: userID,
        },
      },
    ],
  }

  return where
}

export const CreatorApprovals: CollectionConfig = {
  slug: 'creator-approvals',
  labels: {
    singular: 'Creator Approval',
    plural: 'Creator Approvals',
  },
  admin: {
    group: 'Creator Hub',
    useAsTitle: 'title',
    defaultColumns: ['title', 'approvalType', 'approvalStatus', 'assignedTo', 'dueDate'],
    listSearchableFields: ['title', 'decisionNotes', 'reviewNotes'],
  },
  access: {
    create: staffOnly,
    read: staffOrAssigned,
    update: staffOnly,
    delete: staffOnly,
  },
  timestamps: true,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Approval',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              index: true,
            },
            {
              name: 'approvalType',
              type: 'select',
              required: true,
              defaultValue: 'content-review',
              options: [
                { label: 'Content Review', value: 'content-review' },
                { label: 'Brand Review', value: 'brand-review' },
                { label: 'Legal / Rights Review', value: 'legal-rights-review' },
                { label: 'Playlist Placement', value: 'playlist-placement' },
                { label: 'Event Booking', value: 'event-booking' },
                { label: 'Sponsor Collaboration', value: 'sponsor-collab' },
                { label: 'Profile Verification', value: 'profile-verification' },
                { label: 'Monetization Approval', value: 'monetization-approval' },
              ],
            },
            {
              name: 'approvalStatus',
              type: 'select',
              required: true,
              defaultValue: 'pending',
              admin: {
                position: 'sidebar',
              },
              options: [
                { label: 'Pending', value: 'pending' },
                { label: 'In Review', value: 'in-review' },
                { label: 'Approved', value: 'approved' },
                { label: 'Rejected', value: 'rejected' },
                { label: 'Changes Requested', value: 'changes-requested' },
                { label: 'Escalated', value: 'escalated' },
                { label: 'Closed', value: 'closed' },
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
            {
              name: 'requestedBy',
              type: 'relationship',
              relationTo: 'users',
              required: true,
            },
            {
              name: 'assignedTo',
              type: 'relationship',
              relationTo: 'users',
            },
            {
              name: 'dueDate',
              type: 'date',
            },
            {
              name: 'completedAt',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
          ],
        },
        {
          label: 'Relations',
          fields: [
            {
              name: 'creator',
              type: 'relationship',
              relationTo: 'creators',
            },
            {
              name: 'submission',
              type: 'relationship',
              relationTo: 'creator-submissions',
            },
            {
              name: 'asset',
              type: 'relationship',
              relationTo: 'creator-assets',
            },
            {
              name: 'event',
              type: 'relationship',
              relationTo: 'events',
            },
            {
              name: 'eventRecap',
              type: 'relationship',
              relationTo: 'event-recaps',
            },
            {
              name: 'sponsor',
              type: 'relationship',
              relationTo: 'sponsors',
            },
          ],
        },
        {
          label: 'Checklist',
          fields: [
            {
              name: 'rightsVerified',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'metadataVerified',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'brandSafe',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'editorialApproved',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'technicalQualityApproved',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'sponsorSafe',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'legalReviewRequired',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
        {
          label: 'Decision',
          fields: [
            {
              name: 'reviewNotes',
              type: 'textarea',
            },
            {
              name: 'decisionNotes',
              type: 'textarea',
            },
            {
              name: 'changesRequested',
              type: 'textarea',
            },
            {
              name: 'approvedBy',
              type: 'relationship',
              relationTo: 'users',
            },
            {
              name: 'approvalDate',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
          ],
        },
      ],
    },
  ],
}
