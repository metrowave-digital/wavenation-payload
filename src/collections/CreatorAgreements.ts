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

const staffOrSigner: Access = ({ req: { user } }) => {
  if (isStaffUser(user)) return true

  const userID = getUserID(user)

  if (!userID) return false

  return {
    user: {
      equals: userID,
    },
  }
}

export const CreatorAgreements: CollectionConfig = {
  slug: 'creator-agreements',
  labels: {
    singular: 'Creator Agreement',
    plural: 'Creator Agreements',
  },
  admin: {
    group: 'Creator Hub',
    useAsTitle: 'title',
    defaultColumns: ['title', 'agreementType', 'agreementStatus', 'creator', 'signedAt'],
    listSearchableFields: ['title', 'signerName', 'signerEmail', 'externalEnvelopeId'],
  },
  access: {
    create: staffOnly,
    read: staffOrSigner,
    update: staffOnly,
    delete: staffOnly,
  },
  timestamps: true,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Agreement',
          fields: [
            {
              name: 'title',
              type: 'text',
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
              name: 'user',
              type: 'relationship',
              relationTo: 'users',
              required: true,
              index: true,
              admin: {
                description: 'The user/signer connected to this agreement.',
              },
            },
            {
              name: 'agreementType',
              type: 'select',
              required: true,
              defaultValue: 'creator_terms',
              options: [
                { label: 'Creator Terms', value: 'creator_terms' },
                { label: 'Revenue Share', value: 'revenue_share' },
                { label: 'Content License', value: 'content_license' },
                { label: 'Event Performance Agreement', value: 'event_performance' },
                { label: 'Sponsorship Collaboration', value: 'sponsorship_collab' },
                { label: 'NDA', value: 'nda' },
                { label: 'Release Form', value: 'release_form' },
                { label: 'Third-Party Signing Packet', value: 'third_party_signing' },
              ],
            },
            {
              name: 'agreementStatus',
              type: 'select',
              required: true,
              defaultValue: 'draft',
              admin: {
                position: 'sidebar',
              },
              options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Sent', value: 'sent' },
                { label: 'Viewed', value: 'viewed' },
                { label: 'Signed', value: 'signed' },
                { label: 'Declined', value: 'declined' },
                { label: 'Expired', value: 'expired' },
                { label: 'Voided', value: 'voided' },
              ],
            },
            {
              name: 'version',
              type: 'text',
              defaultValue: 'v1',
            },
            {
              name: 'summary',
              type: 'textarea',
            },
          ],
        },
        {
          label: 'Signing',
          fields: [
            {
              name: 'externalSigningProvider',
              type: 'select',
              defaultValue: 'other',
              options: [
                { label: 'DocuSign', value: 'docusign' },
                { label: 'Dropbox Sign', value: 'dropbox_sign' },
                { label: 'Adobe Sign', value: 'adobe_sign' },
                { label: 'Jotform Sign', value: 'jotform_sign' },
                { label: 'PandaDoc', value: 'pandadoc' },
                { label: 'Other', value: 'other' },
              ],
            },
            {
              name: 'signingUrl',
              type: 'text',
            },
            {
              name: 'externalEnvelopeId',
              type: 'text',
            },
            {
              name: 'signerName',
              type: 'text',
            },
            {
              name: 'signerEmail',
              type: 'email',
            },
            {
              name: 'sentAt',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'signedAt',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'expiresAt',
              type: 'date',
            },
          ],
        },
        {
          label: 'Files',
          fields: [
            {
              name: 'agreementFile',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'signedFile',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'supportingFiles',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
            },
          ],
        },
        {
          label: 'Terms',
          fields: [
            {
              name: 'effectiveDate',
              type: 'date',
            },
            {
              name: 'terminationDate',
              type: 'date',
            },
            {
              name: 'revenueSharePercentage',
              type: 'number',
              min: 0,
              max: 100,
            },
            {
              name: 'territory',
              type: 'text',
              defaultValue: 'Worldwide',
            },
            {
              name: 'usageScope',
              type: 'array',
              fields: [
                {
                  name: 'scope',
                  type: 'select',
                  options: [
                    { label: 'Website', value: 'website' },
                    { label: 'Mobile App', value: 'mobile_app' },
                    { label: 'TV / OTT', value: 'tv_ott' },
                    { label: 'Radio', value: 'radio' },
                    { label: 'Social Media', value: 'social_media' },
                    { label: 'Events', value: 'events' },
                    { label: 'Advertising', value: 'advertising' },
                    { label: 'Sponsorship', value: 'sponsorship' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Admin',
          fields: [
            {
              name: 'managedBy',
              type: 'relationship',
              relationTo: 'users',
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
