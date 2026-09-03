export const dynamic = 'force-dynamic'

export async function GET() {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 2_000)
  try {
    const cmsURL = process.env.CMS_URL ?? process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3001'
    const cms = await fetch(new URL('/api/brands?limit=1', cmsURL), {
      signal: controller.signal,
      cache: 'no-store',
    })
    return Response.json(
      { status: cms.ok ? 'ready' : 'degraded', web: 'ok', cms: cms.ok ? 'ok' : 'unavailable' },
      { status: cms.ok ? 200 : 503 },
    )
  } catch {
    return Response.json({ status: 'degraded', web: 'ok', cms: 'unavailable' }, { status: 503 })
  } finally {
    clearTimeout(timeout)
  }
}
