import { timingSafeEqual } from 'node:crypto'
import type { Access } from 'payload'

function hasServiceToken(req: Parameters<Access>[0]['req']) {
  const configured = process.env.CMS_SERVICE_TOKEN
  const supplied = req.headers.get('x-terrova-service-token')
  if (!configured || !supplied) return false
  const configuredBytes = Buffer.from(configured)
  const suppliedBytes = Buffer.from(supplied)
  return (
    configuredBytes.length === suppliedBytes.length &&
    timingSafeEqual(configuredBytes, suppliedBytes)
  )
}

export const isAdminOrService = (req: Parameters<Access>[0]['req']) =>
  req.user?.collection === 'users' || hasServiceToken(req)

export const authenticated: Access = ({ req }) => Boolean(req.user) || hasServiceToken(req)
export const adminOnly: Access = ({ req }) => isAdminOrService(req)
export const publicRead: Access = () => true

export const liveOrAdmin: Access = ({ req }) =>
  isAdminOrService(req) ? true : { status: { equals: 'live' } }

export const activeOrAdmin: Access = ({ req }) =>
  isAdminOrService(req) ? true : { active: { equals: true } }

export const readyOrAdmin: Access = ({ req }) =>
  isAdminOrService(req) ? true : { status: { equals: 'ready' } }

export const ownCustomerRecord: Access = ({ req }) => {
  if (isAdminOrService(req)) return true
  if (req.user?.collection !== 'customers') return false
  return { id: { equals: req.user.id } }
}

export const ownCustomerRelation: Access = ({ req }) => {
  if (isAdminOrService(req)) return true
  if (req.user?.collection !== 'customers') return false
  return { customer: { equals: req.user.id } }
}

export const customerMutation: Access = ({ req }) =>
  isAdminOrService(req) || req.user?.collection === 'customers'

export const editorialAccess = {
  read: publicRead,
  create: adminOnly,
  update: adminOnly,
  delete: adminOnly,
} as const
