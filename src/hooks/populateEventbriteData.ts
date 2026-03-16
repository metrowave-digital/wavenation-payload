import type { CollectionBeforeChangeHook } from 'payload'

export const populateEventbriteData: CollectionBeforeChangeHook = async ({ data, originalDoc }) => {
  if (!data) return data

  const eventbriteEventId = data.eventbriteEventId ?? originalDoc?.eventbriteEventId ?? null

  const eventbriteUrl = data.eventbriteUrl ?? originalDoc?.eventbriteUrl ?? null

  if (typeof eventbriteEventId === 'string') {
    data.eventbriteEventId = eventbriteEventId.trim()
  }

  if (typeof eventbriteUrl === 'string') {
    data.eventbriteUrl = eventbriteUrl.trim()
  }

  if (data.eventbriteSyncEnabled && data.eventbriteEventId) {
    data.eventbriteLastSyncedAt = new Date().toISOString()
  }

  return data
}
