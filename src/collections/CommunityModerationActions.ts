import type { CollectionConfig } from 'payload'
import { staffOnly } from '../access/communityAccess'

export const CommunityModerationActions: CollectionConfig = {
  slug: 'community-moderation-actions',
  labels: {
    singular: 'Community Moderation Action',
    plural: 'Community Moderation Actions',
  },
  admin: {
    useAsTitle: 'actionType',
    defaultColumns: ['actionType', 'targetType', 'actor', 'severity', 'createdAt'],
    group: 'Community',
  },
  access: {
    create: staffOnly,
    read: staffOnly,
    update: staffOnly,
    delete: staffOnly,
  },
  timestamps: true,
  fields: [
    {
      name: 'actionType',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'Hide Comment', value: 'hide_comment' },
        { label: 'Remove Comment', value: 'remove_comment' },
        { label: 'Restore Comment', value: 'restore_comment' },
        { label: 'Hide Chat Message', value: 'hide_chat_message' },
        { label: 'Remove Chat Message', value: 'remove_chat_message' },
        { label: 'Restore Chat Message', value: 'restore_chat_message' },
        { label: 'Mute User', value: 'mute_user' },
        { label: 'Ban User', value: 'ban_user' },
        { label: 'Unban User', value: 'unban_user' },
        { label: 'Lock Comment Thread', value: 'lock_comment_thread' },
        { label: 'Unlock Comment Thread', value: 'unlock_comment_thread' },
        { label: 'Lock Chat Channel', value: 'lock_chat_channel' },
        { label: 'Unlock Chat Channel', value: 'unlock_chat_channel' },
        { label: 'Enable Slow Mode', value: 'enable_slow_mode' },
        { label: 'Disable Slow Mode', value: 'disable_slow_mode' },
        { label: 'Warn User', value: 'warn_user' },
        { label: 'Escalate to Editorial', value: 'escalate_editorial' },
        { label: 'Escalate to Legal', value: 'escalate_legal' },
      ],
    },
    {
      name: 'targetType',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'Comment', value: 'comment' },
        { label: 'Comment Thread', value: 'comment_thread' },
        { label: 'Chat Message', value: 'chat_message' },
        { label: 'Chat Channel', value: 'chat_channel' },
        { label: 'User', value: 'user' },
        { label: 'Creator Content', value: 'creator_content' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'actor',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
      admin: {
        description: 'Staff/moderator who performed the action.',
      },
    },
    {
      name: 'targetUser',
      type: 'relationship',
      relationTo: 'users',
      index: true,
    },
    {
      name: 'comment',
      type: 'relationship',
      relationTo: 'comments',
      index: true,
    },
    {
      name: 'commentThread',
      type: 'relationship',
      relationTo: 'comment-threads',
      index: true,
    },
    {
      name: 'chatMessage',
      type: 'relationship',
      relationTo: 'chat-messages',
      index: true,
    },
    {
      name: 'chatChannel',
      type: 'relationship',
      relationTo: 'chat-channels',
      index: true,
    },
    {
      name: 'linkedReport',
      type: 'relationship',
      relationTo: 'community-reports',
      index: true,
    },
    {
      name: 'targetCollection',
      type: 'text',
      admin: {
        description: 'Optional fallback target collection.',
      },
    },
    {
      name: 'targetDocumentId',
      type: 'text',
    },
    {
      name: 'severity',
      type: 'select',
      required: true,
      defaultValue: 'medium',
      index: true,
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
        { label: 'Critical', value: 'critical' },
      ],
    },
    {
      name: 'policyAreas',
      type: 'array',
      fields: [
        {
          name: 'area',
          type: 'select',
          required: true,
          options: [
            { label: 'Spam', value: 'spam' },
            { label: 'Harassment', value: 'harassment' },
            { label: 'Threats or Violence', value: 'threats_violence' },
            { label: 'Hate Speech', value: 'hate_speech' },
            { label: 'Misinformation', value: 'misinformation' },
            { label: 'Private Information', value: 'private_information' },
            { label: 'Sexual Exploitation', value: 'sexual_exploitation' },
            { label: 'Self-Harm', value: 'self_harm' },
            { label: 'Illegal Activity', value: 'illegal_activity' },
            { label: 'Copyright / Plagiarism', value: 'copyright_plagiarism' },
            { label: 'Brand Safety', value: 'brand_safety' },
            { label: 'Other', value: 'other' },
          ],
        },
      ],
    },
    {
      name: 'reason',
      type: 'textarea',
      required: true,
    },
    {
      name: 'internalNotes',
      type: 'textarea',
    },
    {
      name: 'userFacingMessage',
      type: 'textarea',
      admin: {
        description: 'Optional message shown/sent to the user.',
      },
    },
    {
      name: 'notifyUser',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'durationMinutes',
      type: 'number',
      min: 0,
      admin: {
        description: 'Used for temporary mutes/bans. Leave empty for permanent action.',
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      index: true,
    },
  ],
}
