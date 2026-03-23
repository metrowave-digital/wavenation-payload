import type { CollectionConfig, FieldHook, CollectionBeforeChangeHook } from 'payload'

import {
  RichTextBlock,
  ImageBlock,
  GalleryBlock,
  PullQuoteBlock,
  VideoBlock,
  AudioBlock,
  EmbedBlock,
  ArtistSpotlightBlock,
  RelatedArticlesBlock,
  CTABlock,
  DividerBlock,
  InterviewQuestionBlock,
  InterviewAnswerBlock,
  TimelineBlock,
} from '../blocks/ArticleBlocks'

/* ======================================================
   Slug Helpers
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

/**
 * Auto slug (SEO-safe)
 * - Generate on create
 * - Respect manual overrides
 * - Never change after publish
 */
const autoSlug: FieldHook = ({ value, data, originalDoc, operation }) => {
  if (typeof value === 'string' && value.trim()) {
    return value
  }

  if (operation === 'update' && originalDoc?.slug && originalDoc?.status === 'published') {
    return originalDoc.slug
  }

  const title = typeof data?.title === 'string' ? data.title : null

  return title ? slugify(title) : value
}

/* ======================================================
   Publish Logic
====================================================== */

const autoPublishHook: FieldHook = ({ value, siblingData }) => {
  if (siblingData?.scheduledPublishAt && new Date(siblingData.scheduledPublishAt) <= new Date()) {
    return 'published'
  }
  return value
}

/* ======================================================
   Editor Presets
====================================================== */

const ARTICLE_PRESETS = {
  interview: [
    {
      blockType: 'richText',
      content: [
        {
          type: 'paragraph',
          children: [
            {
              text: 'Introduce the artist, creator, or subject of this interview.',
            },
          ],
        },
      ],
    },
    {
      blockType: 'interviewQuestion',
      question: 'How did this project come together?',
    },
    {
      blockType: 'interviewAnswer',
      highlight: true,
      answer: [
        {
          type: 'paragraph',
          children: [
            {
              text: 'It really started as a personal idea before it became something bigger…',
            },
          ],
        },
      ],
    },
  ],

  review: [
    {
      blockType: 'richText',
      content: [
        {
          type: 'paragraph',
          children: [{ text: 'Overview and verdict…' }],
        },
      ],
    },
    {
      blockType: 'cta',
      headline: 'Listen / Watch Now',
      buttonLabel: 'Check it out',
      buttonUrl: '',
    },
  ],

  news: [
    {
      blockType: 'richText',
      content: [
        {
          type: 'paragraph',
          children: [{ text: 'Lead paragraph summarizing key facts.' }],
        },
      ],
    },
  ],
} as const

const applyEditorPresetHook: FieldHook = ({ value, siblingData }) => {
  if (Array.isArray(value) && value.length > 0) return value

  const presetKey = siblingData?.editorPreset as keyof typeof ARTICLE_PRESETS | undefined

  return presetKey ? [...ARTICLE_PRESETS[presetKey]] : value
}

/* ======================================================
   Reading Time & Content Extraction Helpers
====================================================== */

const WORDS_PER_MINUTE = 200

// Deeply recursive text extractor for rich text structures (Lexical or Slate)
function extractTextFromNode(node: unknown): string {
  if (!node || typeof node !== 'object') return ''

  const record = node as Record<string, unknown>
  let extracted = ''

  if (typeof record.text === 'string') {
    extracted += record.text + ' '
  }

  if (Array.isArray(record.children)) {
    extracted += record.children.map(extractTextFromNode).join(' ') + ' '
  }

  return extracted
}

function extractTextFromBlocks(blocks: Array<Record<string, unknown>> | undefined): string {
  if (!Array.isArray(blocks)) return ''

  return blocks
    .map((block) => {
      let blockText = ''

      // RichText blocks
      if (Array.isArray(block.content)) {
        blockText += block.content.map(extractTextFromNode).join(' ')
      }

      // Interview blocks
      if (Array.isArray(block.answer)) {
        blockText += block.answer.map(extractTextFromNode).join(' ')
      }
      if (typeof block.question === 'string') {
        blockText += ' ' + block.question
      }

      // Pull Quotes
      if (typeof block.quote === 'string') {
        blockText += ' ' + block.quote
      }

      return blockText
    })
    .join(' ')
    .trim()
}

/**
 * FIX: Moved Reading Time to a `beforeChange` hook.
 * `afterChange` triggers a secondary database save, which impacts performance
 * and can mess up document version histories. `beforeChange` safely mutates
 * the data payload right before it writes to the DB in one action.
 */
const calculateReadingTimeBeforeChange: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  // Use incoming data if present, otherwise fallback to existing document
  const blocksRaw = data.contentBlocks || originalDoc?.contentBlocks

  if (Array.isArray(blocksRaw)) {
    const text = extractTextFromBlocks(blocksRaw as Array<Record<string, unknown>>)
    const wordCount = text.split(/\s+/).filter(Boolean).length
    data.readingTime = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE))
  } else if (!data.readingTime) {
    data.readingTime = 1
  }

  return data
}

/* ======================================================
   Enhanced AI Ranking Logic
====================================================== */

const enhancedAIRankingHook: FieldHook = ({ value, siblingData }) => {
  const existing = value && typeof value === 'object' ? (value as Record<string, unknown>) : {}

  const now = Date.now()
  const isBreaking = Boolean(siblingData?.isBreaking)
  const isFeatured = Boolean(siblingData?.isFeatured)
  const reviewTier = siblingData?.reviewTier
  const readingTime = (siblingData?.readingTime as number) || 1

  // Calculate content density based on block types
  const blocks = Array.isArray(siblingData?.contentBlocks) ? siblingData.contentBlocks : []
  const mediaBlockCount = blocks.filter((b: any) =>
    ['image', 'gallery', 'video', 'audio', 'embed'].includes(b.blockType),
  ).length

  // Content Density: Ratio of media to text (Scale 1-10)
  // Higher score = highly rich multimedia article
  const densityScore = Math.min(10, Math.max(1, Math.ceil(mediaBlockCount * 2 + readingTime * 0.5)))

  const publishDateMs = siblingData?.publishDate
    ? new Date(siblingData.publishDate as string).getTime()
    : now
  const hoursSincePublish = Math.max(0, (now - publishDateMs) / (1000 * 60 * 60))

  // Boost (0–10)
  let boost = 3
  if (isBreaking) boost += 5
  if (isFeatured) boost += 2
  if (reviewTier === 'tier1') boost += 3
  if (reviewTier === 'tier2') boost += 1
  if (readingTime >= 5) boost += 1
  boost = Math.min(10, boost)

  // Freshness (0–10)
  let freshness = 10
  if (hoursSincePublish > 6) freshness -= 2
  if (hoursSincePublish > 24) freshness -= 3
  if (hoursSincePublish > 72) freshness -= 4
  freshness = Math.max(0, freshness)

  // Decay (0–10) - How fast it should fall off the feed
  let decay = 5
  if (isBreaking) decay = 9 // Breaking news decays rapidly
  if (reviewTier === 'tier1') decay = 6
  if (reviewTier === 'tier4') decay = 3 // Evergreen creator content decays slowly

  // Engagement Potential (0-10) - AI estimated virality based on density + breaking status
  const engagementPotential = Math.min(10, Math.ceil((boost + densityScore) / 2))

  return {
    boost,
    freshness,
    decay,
    contentDensity: densityScore,
    engagementPotential,
    aiNotes:
      (existing.aiNotes as string | undefined) ??
      `Auto-scored. Detected ${mediaBlockCount} media blocks and ${readingTime} min read.`,
  }
}

/* ======================================================
   Review Tiers
====================================================== */

const REVIEW_TIERS = [
  { label: 'Tier 1 — High-Risk & High-Visibility', value: 'tier1' },
  { label: 'Tier 2 — Standard Published Content', value: 'tier2' },
  { label: 'Tier 3 — Rapid Editorial / Social', value: 'tier3' },
  { label: 'Tier 4 — Creator Hub Content', value: 'tier4' },
] as const

/* ======================================================
   Collection
====================================================== */

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: { singular: 'Article', plural: 'Articles' },

  hooks: {
    beforeChange: [calculateReadingTimeBeforeChange],
  },

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'readingTime', 'reviewTier', 'publishDate', 'updatedAt'],
    group: 'Editorial',
  },

  versions: {
    drafts: true,
    maxPerDoc: 50,
  },

  timestamps: true,

  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },

  fields: [
    /* ===============================
       Identity
    =============================== */

    { name: 'title', type: 'text', required: true },
    { name: 'subtitle', type: 'text' },

    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      hooks: { beforeValidate: [autoSlug] },
      admin: {
        position: 'sidebar',
        description: 'Auto-generated from title. Do not change after publish.',
      },
    },

    /* ===============================
       Taxonomy
    =============================== */

    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        position: 'sidebar',
        description: 'Primary editorial categories for this article.',
      },
    },

    {
      name: 'subcategories',
      type: 'relationship',
      relationTo: 'subcategories',
      hasMany: true,
      admin: {
        position: 'sidebar',
        description: 'Related subcategories for secondary classification and discovery.',
      },
    },

    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        position: 'sidebar',
        description: 'Keywords for SEO, discovery, playlists, and recommendations.',
      },
    },

    /* ===============================
       Publishing
    =============================== */

    {
      name: 'publishDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        description:
          'Public publish date. Can be manually overridden. Auto-set on first publish if empty.',
      },
      hooks: {
        beforeChange: [
          ({ value, siblingData, originalDoc }) => {
            if (value) return value
            if (siblingData?.status === 'published' && !originalDoc?.publishDate) {
              return new Date().toISOString()
            }
            return value
          },
        ],
      },
    },

    {
      name: 'scheduledPublishAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Automatically publishes this article at the scheduled time.',
      },
    },

    /* ===============================
       Editorial Workflow
    =============================== */

    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'In Review', value: 'in-review' },
        { label: 'Approved', value: 'approved' },
        { label: 'Published', value: 'published' },
        { label: 'Unpublished', value: 'unpublished' },
        { label: 'Archived', value: 'archived' },
      ],
      hooks: {
        beforeChange: [autoPublishHook],
      },
      admin: { position: 'sidebar' },
    },

    {
      name: 'reviewTier',
      type: 'select',
      defaultValue: 'tier2',
      options: [...REVIEW_TIERS],
      admin: { position: 'sidebar' },
    },

    /* ===============================
       Editorial Flags
    =============================== */

    {
      name: 'isBreaking',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'Marks this article as breaking news. Triggers AI ranking boosts and high-priority placement.',
      },
    },

    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Displays this article in the Spotlight section below the homepage hero.',
      },
    },

    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },

    {
      name: 'editorPreset',
      type: 'select',
      options: [
        { label: 'Interview', value: 'interview' },
        { label: 'Review', value: 'review' },
        { label: 'News', value: 'news' },
      ],
      admin: { position: 'sidebar' },
    },

    /* ===============================
       Editorial Notes
    =============================== */

    {
      name: 'editorialNotes',
      type: 'array',
      admin: {
        description: 'Internal notes explaining significant editorial changes. Not public.',
      },
      fields: [
        {
          name: 'noteType',
          type: 'select',
          required: true,
          options: [
            { label: 'Correction', value: 'correction' },
            { label: 'Update', value: 'update' },
            { label: 'Breaking Update', value: 'breaking-update' },
            { label: 'SEO Adjustment', value: 'seo' },
            { label: 'Legal / Compliance', value: 'legal' },
            { label: 'Editorial Review', value: 'review' },
            { label: 'Internal Note', value: 'internal' },
          ],
        },
        {
          name: 'note',
          type: 'textarea',
          required: true,
        },
        {
          name: 'author',
          type: 'relationship',
          relationTo: 'users',
          admin: { readOnly: true },
        },
        {
          name: 'createdAt',
          type: 'date',
          admin: { readOnly: true },
        },
      ],
    },

    /* ===============================
       Content
    =============================== */

    {
      name: 'excerpt',
      type: 'textarea',
      maxLength: 400,
    },

    /* ===============================
       Sources
    =============================== */

    {
      name: 'sources',
      type: 'array',
      admin: {
        description:
          'Primary sources used in reporting this article. Required for news, investigations, and fact-based reporting.',
      },
      fields: [
        {
          name: 'sourceType',
          type: 'select',
          required: true,
          options: [
            { label: 'News Article', value: 'news' },
            { label: 'Interview', value: 'interview' },
            { label: 'Press Release', value: 'press' },
            { label: 'Government / Legal', value: 'government' },
            { label: 'Research / Study', value: 'research' },
            { label: 'Official Statement', value: 'statement' },
            { label: 'Other', value: 'other' },
          ],
        },
        { name: 'title', type: 'text', required: true },
        {
          name: 'publication',
          type: 'text',
          admin: { description: 'Outlet, organization, or institution name.' },
        },
        { name: 'url', type: 'text', admin: { description: 'Link to the original source.' } },
        { name: 'author', type: 'text' },
        { name: 'publishedDate', type: 'date' },
        {
          name: 'isPrimary',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Marks this as a primary source for the article.' },
        },
        {
          name: 'notes',
          type: 'textarea',
          admin: { description: 'Internal notes about how this source was used.' },
        },
      ],
    },

    /* ===============================
       References
    =============================== */

    {
      name: 'references',
      type: 'array',
      admin: {
        description: 'Supporting references, documents, archives, or background materials.',
      },
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'referenceType',
          type: 'select',
          options: [
            { label: 'Law / Statute', value: 'law' },
            { label: 'Court Case', value: 'court' },
            { label: 'Academic Paper', value: 'academic' },
            { label: 'Book', value: 'book' },
            { label: 'Archive / Historical', value: 'archive' },
            { label: 'Video / Audio', value: 'media' },
            { label: 'Website', value: 'web' },
            { label: 'Other', value: 'other' },
          ],
        },
        { name: 'url', type: 'text' },
        {
          name: 'notes',
          type: 'textarea',
          admin: { description: 'Optional context for editors or AI.' },
        },
      ],
    },

    {
      name: 'series',
      type: 'relationship',
      relationTo: 'article-series',
      admin: { position: 'sidebar', description: 'Optional series this article belongs to.' },
    },

    /* ===============================
       Related Shows & Media
    =============================== */

    {
      name: 'relatedShow',
      type: 'relationship',
      relationTo: 'radioShows',
      admin: {
        position: 'sidebar',
        description: 'Link this article to a WaveNation radio, TV, or podcast show.',
      },
    },
    {
      name: 'relatedPosdcast',
      type: 'relationship',
      relationTo: 'podcasts',
      admin: { position: 'sidebar', description: 'Link this article to a podcast show.' },
    },
    {
      name: 'relatedVOD',
      type: 'relationship',
      relationTo: 'vod',
      admin: { position: 'sidebar', description: 'Link this article to a Video on Demand.' },
    },
    {
      name: 'relatedAlbum',
      type: 'relationship',
      relationTo: 'albums',
      admin: { position: 'sidebar', description: 'Optional album related to this article.' },
    },
    {
      name: 'relatedPolls',
      label: 'Related Polls',
      type: 'relationship',
      relationTo: 'polls',
      hasMany: true,
      admin: { description: 'Attach relevant polls to this article' },
    },

    /* ===============================
       Menu Feature
    =============================== */

    { name: 'menuFeature', label: 'Feature in Mega Menu', type: 'checkbox', defaultValue: false },
    {
      name: 'menuContext',
      label: 'Mega Menu Section',
      type: 'select',
      required: false,
      admin: { condition: (_, siblingData) => siblingData.menuFeature },
      options: [
        { label: 'Discover', value: 'discover' },
        { label: 'On-Air', value: 'on-air' },
        { label: 'News', value: 'news' },
        { label: 'Watch', value: 'watch' },
        { label: 'Merch', value: 'merch' },
        { label: 'Connect', value: 'connect' },
      ],
    },
    {
      name: 'menuEyebrow',
      label: 'Menu Eyebrow (optional)',
      type: 'text',
      admin: { condition: (_, siblingData) => siblingData.menuFeature },
    },
    {
      name: 'menuDescription',
      label: 'Menu Description (short)',
      type: 'textarea',
      maxLength: 120,
      admin: { condition: (_, siblingData) => siblingData.menuFeature },
    },

    {
      name: 'readingTime',
      type: 'number',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Estimated reading time in minutes (auto-calculated from rich text blocks).',
      },
    },

    {
      name: 'hero',
      type: 'group',
      fields: [
        {
          name: 'image',
          type: 'relationship',
          relationTo: 'media',
          access: { read: () => true },
        },
        { name: 'caption', type: 'textarea' },
        { name: 'credit', type: 'text' },
      ],
    },

    {
      name: 'contentBlocks',
      type: 'blocks',
      required: true,
      hooks: { beforeChange: [applyEditorPresetHook] },
      blocks: [
        RichTextBlock,
        InterviewQuestionBlock,
        InterviewAnswerBlock,
        ImageBlock,
        GalleryBlock,
        PullQuoteBlock,
        VideoBlock,
        AudioBlock,
        EmbedBlock,
        ArtistSpotlightBlock,
        RelatedArticlesBlock,
        CTABlock,
        DividerBlock,
        TimelineBlock,
      ],
    },

    /* ===============================
       Enhanced AI & Automation
    =============================== */

    {
      name: 'aiRanking',
      type: 'group',
      admin: {
        description: 'Algorithmic ranking parameters determined dynamically based on content.',
      },
      hooks: {
        beforeChange: [enhancedAIRankingHook],
      },
      fields: [
        { name: 'boost', type: 'number', min: 0, max: 10 },
        { name: 'decay', type: 'number', min: 0, max: 10 },
        { name: 'freshness', type: 'number', min: 0, max: 10 },
        {
          name: 'engagementPotential',
          type: 'number',
          min: 0,
          max: 10,
          admin: { description: 'Predictive virality/engagement metric.' },
        },
        {
          name: 'contentDensity',
          type: 'number',
          min: 0,
          max: 10,
          admin: { description: 'Media vs Text ratio score.' },
        },
        { name: 'aiNotes', type: 'textarea' },
      ],
    },

    {
      name: 'aiMetadata',
      type: 'group',
      admin: {
        position: 'sidebar',
        description: 'Auto-generated context used for SEO and internal feed recommendations.',
      },
      fields: [
        {
          name: 'autoSummary',
          type: 'textarea',
          admin: {
            description: 'AI-generated quick summary for preview cards if excerpt is omitted.',
            rows: 3,
          },
        },
        {
          name: 'suggestedKeywords',
          type: 'text',
          admin: {
            description: 'Comma separated keywords extracted from the text by AI engine.',
          },
        },
      ],
    },
  ],
}
