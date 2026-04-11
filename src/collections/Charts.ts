// src/collections/Charts.ts
import type {
  CollectionConfig,
  CollectionBeforeChangeHook,
  CollectionAfterChangeHook,
} from 'payload'

/* ======================================================
   Types
====================================================== */

type ChartEntry = {
  rank?: number
  previousRank?: number | null
  peakRank?: number
  weeksOnChart?: number
  movement?: 'up' | 'down' | 'same' | 'new' | 're-entry'
  accolade?: 'none' | 'hot-shot-debut' | 'greatest-gainer' | 'pacesetter'
  manualTrack: {
    title: string
    artist: string
    featuredArtists?: string
    isrc?: string
    label?: string
    releaseDate?: string
    artwork?: any // Media ID
    previewUrl?: string
  }
  trackTitle?: string
  artist?: string
  score?: number
  editorialNote?: string
}

/* ======================================================
   Utilities
====================================================== */

function getISOWeek(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`
}

// Helper to match tracks reliably
function generateTrackId(title: string, artist: string, isrc?: string) {
  if (isrc) return isrc.trim().toLowerCase()
  return `${title}-${artist}`.trim().toLowerCase().replace(/\s+/g, '')
}

/* ======================================================
   Hooks
====================================================== */

const processChartMetrics: CollectionBeforeChangeHook = async ({ data, req, operation }) => {
  if (!data) return data

  // 1. Auto-generate week & slug
  if (!data.week && data.publishDate) {
    data.week = getISOWeek(new Date(data.publishDate))
  }
  if (data.chartKey && data.week) {
    data.slug = `${data.chartKey}-${data.week}`
  }

  // 2. Auto-calculate Billboard-style metrics if linked to a previous chart
  let previousEntries: ChartEntry[] = []

  if (data.previousChart) {
    try {
      // Fetch the previous chart to compare against
      const prevChartDoc = await req.payload.findByID({
        collection: 'charts',
        id: data.previousChart,
        depth: 0,
      })
      if (prevChartDoc && Array.isArray(prevChartDoc.entries)) {
        previousEntries = prevChartDoc.entries as ChartEntry[]
      }
    } catch (err) {
      req.payload.logger.warn('Could not fetch previous chart for metrics calculation.')
    }
  }

  // 3. Process entries based on drag-and-drop order
  if (Array.isArray(data.entries)) {
    data.entries.forEach((entry: ChartEntry, index: number) => {
      const currentRank = index + 1
      entry.rank = currentRank

      // Sync duplicate fields for top-level readability/searching
      entry.trackTitle = entry.manualTrack?.title
      entry.artist = entry.manualTrack?.artist

      const trackId = generateTrackId(
        entry.manualTrack?.title || '',
        entry.manualTrack?.artist || '',
        entry.manualTrack?.isrc,
      )
      const prevEntry = previousEntries.find(
        (p) =>
          generateTrackId(
            p.manualTrack?.title || '',
            p.manualTrack?.artist || '',
            p.manualTrack?.isrc,
          ) === trackId,
      )

      if (prevEntry) {
        // Track was on the chart last week
        entry.previousRank = prevEntry.rank || null
        entry.weeksOnChart = (prevEntry.weeksOnChart || 1) + 1
        entry.peakRank = Math.min(currentRank, prevEntry.peakRank || currentRank)

        // Calculate Movement
        if (entry.previousRank && currentRank < entry.previousRank) {
          entry.movement = 'up'
        } else if (entry.previousRank && currentRank > entry.previousRank) {
          entry.movement = 'down'
        } else {
          entry.movement = 'same'
        }
      } else {
        // New Track or Re-entry
        if (operation === 'create' || !entry.previousRank) {
          entry.previousRank = null
          entry.weeksOnChart = 1
          entry.peakRank = currentRank
          entry.movement = 'new'
        }
      }
    })
  }

  return data
}

export const createChartSnapshotHook: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  // Only trigger when the chart is transitioned to "published"
  const isPublishing = doc.status === 'published' && previousDoc?.status !== 'published'

  if (!isPublishing || !doc.week) {
    return doc
  }

  try {
    // 1. Check if a snapshot for this Chart + Week already exists
    const existingSnapshot = await req.payload.find({
      collection: 'chart-snapshots',
      where: {
        and: [{ chart: { equals: doc.id } }, { week: { equals: doc.week } }],
      },
      depth: 0,
    })

    if (existingSnapshot.totalDocs > 0) {
      req.payload.logger.info(`Snapshot for ${doc.title} (${doc.week}) already exists. Skipping.`)
      return doc
    }

    // 2. Format the entries for the Snapshot schema
    const snapshotEntries = (doc.entries || []).map((entry: any) => ({
      rank: entry.rank,
      previousRank: entry.previousRank || null,
      movement: entry.movement || 'new',
      trackId: generateTrackId(
        entry.manualTrack?.title || '',
        entry.manualTrack?.artist || '',
        entry.manualTrack?.isrc,
      ),
      artist: entry.manualTrack?.artist || 'Unknown Artist',
      finalScore: entry.score || 0,
    }))

    // 3. Deposit the immutable record into ChartSnapshots
    await req.payload.create({
      collection: 'chart-snapshots',
      data: {
        chart: doc.id,
        week: doc.week,
        label: `${doc.title} — ${doc.week}`,
        entries: snapshotEntries,
      },
    })

    req.payload.logger.info(
      `Successfully created immutable snapshot for ${doc.title} (${doc.week}).`,
    )
  } catch (error) {
    req.payload.logger.error(`Failed to create Chart Snapshot for ${doc.id}: ${error}`)
  }

  return doc
}

/* ======================================================
   Charts Collection
====================================================== */

export const Charts: CollectionConfig = {
  slug: 'charts',

  labels: {
    singular: 'Chart',
    plural: 'Charts',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Music & Programming',
    defaultColumns: ['title', 'chartKey', 'week', 'status', 'publishDate'],
    description:
      'Weekly ranked charts. Duplicate last week’s chart, link it in "Previous Chart", and reorder entries to auto-calculate metrics.',
  },

  versions: {
    drafts: true,
    maxPerDoc: 50,
  },

  access: {
    read: () => true,
    create: ({ req }) =>
      Boolean(req.user?.roles?.includes('editor') || req.user?.roles?.includes('admin')),
    update: ({ req }) =>
      Boolean(req.user?.roles?.includes('editor') || req.user?.roles?.includes('admin')),
    delete: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
  },

  hooks: {
    beforeChange: [processChartMetrics],
    afterChange: [createChartSnapshotHook],
  },

  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Chart Config',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'title', type: 'text', required: true, admin: { width: '50%' } },
                {
                  name: 'chartKey',
                  type: 'select',
                  required: true,
                  admin: { width: '50%' },
                  options: [
                    { label: 'The HitList', value: 'hitlist' },
                    { label: 'R&B & Soul', value: 'rnb-soul' },
                    { label: 'Hip-Hop', value: 'hip-hop' },
                    { label: 'Southern Soul', value: 'southern-soul' },
                    { label: 'Gospel', value: 'gospel' },
                    { label: 'House / BPM', value: 'house' },
                  ],
                },
              ],
            },
            {
              name: 'description',
              type: 'textarea',
              admin: { description: "Editorial summary of this week's chart." },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'coverImage',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { width: '50%' },
                },
                {
                  name: 'playlist',
                  type: 'relationship',
                  relationTo: 'playlists',
                  admin: {
                    width: '50%',
                    description: 'Optional playlist associated with this chart',
                  },
                },
              ],
            },
            {
              name: 'weekRange',
              type: 'group',
              admin: { description: 'Tracking week range for this chart' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'startDate', type: 'date', required: true, admin: { width: '50%' } },
                    { name: 'endDate', type: 'date', required: true, admin: { width: '50%' } },
                  ],
                },
              ],
            },
          ],
        },

        {
          label: 'Chart Entries (Rankings)',
          fields: [
            {
              name: 'entries',
              type: 'array',
              required: true,
              minRows: 1,
              admin: {
                description:
                  'Drag to reorder. Rank, Last Week, Peak, and WOC will auto-calculate on save if a Previous Chart is linked.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'rank', type: 'number', admin: { readOnly: true, width: '15%' } },
                    {
                      name: 'previousRank',
                      type: 'number',
                      label: 'Last Week',
                      admin: { width: '15%' },
                    },
                    { name: 'peakRank', type: 'number', label: 'Peak', admin: { width: '15%' } },
                    {
                      name: 'weeksOnChart',
                      type: 'number',
                      label: 'WOC',
                      admin: { width: '15%' },
                    },
                    {
                      name: 'movement',
                      type: 'select',
                      admin: { width: '20%' },
                      options: [
                        { label: 'Up ↑', value: 'up' },
                        { label: 'Down ↓', value: 'down' },
                        { label: 'Same -', value: 'same' },
                        { label: 'New *', value: 'new' },
                        { label: 'Re-Entry ⟲', value: 're-entry' },
                      ],
                    },
                    {
                      name: 'accolade',
                      type: 'select',
                      defaultValue: 'none',
                      admin: { width: '20%' },
                      options: [
                        { label: 'None', value: 'none' },
                        { label: 'Hot Shot Debut', value: 'hot-shot-debut' },
                        { label: 'Greatest Gainer', value: 'greatest-gainer' },
                        { label: 'Pacesetter', value: 'pacesetter' },
                      ],
                    },
                  ],
                },
                {
                  name: 'manualTrack',
                  label: 'Track Identity',
                  type: 'group',
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'title', type: 'text', required: true, admin: { width: '50%' } },
                        { name: 'artist', type: 'text', required: true, admin: { width: '50%' } },
                      ],
                    },
                    {
                      type: 'row',
                      fields: [
                        { name: 'featuredArtists', type: 'text', admin: { width: '33%' } },
                        { name: 'label', type: 'text', admin: { width: '33%' } },
                        {
                          name: 'isrc',
                          type: 'text',
                          admin: {
                            width: '34%',
                            description: 'Highly recommended for accurate auto-tracking',
                          },
                        },
                      ],
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'artwork',
                          type: 'upload',
                          relationTo: 'media',
                          admin: { width: '50%' },
                        },
                        {
                          name: 'previewUrl',
                          type: 'text',
                          admin: {
                            width: '50%',
                            description: 'Direct URL to a 30s mp3 preview snippet.',
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'editorialNote',
                  type: 'textarea',
                  admin: {
                    description:
                      'Public-facing note (e.g. "Jumping 15 spots after their viral TV performance...")',
                  },
                },
                // Hidden fields for top-level array indexing/display
                { name: 'trackTitle', type: 'text', admin: { hidden: true } },
                { name: 'artist', type: 'text', admin: { hidden: true } },
                { name: 'score', type: 'number', admin: { hidden: true } },
              ],
            },
          ],
        },
      ],
    },

    /* ================= SIDEBAR ================= */

    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Auto-generated chart identifier',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Review', value: 'review' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
    },
    {
      name: 'publishDate',
      type: 'date',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'week',
      type: 'text',
      admin: { position: 'sidebar', description: 'ISO week (e.g. 2026-W05)', readOnly: true },
    },
    {
      name: 'previousChart',
      type: 'relationship',
      relationTo: 'charts',
      admin: {
        position: 'sidebar',
        description:
          "LINK THIS to last week's chart so the system can auto-calculate Peak, Movement, and Weeks on Chart.",
      },
    },
    {
      name: 'chartMode',
      type: 'select',
      required: true,
      defaultValue: 'manual',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Manual', value: 'manual' },
        { label: 'Hybrid', value: 'hybrid' },
        { label: 'Automated', value: 'automated' },
      ],
    },
  ],
}

export default Charts
