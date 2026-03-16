import type { CollectionBeforeChangeHook } from 'payload'

function getTierScore(tier?: string): number {
  switch (tier) {
    case 'flagship':
      return 300
    case 'featured':
      return 200
    case 'standard':
      return 100
    default:
      return 0
  }
}

function getPlacementScore(placement?: string): number {
  switch (placement) {
    case 'hero':
      return 100
    case 'featured-row':
      return 60
    case 'events-grid':
      return 30
    default:
      return 0
  }
}

export const setHomepagePriority: CollectionBeforeChangeHook = async ({ data, originalDoc }) => {
  if (!data) return data

  const promotionTier = data.promotionTier ?? originalDoc?.promotionTier
  const homepagePlacement = data.homepagePlacement ?? originalDoc?.homepagePlacement
  const isFeatured = data.isFeatured ?? originalDoc?.isFeatured ?? false
  const onAirMention = data.onAirMention ?? originalDoc?.onAirMention ?? false

  let priority = 0

  priority += getTierScore(promotionTier)
  priority += getPlacementScore(homepagePlacement)

  if (isFeatured) priority += 75
  if (onAirMention) priority += 25

  data.homepagePriority = priority

  return data
}
