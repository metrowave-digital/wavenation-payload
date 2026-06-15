import type { Access, CollectionConfig } from 'payload'

type PayloadUser = {
  role?: string | string[] | null
  roles?: string[] | null
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
  hasRole(user, ['admin', 'super-admin', 'editor', 'producer', 'events-manager', 'sales-manager'])

const staffOnly: Access = ({ req: { user } }) => isStaffUser(user)

const publicOrStaff: Access = ({ req: { user } }) => {
  if (isStaffUser(user)) return true

  return {
    isActive: {
      equals: true,
    },
    ticketStatus: {
      in: ['active', 'sold-out', 'waitlist'],
    },
  }
}

export const TicketLinks: CollectionConfig = {
  slug: 'ticket-links',
  labels: {
    singular: 'Ticket Link',
    plural: 'Ticket Links',
  },
  admin: {
    group: 'Events & Live Activations',
    useAsTitle: 'title',
    defaultColumns: ['title', 'event', 'ticketType', 'provider', 'ticketStatus', 'isPrimary'],
    listSearchableFields: ['title', 'provider', 'url'],
  },
  access: {
    create: staffOnly,
    read: publicOrStaff,
    update: staffOnly,
    delete: staffOnly,
  },
  timestamps: true,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Ticket',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'event',
              type: 'relationship',
              relationTo: 'events',
              required: true,
              index: true,
            },
            {
              name: 'ticketType',
              type: 'select',
              required: true,
              defaultValue: 'external',
              options: [
                { label: 'External Ticket Link', value: 'external' },
                { label: 'Internal Ticket / Product', value: 'internal' },
                { label: 'Free RSVP', value: 'free_rsvp' },
                { label: 'Pay-Per-View', value: 'ppv' },
                { label: 'Donation', value: 'donation' },
                { label: 'Season Pass', value: 'season_pass' },
                { label: 'Vendor Booth', value: 'vendor_booth' },
                { label: 'VIP Package', value: 'vip_package' },
              ],
            },
            {
              name: 'provider',
              type: 'select',
              defaultValue: 'custom',
              options: [
                { label: 'WaveNation', value: 'wavenation' },
                { label: 'Stripe', value: 'stripe' },
                { label: 'Eventbrite', value: 'eventbrite' },
                { label: 'Ticketmaster', value: 'ticketmaster' },
                { label: 'Dice', value: 'dice' },
                { label: 'Universe', value: 'universe' },
                { label: 'Jotform', value: 'jotform' },
                { label: 'Custom URL', value: 'custom' },
              ],
            },
            {
              name: 'url',
              type: 'text',
              admin: {
                description: 'External ticket, RSVP, donation, or checkout URL.',
              },
            },
            {
              name: 'ctaLabel',
              label: 'CTA Label',
              type: 'text',
              defaultValue: 'Get Tickets',
            },
            {
              name: 'ticketStatus',
              type: 'select',
              defaultValue: 'active',
              options: [
                { label: 'Active', value: 'active' },
                { label: 'Hidden', value: 'hidden' },
                { label: 'Sold Out', value: 'sold_out' },
                { label: 'Waitlist', value: 'waitlist' },
                { label: 'Expired', value: 'expired' },
              ],
            },
            {
              name: 'isPrimary',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                position: 'sidebar',
              },
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
          label: 'Pricing & Sales',
          fields: [
            {
              name: 'price',
              type: 'number',
              min: 0,
            },
            {
              name: 'currency',
              type: 'text',
              defaultValue: 'USD',
            },
            {
              name: 'feeDescription',
              type: 'text',
            },
            {
              name: 'capacity',
              type: 'number',
              min: 0,
            },
            {
              name: 'quantitySold',
              type: 'number',
              min: 0,
              defaultValue: 0,
            },
            {
              name: 'saleStartDate',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'saleEndDate',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'stripePriceId',
              type: 'text',
            },
            {
              name: 'stripeProductId',
              type: 'text',
            },
            {
              name: 'externalId',
              type: 'text',
              admin: {
                description: 'Provider-specific ticket, product, form, or event ID.',
              },
            },
          ],
        },
        {
          label: 'Admin',
          fields: [
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
