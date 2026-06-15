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
        { label: 'Radio Sponsorship', value: 'radio_sponsorship' },
        { label: 'TV / Video Sponsorship', value: 'tv_video_sponsorship' },
        { label: 'Digital Display', value: 'digital_display' },
        { label: 'Sponsored Playlist', value: 'sponsored_playlist' },
        { label: 'Sponsored Show / Segment', value: 'sponsored_show_segment' },
        { label: 'Sponsored Article', value: 'sponsored_article' },
        { label: 'Social Campaign', value: 'social_campaign' },
        { label: 'Event Sponsorship', value: 'event_sponsorship' },
        { label: 'Creator Partnership', value: 'creator_partnership' },
        { label: 'Integrated Package', value: 'integrated_package' },
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
        { label: 'TV App', value: 'tv_app' },
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
        { label: 'Not Invoiced', value: 'not_invoiced' },
        { label: 'Invoice Sent', value: 'invoice_sent' },
        { label: 'Partially Paid', value: 'partially_paid' },
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
            { label: 'Audio Spot', value: 'audio_spot' },
            { label: 'Video Spot', value: 'video_spot' },
            { label: 'Banner Ad', value: 'banner_ad' },
            { label: 'Native Card', value: 'native_card' },
            { label: 'Newsletter Placement', value: 'newsletter_placement' },
            { label: 'Social Post', value: 'social_post' },
            { label: 'Sponsored Article', value: 'sponsored_article' },
            { label: 'Lower Third', value: 'lower_third' },
            { label: 'Event Signage', value: 'event_signage' },
            { label: 'Playlist Branding', value: 'playlist_branding' },
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
            { label: 'In Production', value: 'in_production' },
            { label: 'Ready for Review', value: 'ready_for_review' },
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
            { label: 'Culture Consumers 25–45', value: 'culture_consumers_25_45' },
            { label: 'Multigenerational 45+', value: 'multigenerational_45_plus' },
            { label: 'Creators', value: 'creators' },
            { label: 'Southern Soul Audience', value: 'southern_soul' },
            { label: 'Gospel Audience', value: 'gospel' },
            { label: 'Hip-Hop Audience', value: 'hip_hop' },
            { label: 'R&B Audience', value: 'rnb' },
            { label: 'Local / Regional', value: 'local_regional' },
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
            { label: 'Car / Auto', value: 'car_auto' },
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
        { label: 'Partner Content', value: 'partner_content' },
        { label: 'Paid Editorial', value: 'paid_editorial' },
        { label: 'Presented By', value: 'presented_by' },
      ],
    },
    ...standardSystemFields,
  ],
}
