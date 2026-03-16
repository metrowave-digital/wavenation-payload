import type { CollectionBeforeValidateHook } from 'payload'

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const formatSlug: CollectionBeforeValidateHook = async ({
  data,
  operation,
  originalDoc,
}) => {
  if (!data) return data

  if (typeof data.slug === 'string' && data.slug.trim().length > 0) {
    data.slug = slugify(data.slug)
    return data
  }

  if (typeof data.title === 'string' && data.title.trim().length > 0) {
    data.slug = slugify(data.title)
    return data
  }

  if (operation === 'update' && !data.slug && !data.title && originalDoc?.title) {
    data.slug = slugify(originalDoc.title)
  }

  return data
}
