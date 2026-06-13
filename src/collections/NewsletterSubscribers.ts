// src/collections/NewsletterSubscribers.ts
import { randomUUID } from 'crypto'
import type { CollectionBeforeChangeHook, CollectionConfig, FieldHook } from 'payload'

/* ======================================================
   Helpers
====================================================== */

const normalizeEmail: FieldHook = ({ value }) => {
  if (typeof value !== 'string') return value
  return value.trim().toLowerCase()
}

const ensureUnsubscribeToken: FieldHook = ({ value }) => {
  if (typeof value === 'string' && value.trim()) return value
  return randomUUID()
}

const setConsentTimestamp: CollectionBeforeChangeHook = ({ data, operation }) => {
  if (operation === 'create') {
    if (!data.consent) data.consent = {}

    if (!data.consent.consentTimestamp) {
      data.consent.consentTimestamp = new Date().toISOString()
    }
  }

  return data
}

/* ======================================================
   Collection Config
====================================================== */

export const NewsletterSubscribers: CollectionConfig = {
  slug: 'newsletter-subscribers',
  labels: {
    singular: 'Newsletter Subscriber',
    plural: 'Newsletter Subscribers',
  },
  hooks: {
    beforeChange: [setConsentTimestamp],
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'status', 'subscribedNewsletters', 'source', 'createdAt'],
    group: 'Audience & Growth',
    description:
      'Email subscribers and preference data. Public signup can create records, but only authenticated users can read or manage them.',
  },
  timestamps: true,
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Subscriber',
          fields: [
            {
              name: 'email',
              type: 'email',
              required: true,
              unique: true,
              hooks: {
                beforeValidate: [normalizeEmail],
              },
            },
            {
              name: 'firstName',
              type: 'text',
            },
            {
              name: 'lastName',
              type: 'text',
            },
            {
              name: 'subscribedNewsletters',
              type: 'relationship',
              relationTo: 'newsletters',
              hasMany: true,
              required: true,
              admin: {
                description: 'Newsletter products this subscriber has opted into.',
              },
            },
            {
              name: 'preferences',
              type: 'group',
              fields: [
                {
                  name: 'preferredFrequency',
                  type: 'select',
                  defaultValue: 'normal',
                  options: [
                    { label: 'Normal', value: 'normal' },
                    { label: 'Weekly Only', value: 'weekly-only' },
                    { label: 'Breaking Alerts Only', value: 'breaking-alerts-only' },
                    { label: 'Monthly Digest Only', value: 'monthly-only' },
                  ],
                },
                {
                  name: 'interests',
                  type: 'relationship',
                  relationTo: 'topics',
                  hasMany: true,
                  filterOptions: {
                    status: {
                      equals: 'active',
                    },
                  },
                },
                {
                  name: 'favoriteCategories',
                  type: 'relationship',
                  relationTo: 'categories',
                  hasMany: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Consent & Compliance',
          fields: [
            {
              name: 'consent',
              type: 'group',
              fields: [
                {
                  name: 'hasConsented',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Set true when the user submits a newsletter signup form.',
                  },
                },
                {
                  name: 'consentTimestamp',
                  type: 'date',
                  admin: {
                    readOnly: true,
                    date: {
                      pickerAppearance: 'dayAndTime',
                    },
                  },
                },
                {
                  name: 'consentSourceUrl',
                  type: 'text',
                  admin: {
                    description: 'Page URL where the subscriber signed up.',
                  },
                },
                {
                  name: 'consentIp',
                  type: 'text',
                  admin: {
                    readOnly: true,
                    description: 'Optional. Populate from your API route if needed.',
                  },
                },
                {
                  name: 'consentUserAgent',
                  type: 'textarea',
                  admin: {
                    readOnly: true,
                    description: 'Optional. Populate from your API route if needed.',
                  },
                },
              ],
            },
            {
              name: 'unsubscribeToken',
              type: 'text',
              unique: true,
              hooks: {
                beforeValidate: [ensureUnsubscribeToken],
              },
              admin: {
                readOnly: true,
                description: 'Used for secure unsubscribe/preference links.',
              },
            },
            {
              name: 'unsubscribedAt',
              type: 'date',
              admin: {
                readOnly: true,
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'unsubscribeReason',
              type: 'textarea',
            },
          ],
        },
        {
          label: 'Acquisition',
          fields: [
            {
              name: 'source',
              type: 'select',
              defaultValue: 'website',
              options: [
                { label: 'Website', value: 'website' },
                { label: 'Article Signup', value: 'article-signup' },
                { label: 'Footer Signup', value: 'footer-signup' },
                { label: 'Newsletter Page', value: 'newsletter-page' },
                { label: 'Creator Hub', value: 'creator-hub' },
                { label: 'Event', value: 'event' },
                { label: 'Manual Import', value: 'manual-import' },
                { label: 'Partner Campaign', value: 'partner-campaign' },
                { label: 'WaveNation+ Signup', value: 'membership-signup' },
              ],
            },
            {
              name: 'referrer',
              type: 'text',
              admin: {
                description:
                  'Optional source label, UTM source, partner name, or campaign referrer.',
              },
            },
            {
              name: 'utm',
              type: 'group',
              fields: [
                {
                  name: 'source',
                  type: 'text',
                },
                {
                  name: 'medium',
                  type: 'text',
                },
                {
                  name: 'campaign',
                  type: 'text',
                },
                {
                  name: 'term',
                  type: 'text',
                },
                {
                  name: 'content',
                  type: 'text',
                },
              ],
            },
          ],
        },
        {
          label: 'Provider Sync',
          fields: [
            {
              name: 'provider',
              type: 'select',
              defaultValue: 'internal',
              options: [
                { label: 'Internal', value: 'internal' },
                { label: 'Resend', value: 'resend' },
                { label: 'Mailchimp', value: 'mailchimp' },
                { label: 'Beehiiv', value: 'beehiiv' },
                { label: 'ConvertKit', value: 'convertkit' },
                { label: 'Buttondown', value: 'buttondown' },
              ],
            },
            {
              name: 'providerSubscriberId',
              type: 'text',
              admin: {
                description: 'External subscriber/contact ID from the email provider.',
              },
            },
            {
              name: 'providerStatus',
              type: 'text',
              admin: {
                readOnly: true,
              },
            },
            {
              name: 'lastSyncedAt',
              type: 'date',
              admin: {
                readOnly: true,
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'syncNotes',
              type: 'textarea',
              admin: {
                readOnly: true,
              },
            },
          ],
        },
      ],
    },

    /* ===============================
       Sidebar Fields
    =============================== */

    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Pending Confirmation', value: 'pending-confirmation' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
        { label: 'Bounced', value: 'bounced' },
        { label: 'Complained', value: 'complained' },
        { label: 'Suppressed', value: 'suppressed' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isTestSubscriber',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}

export default NewsletterSubscribers
