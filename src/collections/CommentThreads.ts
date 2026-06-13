import type { CollectionConfig } from 'payload'
import { anyone, staffOnly } from '../access/communityAccess'

export const CommentThreads: CollectionConfig = {
  slug: 'comment-threads',
  labels: {
    singular: 'Comment Thread',
    plural: 'Comment Threads',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'targetCollection', 'status', 'commentCount', 'lastCommentAt'],
    group: 'Community',
  },
  access: {
    create: staffOnly,
    read: anyone,
    update: staffOnly,
    delete: staffOnly,
  },
  timestamps: true,
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'targetCollection',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'Article', value: 'articles' },
        { label: 'News Article', value: 'news' },
        { label: 'Artist Spotlight', value: 'artist-spotlights' },
        { label: 'Event', value: 'events' },
        { label: 'Show', value: 'shows' },
        { label: 'Episode', value: 'episodes' },
        { label: 'Video', value: 'videos' },
        { label: 'Playlist', value: 'playlists' },
        { label: 'Creator', value: 'creators' },
        { label: 'Creator Profile', value: 'creator-profiles' },
        { label: 'Custom', value: 'custom' },
      ],
    },
    {
      name: 'targetDocumentId',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'The ID of the article, event, episode, playlist, creator, or custom target.',
      },
    },
    {
      name: 'targetSlug',
      type: 'text',
      index: true,
    },
    {
      name: 'targetTitle',
      type: 'text',
    },
    {
      name: 'canonicalUrl',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'open',
      index: true,
      options: [
        { label: 'Open', value: 'open' },
        { label: 'Closed', value: 'closed' },
        { label: 'Locked', value: 'locked' },
        { label: 'Hidden', value: 'hidden' },
        { label: 'Archived', value: 'archived' },
      ],
    },
    {
      name: 'visibility',
      type: 'select',
      required: true,
      defaultValue: 'public',
      index: true,
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Logged-In Users Only', value: 'authenticated' },
        { label: 'Subscribers Only', value: 'subscribers' },
        { label: 'WaveNation+ Only', value: 'plus' },
        { label: 'Staff Only', value: 'staff-only' },
      ],
    },
    {
      name: 'moderationMode',
      type: 'select',
      required: true,
      defaultValue: 'post-moderation',
      options: [
        { label: 'Post Moderation', value: 'post-moderation' },
        { label: 'Pre Moderation', value: 'pre-moderation' },
        { label: 'Staff Only', value: 'staff-only' },
        { label: 'Locked', value: 'locked' },
      ],
    },
    {
      name: 'sortMode',
      type: 'select',
      defaultValue: 'newest',
      options: [
        { label: 'Newest First', value: 'newest' },
        { label: 'Oldest First', value: 'oldest' },
        { label: 'Top Comments', value: 'top' },
        { label: 'Editorial Picks', value: 'editorial-picks' },
      ],
    },
    {
      name: 'allowReplies',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'allowReactions',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'allowMedia',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'requireLogin',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Recommended for WaveNation to reduce spam and abuse.',
      },
    },
    {
      name: 'pinnedComment',
      type: 'relationship',
      relationTo: 'comments',
    },
    {
      name: 'commentCount',
      type: 'number',
      defaultValue: 0,
      min: 0,
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'reactionCount',
      type: 'number',
      defaultValue: 0,
      min: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'reportCount',
      type: 'number',
      defaultValue: 0,
      min: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'lastCommentAt',
      type: 'date',
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'lockedReason',
      type: 'textarea',
    },
  ],
}
