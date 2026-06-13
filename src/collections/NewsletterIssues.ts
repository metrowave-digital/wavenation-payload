// src/collections/NewsletterIssues.ts
import type { Block, CollectionConfig, FieldHook } from 'payload'

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

  const title = typeof data?.issueTitle === 'string' ? data.issueTitle : null
  const subject = typeof data?.subjectLine === 'string' ? data.subjectLine : null

  return title ? slugify(title) : subject ? slugify(subject) : value
}

/* ======================================================
   Newsletter Blocks
====================================================== */

const NewsletterTextBlock: Block = {
  slug: 'newsletterText',
  labels: {
    singular: 'Text Section',
    plural: 'Text Sections',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
    },
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
    },
  ],
}

const NewsletterArticleStackBlock: Block = {
  slug: 'newsletterArticleStack',
  labels: {
    singular: 'Article Stack',
    plural: 'Article Stacks',
  },
  fields: [
    {
      name: 'sectionLabel',
      type: 'text',
      defaultValue: 'Featured Stories',
    },
    {
      name: 'layout',
      type: 'select',
      enumName: 'nl_art_stack_layout',
      defaultValue: 'standard',
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Compact', value: 'compact' },
        { label: 'Featured', value: 'featured' },
      ],
    },
    {
      name: 'articles',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
      required: true,
      admin: {
        isSortable: true,
      },
    },
    {
      name: 'customIntro',
      type: 'textarea',
      admin: {
        description: 'Optional intro text shown before this group of articles.',
      },
    },
  ],
}

const NewsletterMediaBlock: Block = {
  slug: 'newsletterMedia',
  labels: {
    singular: 'Media Feature',
    plural: 'Media Features',
  },
  fields: [
    {
      name: 'image',
      type: 'relationship',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'headline',
      type: 'text',
    },
    {
      name: 'caption',
      type: 'textarea',
    },
    {
      name: 'linkUrl',
      type: 'text',
    },
    {
      name: 'linkLabel',
      type: 'text',
      defaultValue: 'View More',
    },
  ],
}

const NewsletterCTAButtonBlock: Block = {
  slug: 'newsletterCTA',
  labels: {
    singular: 'CTA',
    plural: 'CTAs',
  },
  fields: [
    {
      name: 'headline',
      type: 'text',
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
    },
    {
      name: 'buttonLabel',
      type: 'text',
      required: true,
    },
    {
      name: 'buttonUrl',
      type: 'text',
      required: true,
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'primary',
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Membership', value: 'membership' },
        { label: 'Creator Hub', value: 'creator-hub' },
      ],
    },
  ],
}

const NewsletterSponsorBlock: Block = {
  slug: 'newsletterSponsor',
  labels: {
    singular: 'Sponsor Placement',
    plural: 'Sponsor Placements',
  },
  fields: [
    {
      name: 'sponsor',
      type: 'relationship',
      relationTo: 'sponsors',
      required: true,
    },
    {
      name: 'label',
      type: 'text',
      defaultValue: 'Sponsored',
    },
    {
      name: 'headline',
      type: 'text',
    },
    {
      name: 'body',
      type: 'textarea',
    },
    {
      name: 'ctaLabel',
      type: 'text',
    },
    {
      name: 'ctaUrl',
      type: 'text',
    },
  ],
}

const NewsletterShowBlock: Block = {
  slug: 'newsletterShowFeature',
  labels: {
    singular: 'Show Feature',
    plural: 'Show Features',
  },
  fields: [
    {
      name: 'sectionLabel',
      type: 'text',
      defaultValue: 'On Air',
    },
    {
      name: 'shows',
      type: 'relationship',
      relationTo: 'radioShows',
      hasMany: true,
      admin: {
        isSortable: true,
      },
    },
    {
      name: 'podcasts',
      type: 'relationship',
      relationTo: 'podcasts',
      hasMany: true,
      admin: {
        isSortable: true,
      },
    },
    {
      name: 'vodItems',
      type: 'relationship',
      relationTo: 'vod',
      hasMany: true,
      admin: {
        isSortable: true,
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
}

/* ======================================================
   Collection Config
====================================================== */

export const NewsletterIssues: CollectionConfig = {
  slug: 'newsletter-issues',
  labels: {
    singular: 'Newsletter Issue',
    plural: 'Newsletter Issues',
  },
  admin: {
    useAsTitle: 'issueTitle',
    defaultColumns: ['issueTitle', 'newsletter', 'status', 'scheduledSendAt', 'sentAt'],
    group: 'Audience & Growth',
    description:
      'Individual newsletter editions that can be drafted, scheduled, sent, archived, and analyzed.',
  },
  timestamps: true,
  versions: {
    drafts: true,
    maxPerDoc: 50,
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true

      return {
        status: {
          equals: 'sent',
        },
        showInArchive: {
          equals: true,
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
          label: 'Issue',
          fields: [
            {
              name: 'newsletter',
              type: 'relationship',
              relationTo: 'newsletters',
              required: true,
              admin: {
                description: 'The newsletter product this issue belongs to.',
              },
            },
            {
              name: 'issueTitle',
              type: 'text',
              required: true,
              admin: {
                description: 'Internal/editorial title. Example: The Pulse — June 12 Edition.',
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
            },
            {
              name: 'issueDate',
              type: 'date',
              admin: {
                description: 'Public issue date, separate from the scheduled send time.',
              },
            },
            {
              name: 'subjectLine',
              type: 'text',
              required: true,
              maxLength: 120,
            },
            {
              name: 'previewText',
              type: 'textarea',
              maxLength: 180,
              admin: {
                description: 'Inbox preview text. Keep this short and compelling.',
              },
            },
            {
              name: 'editorNote',
              type: 'textarea',
              admin: {
                description: 'Optional opening note from WaveNation editorial.',
              },
            },
          ],
        },
        {
          label: 'Content',
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
                  name: 'headline',
                  type: 'text',
                },
                {
                  name: 'dek',
                  type: 'textarea',
                },
                {
                  name: 'linkUrl',
                  type: 'text',
                },
                {
                  name: 'linkLabel',
                  type: 'text',
                  defaultValue: 'Read More',
                },
              ],
            },
            {
              name: 'featuredArticle',
              type: 'relationship',
              relationTo: 'articles',
              admin: {
                description: 'Primary story for the issue.',
              },
            },
            {
              name: 'contentBlocks',
              type: 'blocks',
              blocks: [
                NewsletterTextBlock,
                NewsletterArticleStackBlock,
                NewsletterMediaBlock,
                NewsletterCTAButtonBlock,
                NewsletterSponsorBlock,
                NewsletterShowBlock,
              ],
            },
            {
              name: 'featuredPlaylists',
              type: 'relationship',
              relationTo: 'playlists',
              hasMany: true,
              admin: {
                isSortable: true,
              },
            },
          ],
        },
        {
          label: 'Audience & Targeting',
          fields: [
            {
              name: 'targetCategories',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
            },
            {
              name: 'targetTopics',
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
              name: 'targetTags',
              type: 'relationship',
              relationTo: 'tags',
              hasMany: true,
            },
            {
              name: 'subscriberSegment',
              type: 'select',
              defaultValue: 'all-active',
              options: [
                { label: 'All Active Subscribers', value: 'all-active' },
                { label: 'Music Fans', value: 'music-fans' },
                { label: 'Creators', value: 'creators' },
                { label: 'Faith Audience', value: 'faith' },
                { label: 'WaveNation+ Members', value: 'members' },
                { label: 'Partners / Sponsors', value: 'partners' },
                { label: 'Custom Segment', value: 'custom' },
              ],
            },
            {
              name: 'customSegmentId',
              type: 'text',
              admin: {
                condition: (_, siblingData) => siblingData?.subscriberSegment === 'custom',
                description: 'External segment ID from your email provider.',
              },
            },
          ],
        },
        {
          label: 'Sending',
          fields: [
            {
              name: 'scheduledSendAt',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'sentAt',
              type: 'date',
              admin: {
                readOnly: true,
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'fromNameOverride',
              type: 'text',
              admin: {
                description: 'Optional. If empty, use the newsletter default from name.',
              },
            },
            {
              name: 'fromEmailOverride',
              type: 'email',
              admin: {
                description: 'Optional. If empty, use the newsletter default from email.',
              },
            },
            {
              name: 'replyToOverride',
              type: 'email',
            },
            {
              name: 'providerCampaignId',
              type: 'text',
              admin: {
                readOnly: true,
                description: 'External campaign/message ID returned by the email provider.',
              },
            },
            {
              name: 'emailHtml',
              type: 'textarea',
              admin: {
                readOnly: true,
                description:
                  'Generated email HTML. Your send route or email builder can populate this.',
              },
            },
            {
              name: 'emailText',
              type: 'textarea',
              admin: {
                readOnly: true,
                description: 'Plain-text version for accessibility and deliverability.',
              },
            },
          ],
        },
        {
          label: 'Analytics',
          fields: [
            {
              name: 'analytics',
              type: 'group',
              fields: [
                {
                  name: 'recipientCount',
                  type: 'number',
                  defaultValue: 0,
                  admin: {
                    readOnly: true,
                  },
                },
                {
                  name: 'openCount',
                  type: 'number',
                  defaultValue: 0,
                  admin: {
                    readOnly: true,
                  },
                },
                {
                  name: 'clickCount',
                  type: 'number',
                  defaultValue: 0,
                  admin: {
                    readOnly: true,
                  },
                },
                {
                  name: 'unsubscribeCount',
                  type: 'number',
                  defaultValue: 0,
                  admin: {
                    readOnly: true,
                  },
                },
                {
                  name: 'bounceCount',
                  type: 'number',
                  defaultValue: 0,
                  admin: {
                    readOnly: true,
                  },
                },
                {
                  name: 'complaintCount',
                  type: 'number',
                  defaultValue: 0,
                  admin: {
                    readOnly: true,
                  },
                },
              ],
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
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Ready for Review', value: 'ready-review' },
        { label: 'Approved', value: 'approved' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Sent', value: 'sent' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'showInArchive',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'If true, this sent issue can appear on public newsletter archive pages.',
      },
    },
    {
      name: 'isSponsored',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sponsor',
      type: 'relationship',
      relationTo: 'sponsors',
      admin: {
        position: 'sidebar',
        condition: (_, siblingData) => Boolean(siblingData?.isSponsored),
      },
    },
  ],
}

export default NewsletterIssues
