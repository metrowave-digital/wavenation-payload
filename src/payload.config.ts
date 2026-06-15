import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

/* ======================================================
   COLLECTION IMPORTS
====================================================== */

// System & Users
import { Users } from './collections/Users'
import { PayloadPreferences } from './collections/PayloadPreferences'

// Editorial & Content
import { Articles } from './collections/Articles'
import { ArticleSeries } from './collections/ArticleSeries'
import { Authors } from './collections/Authors'
import { Curators } from './collections/Curators'

// Taxonomy
import { Categories } from './collections/Categories'
import { Subcategories } from './collections/Subcategories'
import { Tags } from './collections/Tags'
import { Moods } from './collections/Moods'
import { Topics } from './collections/Topics'
import { Genres } from './collections/Genres'

// Media & Audio
import { Media } from './collections/Media'
import { MediaTracks } from './collections/MediaTracks'
import { Tracks } from './collections/Tracks'
import { Albums } from './collections/Albums'
import { Playlists } from './collections/Playlists'
import { PlaylistSections } from './collections/PlaylistSections'
import { Podcasts } from './collections/Podcasts'
import { Episodes } from './collections/Episodes'
import { ReleaseHighlights } from './collections/ReleaseHighlights'

// Video, TV & Radio
import { VOD } from './collections/VOD'
import { Seasons } from './collections/Seasons'
import { TVShows } from './collections/TVShows'
import { TVSchedule } from './collections/TVSchedule'
import { RadioShows } from './collections/RadioShows'
import { RadioSchedule } from './collections/RadioSchedule'

// Charts & Engagement
import { Charts } from './collections/Charts'
import { ChartEntries } from './collections/ChartEntries'
import { ChartSnapshots } from './collections/ChartSnapshots'
import { Polls } from './collections/Polls'
import { PollVotes } from './collections/PollVotes'

// Monetization, Ads & Marketing
import { Sponsors } from './collections/Sponsors'
import { Ads } from './collections/Ads'
import { SubscriptionPlans } from './collections/SubscriptionPlans'
import { MembershipBenefits } from './collections/MembershipBenefits'
import { SponsorCampaigns } from './collections/SponsorCampaigns'
import { AdPlacements } from './collections/AdPlacements'
import { PromoBanners } from './collections/PromoBanners'
import { OfferCampaigns } from './collections/OfferCampaigns'
import { Alerts } from './collections/Alerts'

// Newsletters
import Newsletters from './collections/Newsletters'
import NewsletterIssues from './collections/NewsletterIssues'
import NewsletterSubscribers from './collections/NewsletterSubscribers'

// Events & Live Activations
import { Events } from './collections/Events'
import { EventCategories } from './collections/EventCategories'
import { Venues } from './collections/Venues'
import { TicketLinks } from './collections/TicketLinks'
import { EventRecaps } from './collections/EventRecaps'
import { Talent } from './collections/Talent'
import { Moderators } from './collections/Moderators'
import { EventQuestions } from './collections/EventQuestions'
import { EventChatMessages } from './collections/EventChatMessages'

// Creator Hub
import { Creators } from './collections/Creators'
import { CreatorProfiles } from './collections/CreatorProfiles'
import { CreatorSubmissions } from './collections/CreatorSubmissions'
import { CreatorAssets } from './collections/CreatorAssets'
import { CreatorApprovals } from './collections/CreatorApprovals'
import { CreatorAgreements } from './collections/CreatorAgreements'

// Rights, Legal & Moderation
import { RightsRecords } from './collections/RightsRecords'
import { ContentFlags } from './collections/ContentFlags'
import { ModerationActions } from './collections/ModerationActions'
import { AuditEntries } from './collections/AuditEntries'
import { LegalDocuments } from './collections/LegalDocuments'
import { ReleaseForms } from './collections/ReleaseForms'

// Chat
import { ChatChannels } from './collections/ChatChannels'
import { ChatMembers } from './collections/ChatMembers'
import { ChatMessages } from './collections/ChatMessages'
import { ChatMessageReactions } from './collections/ChatMessageReactions'
import { ChatMessageReadReceipts } from './collections/ChatMessageReadReceipts'
import { ChatInvites } from './collections/ChatInvites'
import { UserBlocks } from './collections/UserBlocks'

// Comments
import { CommentThreads } from './collections/CommentThreads'
import { Comments } from './collections/Comments'
import { CommentReactions } from './collections/CommentReactions'
import { CommentSubscriptions } from './collections/CommentSubscriptions'

// Community & Moderation
import { CommunityReports } from './collections/CommunityReports'
import { CommunityModerationActions } from './collections/CommunityModerationActions'

// UI & Layouts
import { Sidebars } from './collections/Sidebars'

/* ======================================================
   GLOBAL IMPORTS
====================================================== */

import { SiteSettings } from './globals/SiteSettings'
import { NavConfig } from './globals/NavConfig'
import { FooterConfig } from './globals/FooterConfig'
import { NewsTickerSettings } from './globals/NewsTickerSettings'
import { Homepage } from './globals/Homepage'
import { EventSettings } from './globals/EventSettings'
import { DynamicTicker } from './globals/DynamicTicker'

/* ======================================================
   PATH HELPERS
====================================================== */

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/* ======================================================
   ENV HELPERS
====================================================== */

const isProduction = process.env.NODE_ENV === 'production'

const stripTrailingSlash = (value?: string | null) => value?.replace(/\/$/, '') || undefined

const serverURL =
  stripTrailingSlash(process.env.PAYLOAD_PUBLIC_SERVER_URL) ||
  stripTrailingSlash(process.env.PAYLOAD_SERVER_URL) ||
  'http://localhost:3000'

const frontendURL =
  stripTrailingSlash(process.env.FRONTEND_URL) ||
  stripTrailingSlash(process.env.NEXT_PUBLIC_WEB_URL) ||
  'http://localhost:3000'

const databaseURL = process.env.DATABASE_URL
const payloadSecret = process.env.PAYLOAD_SECRET

if (!databaseURL) {
  throw new Error(
    'DATABASE_URL is required. Add your Neon Postgres connection string in Render and your local .env file.',
  )
}

if (!payloadSecret) {
  throw new Error(
    'PAYLOAD_SECRET is required. Add a long random secret in Render and your local .env file.',
  )
}

const allowedOrigins = Array.from(
  new Set(
    [
      serverURL,
      frontendURL,
      process.env.NEXT_PUBLIC_WEB_URL,
      process.env.PAYLOAD_PUBLIC_SERVER_URL,
      process.env.PAYLOAD_SERVER_URL,
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
    ]
      .map(stripTrailingSlash)
      .filter(Boolean) as string[],
  ),
)

/* ======================================================
   S3 / R2 ENV
====================================================== */

const s3Bucket = process.env.S3_BUCKET || process.env.R2_BUCKET || ''
const s3Endpoint = process.env.S3_ENDPOINT || process.env.R2_ENDPOINT
const s3Region = process.env.S3_REGION || process.env.R2_REGION || 'auto'
const s3AccessKeyId = process.env.S3_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID || ''
const s3SecretAccessKey = process.env.S3_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY || ''
const s3PublicURL = stripTrailingSlash(process.env.S3_PUBLIC_URL || process.env.R2_PUBLIC_URL)

const hasS3Storage =
  Boolean(s3Bucket) && Boolean(s3Endpoint) && Boolean(s3AccessKeyId) && Boolean(s3SecretAccessKey)

if (isProduction && !hasS3Storage) {
  console.warn(
    'S3/R2 storage is not fully configured. Media uploads will use local storage unless all S3/R2 env vars are set.',
  )
}

/* ======================================================
   PAYLOAD CONFIG
====================================================== */

export default buildConfig({
  serverURL,

  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  cors: allowedOrigins,
  csrf: allowedOrigins,

  collections: [
    /* ===== SYSTEM & USERS ===== */
    Users,
    PayloadPreferences,

    /* ===== EDITORIAL ===== */
    Articles,
    ArticleSeries,
    Authors,
    Curators,

    /* ===== TAXONOMY ===== */
    Categories,
    Subcategories,
    Tags,
    Moods,
    Topics,
    Genres,

    /* ===== NEWSLETTERS ===== */
    Newsletters,
    NewsletterIssues,
    NewsletterSubscribers,

    /* ===== MEDIA & AUDIO ===== */
    Media,
    MediaTracks,
    Tracks,
    Albums,
    Playlists,
    PlaylistSections,
    Podcasts,
    Episodes,
    ReleaseHighlights,

    /* ===== VIDEO & BROADCAST ===== */
    VOD,
    Seasons,
    TVShows,
    TVSchedule,
    RadioShows,
    RadioSchedule,

    /* ===== CHARTS & ENGAGEMENT ===== */
    Charts,
    ChartEntries,
    ChartSnapshots,
    Polls,
    PollVotes,

    /* ===== EVENTS & TALENT ===== */
    Events,
    EventCategories,
    Venues,
    TicketLinks,
    EventRecaps,
    Talent,
    Moderators,
    EventQuestions,
    EventChatMessages,

    /* ===== MONETIZATION, ADS & MARKETING ===== */
    Sponsors,
    Ads,
    SubscriptionPlans,
    MembershipBenefits,
    SponsorCampaigns,
    AdPlacements,
    PromoBanners,
    OfferCampaigns,
    Alerts,

    /* ===== CREATOR HUB ===== */
    Creators,
    CreatorProfiles,
    CreatorSubmissions,
    CreatorAssets,
    CreatorApprovals,
    CreatorAgreements,

    /* ===== RIGHTS, LEGAL & MODERATION ===== */
    RightsRecords,
    ContentFlags,
    ModerationActions,
    AuditEntries,
    LegalDocuments,
    ReleaseForms,

    /* ===== CHAT ===== */
    ChatChannels,
    ChatMembers,
    ChatMessages,
    ChatMessageReactions,
    ChatMessageReadReceipts,
    ChatInvites,
    UserBlocks,

    /* ===== COMMENTS ===== */
    CommentThreads,
    Comments,
    CommentReactions,
    CommentSubscriptions,

    /* ===== COMMUNITY & MODERATION ===== */
    CommunityReports,
    CommunityModerationActions,

    /* ===== UI & LAYOUTS ===== */
    Sidebars,
  ],

  globals: [
    SiteSettings,
    NavConfig,
    FooterConfig,
    NewsTickerSettings,
    Homepage,
    EventSettings,
    DynamicTicker,
  ],

  editor: lexicalEditor(),

  secret: payloadSecret,

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  graphQL: {
    disable: false,
    schemaOutputFile: path.resolve(dirname, 'schema.graphql'),
    disablePlaygroundInProduction: true,
    maxComplexity: 1000,
  },

  db: postgresAdapter({
    pool: {
      connectionString: databaseURL,
    },
  }),

  sharp,

  plugins: [
    s3Storage({
      enabled: hasS3Storage,

      collections: {
        [Media.slug]: {
          prefix: 'media',

          ...(s3PublicURL
            ? {
                disablePayloadAccessControl: true,
                generateFileURL: ({ filename, prefix }: { filename: string; prefix?: string }) => {
                  const key = prefix ? `${prefix}/${filename}` : filename
                  return `${s3PublicURL}/${key}`
                },
              }
            : {}),
        },
      },

      bucket: s3Bucket,

      config: {
        endpoint: s3Endpoint,
        region: s3Region,
        credentials: {
          accessKeyId: s3AccessKeyId,
          secretAccessKey: s3SecretAccessKey,
        },
        forcePathStyle: process.env.S3_FORCE_PATH_STYLE
          ? process.env.S3_FORCE_PATH_STYLE === 'true'
          : true,
      },
    }),
  ],
})
