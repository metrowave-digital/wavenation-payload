import type { CollectionConfig } from 'payload'
import { auditHooks, salesOnly, staffOnly, standardSystemFields } from './_shared'

export const SponsorCampaigns: CollectionConfig = {
  slug: 'sponsor-campaigns',
  labels: {
    singular: 'Sponsor Campaign',
    plural: 'Sponsor Campaigns',
  },
  admin: {
    group: 'Advertising & Sponsorships',
    useAsTitle: 'name',
    defaultColumns: ['name', 'sponsor', 'campaignType', 'billingStatus', 'status'],
  },
  access: {
    create: salesOnly,
    read: staffOnly,
    update: salesOnly,
    delete: salesOnly,
  },
  hooks: auditHooks,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sponsor',
      type: 'relationship',
      relationTo: 'sponsors',
      required: true,
    },
    {
      name: 'campaignType',
      type: 'select',
      required: true,
      options: [
        { label: 'Radio Sponsorship', value: 'radio-sponsorship' },
        { label: 'TV / Video Sponsorship', value: 'tv-video-sponsorship' },
        { label: 'Digital Display', value: 'digital-display' },
        { label: 'Sponsored Playlist', value: 'sponsored-playlist' },
        { label: 'Sponsored Show / Segment', value: 'sponsored-show-segment' },
        { label: 'Sponsored Article', value: 'sponsored-article' },
        { label: 'Social Campaign', value: 'social-campaign' },
        { label: 'Event Sponsorship', value: 'event-sponsorship' },
        { label: 'Creator Partnership', value: 'creator-partnership' },
        { label: 'Integrated Package', value: 'integrated-package' },
      ],
    },
    {
      name: 'packageLevel',
      type: 'select',
      defaultValue: 'standard',
      options: [
        { label: 'Starter', value: 'starter' },
        { label: 'Standard', value: 'standard' },
        { label: 'Premium', value: 'premium' },
        { label: 'Presenting Sponsor', value: 'presenting' },
        { label: 'Custom', value: 'custom' },
      ],
    },
    {
      name: 'campaignDates',
      type: 'group',
      fields: [
        {
          name: 'startsAt',
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'endsAt',
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
      ],
    },
    {
      name: 'platforms',
      type: 'select',
      hasMany: true,
      required: true,
      options: [
        { label: 'Website', value: 'web' },
        { label: 'Mobile App', value: 'mobile' },
        { label: 'TV App', value: 'tv-app' },
        { label: 'WaveNation FM', value: 'radio' },
        { label: 'WaveNation One', value: 'tv' },
        { label: 'WaveNation+', value: 'plus' },
        { label: 'Newsletter', value: 'newsletter' },
        { label: 'Podcast', value: 'podcast' },
        { label: 'Social Media', value: 'social' },
        { label: 'Events', value: 'events' },
      ],
    },
    {
      name: 'budget',
      type: 'group',
      fields: [
        {
          name: 'currency',
          type: 'select',
          defaultValue: 'usd',
          options: [
            { label: 'USD', value: 'usd' },
            { label: 'EUR', value: 'eur' },
          ],
        },
        {
          name: 'grossBudgetCents',
          type: 'number',
          min: 0,
        },
        {
          name: 'netBudgetCents',
          type: 'number',
          min: 0,
        },
        {
          name: 'productionFeeCents',
          type: 'number',
          min: 0,
        },
      ],
    },
    {
      name: 'billingStatus',
      type: 'select',
      defaultValue: 'not-invoiced',
      options: [
        { label: 'Not Invoiced', value: 'not-invoiced' },
        { label: 'Invoice Sent', value: 'invoice-sent' },
        { label: 'Partially Paid', value: 'partially-paid' },
        { label: 'Paid', value: 'paid' },
        { label: 'Overdue', value: 'overdue' },
        { label: 'Comped / In-Kind', value: 'comped' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'invoiceId',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'stripeInvoiceId',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'adPlacements',
      type: 'relationship',
      relationTo: 'ad-placements',
      hasMany: true,
    },
    {
      name: 'deliverables',
      type: 'array',
      fields: [
        {
          name: 'deliverableType',
          type: 'select',
          required: true,
          options: [
            { label: 'Audio Spot', value: 'audio-spot' },
            { label: 'Video Spot', value: 'video-spot' },
            { label: 'Banner Ad', value: 'banner-ad' },
            { label: 'Native Card', value: 'native-card' },
            { label: 'Newsletter Placement', value: 'newsletter-placement' },
            { label: 'Social Post', value: 'social-post' },
            { label: 'Sponsored Article', value: 'sponsored-article' },
            { label: 'Lower Third', value: 'lower-third' },
            { label: 'Event Signage', value: 'event-signage' },
            { label: 'Playlist Branding', value: 'playlist-branding' },
          ],
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          defaultValue: 1,
          min: 1,
        },
        {
          name: 'dueDate',
          type: 'date',
        },
        {
          name: 'deliveryStatus',
          type: 'select',
          defaultValue: 'pending',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'In Production', value: 'in-production' },
            { label: 'Ready for Review', value: 'ready-for-review' },
            { label: 'Approved', value: 'approved' },
            { label: 'Delivered', value: 'delivered' },
            { label: 'Cancelled', value: 'cancelled' },
          ],
        },
      ],
    },
    {
      name: 'assets',
      type: 'group',
      fields: [
        {
          name: 'sponsorLogo',
          type: 'relationship',
          relationTo: 'media',
        },
        {
          name: 'campaignHeroImage',
          type: 'relationship',
          relationTo: 'media',
        },
        {
          name: 'audioSpot',
          type: 'relationship',
          relationTo: 'media',
        },
        {
          name: 'videoSpot',
          type: 'relationship',
          relationTo: 'media',
        },
        {
          name: 'contractFile',
          type: 'relationship',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'targeting',
      type: 'group',
      fields: [
        {
          name: 'audienceSegments',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Culture Consumers 25–45', value: 'culture-consumers-25-45' },
            { label: 'Multigenerational 45+', value: 'multigenerational-45-plus' },
            { label: 'Creators', value: 'creators' },
            { label: 'Southern Soul Audience', value: 'southern-soul' },
            { label: 'Gospel Audience', value: 'gospel' },
            { label: 'Hip-Hop Audience', value: 'hip-hop' },
            { label: 'R&B Audience', value: 'rnb' },
            { label: 'Local / Regional', value: 'local-regional' },
          ],
        },
        {
          name: 'regions',
          type: 'array',
          fields: [
            {
              name: 'region',
              type: 'text',
            },
          ],
        },
        {
          name: 'devices',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Desktop', value: 'desktop' },
            { label: 'Mobile', value: 'mobile' },
            { label: 'Tablet', value: 'tablet' },
            { label: 'TV', value: 'tv' },
            { label: 'Car / Auto', value: 'car-auto' },
          ],
        },
      ],
    },
    {
      name: 'performance',
      type: 'group',
      fields: [
        {
          name: 'impressionsGoal',
          type: 'number',
          min: 0,
        },
        {
          name: 'clicksGoal',
          type: 'number',
          min: 0,
        },
        {
          name: 'conversionsGoal',
          type: 'number',
          min: 0,
        },
        {
          name: 'actualImpressions',
          type: 'number',
          min: 0,
        },
        {
          name: 'actualClicks',
          type: 'number',
          min: 0,
        },
        {
          name: 'actualConversions',
          type: 'number',
          min: 0,
        },
        {
          name: 'reportingUrl',
          type: 'text',
        },
      ],
    },
    {
      name: 'approval',
      type: 'group',
      fields: [
        {
          name: 'editorialApprovalRequired',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'legalApprovalRequired',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'sponsorApprovedAt',
          type: 'date',
        },
        {
          name: 'internalApprovedAt',
          type: 'date',
        },
      ],
    },
    {
      name: 'disclosureLabel',
      type: 'select',
      defaultValue: 'sponsored',
      options: [
        { label: 'Sponsored', value: 'sponsored' },
        { label: 'Partner Content', value: 'partner-content' },
        { label: 'Paid Editorial', value: 'paid-editorial' },
        { label: 'Presented By', value: 'presented-by' },
      ],
    },
    ...standardSystemFields,
  ],
}
