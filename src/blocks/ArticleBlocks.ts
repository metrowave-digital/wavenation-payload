import type { Block } from 'payload'

/* ======================================================
   Rich Text Block
====================================================== */

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: { singular: 'Rich Text', plural: 'Rich Text' },
  fields: [
    { name: 'content', type: 'richText', required: true },
    {
      name: 'dropCap',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Stylize the first letter as a large drop cap.' },
    },
  ],
}

/* ======================================================
   Image Block
====================================================== */

export const ImageBlock: Block = {
  slug: 'image',
  labels: { singular: 'Image', plural: 'Images' },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'caption', type: 'text' },
    { name: 'credit', type: 'text' },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'standard',
      options: [
        { label: 'Standard (Content Width)', value: 'standard' },
        { label: 'Wide (Bleed out of content area)', value: 'wide' },
        { label: 'Float Left', value: 'float-left' },
        { label: 'Float Right', value: 'float-right' },
      ],
    },
  ],
}

/* ======================================================
   Gallery Block
====================================================== */

export const GalleryBlock: Block = {
  slug: 'gallery',
  labels: { singular: 'Gallery', plural: 'Galleries' },
  fields: [
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid (Masonry)', value: 'grid' },
        { label: 'Slideshow / Carousel', value: 'carousel' },
      ],
    },
    {
      name: 'images',
      type: 'array',
      minRows: 2,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
  ],
}

/* ======================================================
   Pull Quote Block
====================================================== */

export const PullQuoteBlock: Block = {
  slug: 'pullQuote',
  labels: { singular: 'Pull Quote', plural: 'Pull Quotes' },
  fields: [
    { name: 'quote', type: 'textarea', required: true },
    { name: 'attribution', type: 'text' },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'standard',
      options: [
        { label: 'Standard Center', value: 'standard' },
        { label: 'Oversized Float Right', value: 'float-right' },
        { label: 'Oversized Float Left', value: 'float-left' },
      ],
    },
  ],
}

/* ======================================================
   Video Block
====================================================== */

export const VideoBlock: Block = {
  slug: 'video',
  labels: { singular: 'Video', plural: 'Videos' },
  fields: [
    {
      name: 'sourceType',
      type: 'select',
      defaultValue: 'external',
      options: [
        { label: 'External Embed / Platform', value: 'external' },
        { label: 'WaveNation VOD Library', value: 'internal-vod' },
      ],
    },
    {
      name: 'provider',
      type: 'select',
      admin: { condition: (_, data) => data?.sourceType === 'external' },
      options: [
        { label: 'YouTube', value: 'youtube' },
        { label: 'Vimeo', value: 'vimeo' },
        { label: 'Cloudflare / Mux', value: 'enterprise' },
        { label: 'Raw MP4 Upload', value: 'upload' },
      ],
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (_, data) => data?.sourceType === 'external' && data?.provider !== 'upload',
        description: 'Enter URL or Stream ID depending on provider.',
      },
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, data) => data?.sourceType === 'external' && data?.provider === 'upload',
      },
    },
    {
      name: 'vodItem',
      type: 'relationship',
      relationTo: 'vod',
      admin: { condition: (_, data) => data?.sourceType === 'internal-vod' },
    },
    { name: 'caption', type: 'text' },
    {
      type: 'row',
      fields: [
        { name: 'autoplay', type: 'checkbox', defaultValue: false },
        { name: 'loop', type: 'checkbox', defaultValue: false },
      ],
    },
  ],
}

/* ======================================================
   Audio / Track Block
====================================================== */

export const AudioBlock: Block = {
  slug: 'audio',
  labels: { singular: 'Audio Player', plural: 'Audio Players' },
  fields: [
    {
      name: 'sourceType',
      type: 'select',
      defaultValue: 'track',
      options: [
        { label: 'Music Track', value: 'track' },
        { label: 'Podcast Episode', value: 'episode' },
        { label: 'Manual File Upload', value: 'upload' },
      ],
    },
    {
      name: 'track',
      type: 'relationship',
      relationTo: 'mediaTracks',
      admin: { condition: (_, data) => data?.sourceType === 'track' },
    },
    {
      name: 'episode',
      type: 'relationship',
      relationTo: 'episodes',
      admin: { condition: (_, data) => data?.sourceType === 'episode' },
    },
    {
      name: 'manualAudio',
      type: 'group',
      admin: { condition: (_, data) => data?.sourceType === 'upload' },
      fields: [
        { name: 'title', type: 'text' },
        { name: 'audioFile', type: 'upload', relationTo: 'media', required: true },
        { name: 'showName', type: 'text' },
      ],
    },
  ],
}

/* ======================================================
   Embed Block (Social & DSPs)
====================================================== */

export const EmbedBlock: Block = {
  slug: 'embed',
  labels: { singular: 'Social Embed', plural: 'Social Embeds' },
  fields: [
    {
      name: 'provider',
      type: 'select',
      options: [
        { label: 'Instagram', value: 'instagram' },
        { label: 'TikTok', value: 'tiktok' },
        { label: 'X / Twitter', value: 'twitter' },
        { label: 'Spotify', value: 'spotify' },
        { label: 'Apple Music', value: 'appleMusic' },
        { label: 'Other / Iframe', value: 'other' },
      ],
    },
    { name: 'embedUrl', type: 'text', required: true },
  ],
}

/* ======================================================
   Artist Spotlight Block
====================================================== */

export const ArtistSpotlightBlock: Block = {
  slug: 'artistSpotlight',
  labels: { singular: 'Artist Spotlight', plural: 'Artist Spotlights' },
  fields: [
    {
      name: 'linkedTalent',
      type: 'relationship',
      relationTo: 'talent',
      admin: {
        description:
          'Select an existing talent to automatically pull their bio and image, or fill manually below.',
      },
    },
    { name: 'artistName', type: 'text', admin: { condition: (_, data) => !data?.linkedTalent } },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { condition: (_, data) => !data?.linkedTalent },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: { condition: (_, data) => !data?.linkedTalent },
    },
    {
      name: 'links',
      type: 'array',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'url', type: 'text' },
      ],
    },
  ],
}

/* ======================================================
   Related Articles Block
====================================================== */

export const RelatedArticlesBlock: Block = {
  slug: 'relatedArticles',
  labels: { singular: 'Related Articles', plural: 'Related Articles' },
  fields: [
    { name: 'title', type: 'text', defaultValue: 'Read More' },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'list',
      options: [
        { label: 'List', value: 'list' },
        { label: 'Card Grid', value: 'grid' },
      ],
    },
    {
      name: 'articles',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
    },
  ],
}

/* ======================================================
   CTA Block
====================================================== */

export const CTABlock: Block = {
  slug: 'cta',
  labels: { singular: 'Call To Action', plural: 'Calls To Action' },
  fields: [
    { name: 'headline', type: 'text', required: true },
    { name: 'body', type: 'textarea' },
    {
      type: 'row',
      fields: [
        { name: 'buttonLabel', type: 'text', admin: { width: '50%' } },
        { name: 'buttonUrl', type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      name: 'variant',
      type: 'select',
      options: [
        { label: 'Primary Brand', value: 'primary' },
        { label: 'Secondary / Dark', value: 'secondary' },
        { label: 'Outline', value: 'outline' },
      ],
      defaultValue: 'primary',
    },
  ],
}

/* ======================================================
   Divider Block
====================================================== */

export const DividerBlock: Block = {
  slug: 'divider',
  labels: { singular: 'Divider', plural: 'Dividers' },
  fields: [
    {
      name: 'style',
      type: 'select',
      defaultValue: 'solid',
      options: [
        { label: 'Solid Line', value: 'solid' },
        { label: 'Invisible Spacing', value: 'spacing' },
        { label: 'Asterisks (***)', value: 'asterisks' },
      ],
    },
  ],
}

/* ======================================================
   In-Article Ad Insertion
====================================================== */

export const AdInsertBlock: Block = {
  slug: 'adInsert',
  labels: { singular: 'Ad Zone Insert', plural: 'Ad Zones' },
  fields: [
    {
      name: 'adZone',
      type: 'relationship',
      relationTo: 'adZones',
      required: true,
      admin: {
        description:
          'Select an Ad Zone to render within the article body (e.g., In-Article Mid-Roll).',
      },
    },
  ],
}

/* ======================================================
   Question Block (Interviews)
====================================================== */

export const InterviewQuestionBlock: Block = {
  slug: 'interviewQuestion',
  labels: { singular: 'Interview Question', plural: 'Interview Questions' },
  fields: [
    {
      name: 'question',
      type: 'textarea',
      required: true,
      admin: { description: 'The interviewer’s question.' },
    },
    {
      name: 'askedBy',
      type: 'text',
      required: false,
      admin: { description: 'Optional interviewer name or role.' },
    },
  ],
}

/* ======================================================
   Answer Block (Interviews)
====================================================== */

export const InterviewAnswerBlock: Block = {
  slug: 'interviewAnswer',
  labels: { singular: 'Interview Answer', plural: 'Interview Answers' },
  fields: [
    {
      name: 'answer',
      type: 'richText',
      required: true,
      admin: { description: 'The interviewee’s response.' },
    },
    {
      name: 'answeredBy',
      type: 'text',
      required: false,
      admin: { description: 'Interviewee name (useful for multi-guest interviews).' },
    },
    {
      name: 'highlight',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Mark this answer as a highlight for pull quotes or summaries.' },
    },
  ],
}

/* ======================================================
   Timeline Block
====================================================== */

export const TimelineBlock: Block = {
  slug: 'timeline',
  labels: { singular: 'Timeline', plural: 'Timelines' },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: false,
      admin: { description: 'Optional heading for the timeline.' },
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'vertical',
      options: [
        { label: 'Vertical (default)', value: 'vertical' },
        { label: 'Horizontal (scroll)', value: 'horizontal' },
        { label: 'Compact', value: 'compact' },
      ],
      admin: { description: 'Visual presentation hint for frontend rendering.' },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 2,
      admin: { description: 'Chronological sequence of events or milestones.' },
      fields: [
        {
          name: 'date',
          type: 'text',
          required: false,
          admin: { description: 'Date or time label (e.g. “2018”, “March 2024”).' },
        },
        {
          name: 'headline',
          type: 'text',
          required: true,
          admin: { description: 'Short title for this moment.' },
        },
        { name: 'description', type: 'textarea', required: false },
        { name: 'image', type: 'upload', relationTo: 'media', required: false },
        {
          name: 'link',
          type: 'text',
          required: false,
          admin: { description: 'Optional link to a related article or source.' },
        },
        {
          name: 'highlight',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Marks this moment as a key highlight.' },
        },
      ],
    },
  ],
}
