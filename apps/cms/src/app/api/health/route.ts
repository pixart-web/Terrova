import config from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    await payload.find({ collection: 'brands', limit: 1, depth: 0, overrideAccess: true })
    return Response.json({ status: 'ready', cms: 'ok', database: 'ok' })
  } catch {
    return Response.json(
      { status: 'unavailable', cms: 'error', database: 'error' },
      { status: 503 },
    )
  }
}
