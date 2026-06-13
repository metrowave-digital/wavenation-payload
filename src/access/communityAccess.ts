import type { Access } from 'payload'

type WaveUser = {
  id?: string | number
  role?: string
  roles?: string[]
  permissions?: string[]
}

export const staffRoles = [
  'admin',
  'super-admin',
  'editor',
  'moderator',
  'community-manager',
  'creator-manager',
]

export function getUserRoles(user: unknown): string[] {
  const typedUser = user as WaveUser | null | undefined

  if (!typedUser) return []

  const roles = new Set<string>()

  if (typedUser.role) roles.add(typedUser.role)

  if (Array.isArray(typedUser.roles)) {
    typedUser.roles.forEach((role) => roles.add(role))
  }

  return Array.from(roles)
}

export function isStaff(user: unknown): boolean {
  return getUserRoles(user).some((role) => staffRoles.includes(role))
}

export const anyone: Access = () => true

export const authenticated: Access = ({ req }) => Boolean(req.user)

export const staffOnly: Access = ({ req }) => isStaff(req.user)

export const staffOrAuthenticated: Access = ({ req }) => Boolean(req.user) || isStaff(req.user)
