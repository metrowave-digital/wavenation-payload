// src/collections/Articles.ts
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
   Constants & Configuration
====================================================== */

const WORDS_PER_MINUTE = 225
const REVIEW_TIERS = [
  { label: 'Tier 1 — High-Risk & High-Visibility', value: 'tier1' },
  { label: 'Tier 2 — Standard Published Content', value: 'tier2' },
  { label: 'Tier 3 — Rapid Editorial / Social', value: 'tier3' },
  { label: 'Tier 4 — Creator Hub Content', value: 'tier4' },
] as const

/* ======================================================
   Slug & Logic Helpers
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
  if (operation === 'update' && originalDoc?.slug && originalDoc?.status === 'published') {
    return originalDoc.slug
  }
  const title = typeof data?.title === 'string' ? data.title : null
  return title ? slugify(title) : value
}

const autoPublishHook: FieldHook = ({ value, siblingData }) => {
  if (siblingData?.scheduledPublishAt && new Date(siblingData.scheduledPublishAt) <= new Date()) {
    return 'published'
  }
  return value
}

/* ======================================================
   Enhanced Reading Time (Text + Media)
====================================================== */

function extractTextFromNode(node: any): string {
  if (!node) return ''
  if (typeof node === 'string') return node + ' '

  let extracted = ''
  if (typeof node === 'object' && !Array.isArray(node)) {
    if (typeof node.text === 'string') extracted += node.text + ' '
    if (typeof node.value === 'string') extracted += node.value + ' '
    for (const key in node) {
      if (Array.isArray(node[key]) || typeof node[key] === 'object') {
        extracted += extractTextFromNode(node[key])
      }
    }
  } else if (Array.isArray(node)) {
    extracted += node.map(extractTextFromNode).join(' ')
  }
  return extracted
}

const calculateReadingTimeBeforeChange: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  const blocksRaw = data.contentBlocks || originalDoc?.contentBlocks
  let wordCount = 0
  let mediaSeconds = 0

  if (Array.isArray(blocksRaw)) {
    const rawText = extractTextFromNode(blocksRaw)
    const words = rawText.match(/\b\w+\b/g)
    wordCount = words ? words.length : 0

    blocksRaw.forEach((block: any) => {
      if (['image', 'embed'].includes(block.blockType)) mediaSeconds += 12
      if (block.blockType === 'gallery') mediaSeconds += 25
      if (['video', 'audio'].includes(block.blockType)) mediaSeconds += 45
    })

    const totalMinutes = wordCount / WORDS_PER_MINUTE + mediaSeconds / 60
    data.readingTime = Math.max(1, Math.ceil(totalMinutes))
  } else if (!data.readingTime) {
    data.readingTime = 1
  }

  return data
}

/* ======================================================
   Enhanced AI Ranking (Exponential Decay)
====================================================== */

const enhancedAIRankingHook: FieldHook = ({ value, data }) => {
  const now = Date.now()
  const isBreaking = Boolean(data?.isBreaking)
  const isFeatured = Boolean(data?.isFeatured)
  const reviewTier = data?.reviewTier || 'tier2'
  const readingTime = (data?.readingTime as number) || 1

  const blocks = Array.isArray(data?.contentBlocks) ? data.contentBlocks : []
  const mediaCount = blocks.filter((b: any) =>
    ['image', 'gallery', 'video', 'audio', 'embed'].includes(b.blockType),
  ).length
  const densityScore = Math.min(10, Math.ceil(Math.log2(mediaCount + 1) * 2 + readingTime * 0.3))

  let boost = 2
  if (isBreaking) boost += 6
  if (isFeatured) boost += 2
  if (reviewTier === 'tier1') boost += 2
  boost = Math.min(10, boost)

  const publishDateMs = data?.publishDate ? new Date(data.publishDate as string).getTime() : now
  const hoursSincePublish = Math.max(0, (now - publishDateMs) / (1000 * 60 * 60))

  let decayRate = 0.05
  if (isBreaking) decayRate = 0.18
  if (reviewTier === 'tier4') decayRate = 0.01

  const freshness = Math.max(0, Number((10 * Math.exp(-decayRate * hoursSincePublish)).toFixed(2)))
  const engagementPotential = Math.min(
    10,
    Math.ceil(boost * 0.4 + densityScore * 0.4 + freshness * 0.2),
  )

  return {
    boost,
    freshness,
    decay: Math.ceil(decayRate * 100),
    contentDensity: densityScore,
    engagementPotential,
    aiNotes: `Analyzed ${blocks.length} blocks. Decay λ=${decayRate}. Calculated ${Math.floor(hoursSincePublish)}h since publish.`,
  }
}

/* ======================================================
   Editor Presets
====================================================== */

const ARTICLE_PRESETS = {
  interview: [
    { blockType: 'richText', content: [{ type: 'paragraph', children: [{ text: 'Intro...' }] }] },
    { blockType: 'interviewQuestion', question: 'How did this project come together?' },
    {
      blockType: 'interviewAnswer',
      highlight: true,
      answer: [{ type: 'paragraph', children: [{ text: 'Response...' }] }],
    },
  ],
  review: [
    { blockType: 'richText', content: [{ type: 'paragraph', children: [{ text: 'Verdict...' }] }] },
    { blockType: 'cta', headline: 'Listen Now', buttonLabel: 'Check it out' },
  ],
  news: [
    {
      blockType: 'richText',
      content: [{ type: 'paragraph', children: [{ text: 'Lead summary...' }] }],
    },
  ],
} as const

const applyEditorPresetHook: FieldHook = ({ value, siblingData }) => {
  if (Array.isArray(value) && value.length > 0) return value
  const presetKey = siblingData?.editorPreset as keyof typeof ARTICLE_PRESETS | undefined
  return presetKey ? [...ARTICLE_PRESETS[presetKey]] : value
}

/* ======================================================
   Collection Config
====================================================== */

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: { singular: 'Article', plural: 'Articles' },
  hooks: {
    beforeChange: [calculateReadingTimeBeforeChange],
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'readingTime', 'reviewTier', 'publishDate'],
    group: 'Editorial',
  },
  versions: { drafts: true, maxPerDoc: 50 },
  timestamps: true,
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'subtitle', type: 'text' },
            { name: 'excerpt', type: 'textarea', maxLength: 400 },
            {
              name: 'hero',
              type: 'group',
              fields: [
                { name: 'image', type: 'relationship', relationTo: 'media' },
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
              ],
            },
          ],
        },
        {
          label: 'Editorial & Sources',
          fields: [
            {
              name: 'author',
              type: 'relationship',
              relationTo: 'authors',
              required: true,
              admin: { position: 'sidebar' },
            },
            {
              name: 'editorialNotes',
              type: 'array',
              fields: [
                {
                  name: 'noteType',
                  type: 'select',
                  options: [
                    { label: 'Correction', value: 'correction' },
                    { label: 'Update', value: 'update' },
                    { label: 'Internal Note', value: 'internal' },
                  ],
                },
                { name: 'note', type: 'textarea', required: true },
                {
                  name: 'author',
                  type: 'relationship',
                  relationTo: 'users',
                  admin: { readOnly: true },
                },
                { name: 'createdAt', type: 'date', admin: { readOnly: true } },
              ],
            },
            {
              name: 'sources',
              type: 'array',
              fields: [
                {
                  name: 'sourceType',
                  type: 'select',
                  options: [
                    { label: 'Interview', value: 'interview' },
                    { label: 'News', value: 'news' },
                  ],
                },
                { name: 'title', type: 'text', required: true },
                { name: 'url', type: 'text' },
                { name: 'isPrimary', type: 'checkbox', defaultValue: false },
              ],
            },
          ],
        },
        {
          label: 'Taxonomy',
          fields: [
            { name: 'categories', type: 'relationship', relationTo: 'categories', hasMany: true },
            {
              name: 'subcategories',
              type: 'relationship',
              relationTo: 'subcategories',
              hasMany: true,
            },
            { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true },
            { name: 'series', type: 'relationship', relationTo: 'article-series' },
          ],
        },
        {
          label: 'Relations',
          fields: [
            {
              name: 'sponsor',
              type: 'relationship',
              relationTo: 'sponsors',
              admin: {
                description: 'If this is a sponsored or branded article, link the sponsor here.',
              },
            },
            { name: 'relatedShow', type: 'relationship', relationTo: 'radioShows' },
            { name: 'relatedPosdcast', type: 'relationship', relationTo: 'podcasts' },
            { name: 'relatedVOD', type: 'relationship', relationTo: 'vod' },
            { name: 'relatedAlbum', type: 'relationship', relationTo: 'albums' },
            { name: 'relatedPolls', type: 'relationship', relationTo: 'polls', hasMany: true },
          ],
        },
        {
          label: 'Mega Menu',
          fields: [
            { name: 'menuFeature', type: 'checkbox', defaultValue: false },
            {
              name: 'menuContext',
              type: 'select',
              admin: { condition: (_, sibling) => sibling.menuFeature },
              options: [
                { label: 'News', value: 'news' },
                { label: 'Watch', value: 'watch' },
              ],
            },
            { name: 'menuDescription', type: 'textarea', maxLength: 120 },
          ],
        },
        {
          label: 'AI & Metrics',
          fields: [
            {
              name: 'aiRanking',
              type: 'group',
              hooks: { beforeChange: [enhancedAIRankingHook] },
              fields: [
                { name: 'boost', type: 'number' },
                { name: 'decay', type: 'number' },
                { name: 'freshness', type: 'number' },
                { name: 'engagementPotential', type: 'number' },
                { name: 'contentDensity', type: 'number' },
                { name: 'aiNotes', type: 'textarea' },
              ],
            },
            {
              name: 'aiMetadata',
              type: 'group',
              fields: [
                { name: 'autoSummary', type: 'textarea' },
                { name: 'suggestedKeywords', type: 'text' },
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
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      hooks: { beforeValidate: [autoSlug] },
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      hooks: { beforeChange: [autoPublishHook] },
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishDate',
      type: 'date',
      admin: { position: 'sidebar' },
      hooks: {
        beforeChange: [
          ({ value, siblingData, originalDoc }) => {
            if (value) return value
            if (siblingData?.status === 'published' && !originalDoc?.publishDate)
              return new Date().toISOString()
            return value
          },
        ],
      },
    },
    { name: 'scheduledPublishAt', type: 'date', admin: { position: 'sidebar' } },
    {
      name: 'reviewTier',
      type: 'select',
      defaultValue: 'tier2',
      options: [...REVIEW_TIERS],
      admin: { position: 'sidebar' },
    },
    { name: 'isBreaking', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'isFeatured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
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
    { name: 'readingTime', type: 'number', admin: { position: 'sidebar', readOnly: true } },
  ],
}

export default Articles
