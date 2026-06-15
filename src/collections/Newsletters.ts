// src/collections/Newsletters.ts
import type { CollectionConfig, FieldHook } from 'payload'

/* ======================================================
   Slug Helper
====================================================== */

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120)
}

const autoSlug: FieldHook = ({ value, data, originalDoc, operation }) => {
  if (typeof value === 'string' && value.trim()) return value

  if (operation === 'update' && originalDoc?.slug) {
    return originalDoc.slug
  }

  const title = typeof data?.title === 'string' ? data.title : null
  return title ? slugify(title) : value
}

/* ======================================================
   Collection Config
====================================================== */

export const Newsletters: CollectionConfig = {
  slug: 'newsletters',
  labels: {
    singular: 'Newsletter',
    plural: 'Newsletters',
  },
  graphQL: {
    singularName: 'Newsletter',
    pluralName: 'Newsletters',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'newsletterType', 'frequency', 'status', 'featured'],
    group: 'Audience & Growth',
    description: 'Newsletter products and signup experiences for WaveNation Media.',
  },
  timestamps: true,
  versions: {
    drafts: false,
    maxPerDoc: 25,
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true

      return {
        status: {
          equals: 'active',
        },
      }
    },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Newsletter',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              unique: true,
              admin: {
                description:
                  'Public newsletter name. Example: The Pulse, FM Weekly, Creator Hub Dispatch.',
              },
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              hooks: {
                beforeValidate: [autoSlug],
              },
              admin: {
                description: 'Auto-generated from the title. Edit only if needed.',
              },
            },
            {
              name: 'shortTitle',
              type: 'text',
              maxLength: 40,
              admin: {
                description:
                  'Optional shorter label for cards, footer signup boxes, and mobile UI.',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              maxLength: 700,
              admin: {
                description:
                  'Public-facing description used on newsletter detail pages and signup cards.',
              },
            },
            {
              name: 'newsletterType',
              type: 'select',
              required: true,
              defaultValue: 'editorial_digest',
              options: [
                { label: 'Editorial Digest', value: 'editorial_digest' },
                { label: 'Breaking Alerts', value: 'breaking_alerts' },
                { label: 'Music & Radio', value: 'music_radio' },
                { label: 'Creator Hub', value: 'creator_hub' },
                { label: 'Faith & Inspiration', value: 'faith_inspiration' },
                { label: 'Culture Report', value: 'culture_report' },
                { label: 'Events & Promotions', value: 'events_promotions' },
                { label: 'Member / WaveNation+', value: 'membership' },
                { label: 'Sponsor / Partner', value: 'sponsor_partner' },
              ],
            },
            {
              name: 'frequency',
              type: 'select',
              required: true,
              defaultValue: 'weekly',
              options: [
                { label: 'Daily', value: 'daily' },
                { label: 'Weekdays', value: 'weekdays' },
                { label: 'Weekly', value: 'weekly' },
                { label: 'Biweekly', value: 'biweekly' },
                { label: 'Monthly', value: 'monthly' },
                { label: 'Quarterly', value: 'quarterly' },
                { label: 'As Needed', value: 'as_needed' },
              ],
            },
            {
              name: 'sendCadenceNote',
              type: 'text',
              admin: {
                description: 'Human-readable schedule. Example: Fridays at 9 a.m. ET.',
              },
            },
            {
              name: 'audience',
              type: 'select',
              defaultValue: 'general',
              options: [
                { label: 'General Audience', value: 'general' },
                { label: 'Music Fans', value: 'music_fans' },
                { label: 'Creators', value: 'creators' },
                { label: 'Faith Audience', value: 'faith' },
                { label: 'WaveNation+ Members', value: 'members' },
                { label: 'Advertisers / Partners', value: 'partners' },
                { label: 'Local Community', value: 'local_community' },
              ],
            },
          ],
        },
        {
          label: 'Signup Experience',
          fields: [
            {
              name: 'signupHeadline',
              type: 'text',
              required: true,
              defaultValue: 'Get the WaveNation signal in your inbox.',
            },
            {
              name: 'signupDescription',
              type: 'textarea',
              maxLength: 400,
            },
            {
              name: 'signupButtonLabel',
              type: 'text',
              defaultValue: 'Subscribe',
            },
            {
              name: 'successMessage',
              type: 'textarea',
              defaultValue: 'You are subscribed. Check your inbox for the next WaveNation update.',
            },
            {
              name: 'privacyNote',
              type: 'textarea',
              defaultValue:
                'By subscribing, you agree to receive emails from WaveNation Media. You can unsubscribe at any time.',
            },
            {
              name: 'placements',
              type: 'group',
              fields: [
                {
                  name: 'showOnNewsletterIndex',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'showInFooterSignup',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'showInArticleSignup',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'showInCreatorHub',
                  type: 'checkbox',
                  defaultValue: false,
                },
                {
                  name: 'showInMemberArea',
                  type: 'checkbox',
                  defaultValue: false,
                },
              ],
            },
          ],
        },
        {
          label: 'Taxonomy & Targeting',
          fields: [
            {
              name: 'relatedCategories',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
              admin: {
                description: 'Used to match newsletter signup boxes to article categories.',
              },
            },
            {
              name: 'relatedSubcategories',
              type: 'relationship',
              relationTo: 'subcategories',
              hasMany: true,
            },
            {
              name: 'relatedTopics',
              type: 'relationship',
              relationTo: 'topics',
              hasMany: true,
              admin: {
                description:
                  'Used to target newsletters by topics like R&B, Southern Soul, Creator Economy, Faith, or HBCU Culture.',
              },
              filterOptions: {
                status: {
                  equals: 'active',
                },
              },
            },
            {
              name: 'relatedTags',
              type: 'relationship',
              relationTo: 'tags',
              hasMany: true,
            },
          ],
        },
        {
          label: 'Branding',
          fields: [
            {
              name: 'hero',
              type: 'group',
              fields: [
                {
                  name: 'image',
                  type: 'relationship',
                  relationTo: 'media',
                },
                {
                  name: 'caption',
                  type: 'textarea',
                },
                {
                  name: 'credit',
                  type: 'text',
                },
              ],
            },
            {
              name: 'accentColor',
              type: 'select',
              defaultValue: 'electric_blue',
              options: [
                { label: 'Electric Blue', value: 'electric_blue' },
                { label: 'Neon Green', value: 'neon_green' },
                { label: 'Magenta Pulse', value: 'magenta_pulse' },
                { label: 'Signal Teal', value: 'signal_teal' },
                { label: 'Deep Indigo', value: 'deep_indigo' },
                { label: 'Charcoal', value: 'charcoal' },
              ],
            },
            {
              name: 'displayStyle',
              type: 'select',
              defaultValue: 'cinematic',
              options: [
                { label: 'Cinematic', value: 'cinematic' },
                { label: 'Editorial', value: 'editorial' },
                { label: 'Music / FM', value: 'music' },
                { label: 'Creator Hub', value: 'creator_hub' },
                { label: 'Faith', value: 'faith' },
                { label: 'Minimal', value: 'minimal' },
              ],
            },
          ],
        },
        {
          label: 'Email Provider',
          fields: [
            {
              name: 'provider',
              type: 'select',
              defaultValue: 'manual',
              options: [
                { label: 'Manual / Internal', value: 'manual' },
                { label: 'Resend', value: 'resend' },
                { label: 'Mailchimp', value: 'mailchimp' },
                { label: 'Beehiiv', value: 'beehiiv' },
                { label: 'ConvertKit', value: 'convertkit' },
                { label: 'Buttondown', value: 'buttondown' },
              ],
            },
            {
              name: 'providerListId',
              type: 'text',
              admin: {
                description: 'External audience/list ID from your email provider.',
              },
            },
            {
              name: 'providerSegmentId',
              type: 'text',
              admin: {
                description: 'Optional external segment ID from your email provider.',
              },
            },
            {
              name: 'defaultFromName',
              type: 'text',
              defaultValue: 'WaveNation Media',
            },
            {
              name: 'defaultFromEmail',
              type: 'email',
            },
            {
              name: 'defaultReplyToEmail',
              type: 'email',
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seoTitle',
              type: 'text',
              maxLength: 70,
            },
            {
              name: 'seoDescription',
              type: 'textarea',
              maxLength: 160,
            },
            {
              name: 'socialImage',
              type: 'relationship',
              relationTo: 'media',
            },
          ],
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Paused', value: 'paused' },
        { label: 'Hidden', value: 'hidden' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 100,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first.',
      },
    },
  ],
}

export default Newsletters
