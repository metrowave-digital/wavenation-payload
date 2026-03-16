import type { CollectionBeforeChangeHook } from 'payload'

type EventStatus = 'draft' | 'scheduled' | 'live' | 'ended'

export const setEventStatus: CollectionBeforeChangeHook = async ({ data, originalDoc }) => {
  if (!data) return data

  const now = new Date()

  const startDateRaw = data.startDate ?? originalDoc?.startDate
  const endDateRaw = data.endDate ?? originalDoc?.endDate

  const startDate = startDateRaw ? new Date(startDateRaw) : null
  const endDate = endDateRaw ? new Date(endDateRaw) : null

  const existingStatus = (data.status ?? originalDoc?.status ?? 'draft') as EventStatus

  if (!startDate || !endDate) {
    data.status = existingStatus
    return data
  }

  if (existingStatus === 'draft' && data._status === 'draft') {
    data.status = 'draft'
    return data
  }

  if (now < startDate) {
    data.status = 'scheduled'
    return data
  }

  if (now >= startDate && now <= endDate) {
    data.status = 'live'
    return data
  }

  if (now > endDate) {
    data.status = 'ended'
    return data
  }

  return data
}
