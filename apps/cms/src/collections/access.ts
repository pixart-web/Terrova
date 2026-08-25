import type { Access } from 'payload'

export const authenticated: Access = ({ req }) => Boolean(req.user)
export const publicRead: Access = () => true

export const editorialAccess = {
  read: publicRead,
  create: authenticated,
  update: authenticated,
  delete: authenticated,
} as const
