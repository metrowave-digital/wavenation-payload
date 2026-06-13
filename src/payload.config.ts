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
   ENV
====================================================== */

const serverURL = process.env.PAYLOAD_PUBLIC_SERVER_URL || ''

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

  secret: process.env.PAYLOAD_SECRET || '',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),

  sharp,

  /* ======================================================
     R2 / S3 STORAGE (Cloudflare R2 Compatible)
  ====================================================== */

  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: 'media',
        },
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION || 'auto',
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
      },
    }),
  ],
})
