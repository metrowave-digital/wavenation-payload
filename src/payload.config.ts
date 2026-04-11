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
import { Subscriptions } from './collections/Subscriptions'

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

// Media & Audio
import { Media } from './collections/Media'
import { MediaTracks } from './collections/MediaTracks'
import { Albums } from './collections/Albums'
import { Playlists } from './collections/Playlists'
import { Podcasts } from './collections/Podcasts'
import { Episodes } from './collections/Episodes'

// Video, TV & Radio
import { VOD } from './collections/VOD'
import { Seasons } from './collections/Seasons'
import { TVShows } from './collections/TVShows'
import { TVSchedule } from './collections/TVSchedule'
import { RadioShows } from './collections/RadioShows'
import { RadioSchedule } from './collections/RadioSchedule'

// Charts & Engagement
import { Charts } from './collections/Charts'
import { ChartSnapshots } from './collections/ChartSnapshots'
import { Polls } from './collections/Polls'
import { PollVotes } from './collections/PollVotes'

// Events & Talent
import { Events } from './collections/Events'
import { Venues } from './collections/Venues'
import { Talent } from './collections/Talent'
import { Moderators } from './collections/Moderators'
import { EventQuestions } from './collections/EventQuestions'
import { EventChatMessages } from './collections/EventChatMessages'

// Monetization, Ads & Marketing
import { Sponsors } from './collections/Sponsors'
import { Ads } from './collections/Ads'
import { AdZones } from './collections/AdZones'
import { PromoBanners } from './collections/PromoBanners'
import { Alerts } from './collections/Alerts'

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
    Subscriptions,

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

    /* ===== MEDIA & AUDIO ===== */
    Media,
    MediaTracks,
    Albums,
    Playlists,
    Podcasts,
    Episodes,

    /* ===== VIDEO & BROADCAST ===== */
    VOD,
    Seasons,
    TVShows,
    TVSchedule,
    RadioShows,
    RadioSchedule,

    /* ===== CHARTS & ENGAGEMENT ===== */
    Charts,
    ChartSnapshots,
    Polls,
    PollVotes,

    /* ===== EVENTS & TALENT ===== */
    Events,
    Venues,
    Talent,
    Moderators,
    EventQuestions,
    EventChatMessages,

    /* ===== MONETIZATION & ADS ===== */
    Sponsors,
    Ads,
    AdZones,

    /* ===== UI & MARKETING ===== */
    PromoBanners,
    Alerts,
    Sidebars,
  ],

  globals: [SiteSettings, NavConfig, FooterConfig, NewsTickerSettings, Homepage, EventSettings],

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
