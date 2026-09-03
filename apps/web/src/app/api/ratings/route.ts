import { NextResponse } from 'next/server'

import { aggregateTasteProfile, type TasteObservation } from '@terrova/content'
import type { EntityID, WineIdentity, WineStyle } from '@terrova/types'

import { getCurrentCustomer, sessionToken } from '@/lib/auth/session'
import { cmsRequest, type PayloadList } from '@/lib/cms'
import { assertSameOrigin, cleanText, requestData } from '@/lib/security'
import { analyticsConsent, captureEvent } from '@/lib/services/analytics'

type Document = Record<string, unknown> & { id: EntityID }

function relation(value: unknown): Document | undefined {
  return value && typeof value === 'object' && 'id' in value ? (value as Document) : undefined
}

function relationID(value: unknown): EntityID {
  return relation(value)?.id ?? (value as EntityID)
}

function observation(rating: Document): TasteObservation | null {
  const wine = relation(rating.wine)
  if (!wine) return null
  const grapes = Array.isArray(wine.grapes) ? wine.grapes : []
  return {
    score: Number(rating.score),
    wine: {
      id: wine.id,
      grapeIds: grapes.map(relationID),
      grapeNames: grapes.map((grape) => String(relation(grape)?.name ?? '')).filter(Boolean),
      regionId: relationID(wine.region),
      regionName: String(relation(wine.region)?.name ?? '') || undefined,
      countryName: String(relation(wine.country)?.name ?? '') || undefined,
      style: String(wine.style ?? '') ? (wine.style as WineStyle) : undefined,
    } satisfies Pick<
      WineIdentity,
      'id' | 'grapeIds' | 'grapeNames' | 'regionId' | 'regionName' | 'countryName' | 'style'
    >,
  }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request)
    const [customer, token] = await Promise.all([getCurrentCustomer(), sessionToken()])
    if (!customer || !token) return NextResponse.redirect(new URL('/account', request.url), 303)
    const data = await requestData(request)
    const cellarEntryId = cleanText(data.cellarEntryId, 80)
    const wineId = cleanText(data.wineId, 80)
    const score = Number(data.score)
    if (!cellarEntryId || !wineId || !Number.isInteger(score) || score < 1 || score > 5) {
      throw new Error('Invalid rating')
    }

    const cellar = await cmsRequest<PayloadList<Document>>(
      `/api/cellar-entries?depth=1&limit=1&where[id][equals]=${encodeURIComponent(cellarEntryId)}`,
      { token, cache: 'no-store' },
    )
    if (!cellar.docs.some((entry) => String(relationID(entry.wine)) === wineId)) {
      throw new Error('Wine is not in this customer cellar')
    }

    const existing = await cmsRequest<PayloadList<Document>>(
      `/api/ratings?depth=0&limit=1&where[wine][equals]=${encodeURIComponent(wineId)}`,
      { token, cache: 'no-store' },
    )
    await cmsRequest(existing.docs[0] ? `/api/ratings/${existing.docs[0].id}` : '/api/ratings', {
      token,
      method: existing.docs[0] ? 'PATCH' : 'POST',
      body: JSON.stringify({
        customer: customer.id,
        brand: customer.brandId,
        wine: wineId,
        cellarEntry: cellarEntryId,
        score,
      }),
    })

    const ratings = await cmsRequest<PayloadList<Document>>('/api/ratings?depth=3&limit=250', {
      token,
      cache: 'no-store',
    })
    const profile = aggregateTasteProfile(
      ratings.docs.map(observation).filter((item): item is TasteObservation => Boolean(item)),
    )
    const existingSignals = await cmsRequest<PayloadList<Document>>(
      `/api/taste-signals?depth=0&limit=250&where[customer][equals]=${encodeURIComponent(String(customer.id))}`,
      { service: true, cache: 'no-store' },
    )
    await Promise.all(
      profile.preferences.map((signal) => {
        const persisted = existingSignals.docs.find(
          (item) => item.category === signal.category && item.key === signal.key,
        )
        return cmsRequest(persisted ? `/api/taste-signals/${persisted.id}` : '/api/taste-signals', {
          service: true,
          method: persisted ? 'PATCH' : 'POST',
          body: JSON.stringify({
            customer: customer.id,
            brand: customer.brandId,
            ...signal,
            calculatedAt: new Date().toISOString(),
          }),
        })
      }),
    )
    if (analyticsConsent(request)) {
      await captureEvent('rating_submitted', { brand: String(customer.brandId), score })
    }
    return NextResponse.redirect(new URL('/account?rating=saved', request.url), 303)
  } catch {
    return NextResponse.redirect(new URL('/account?error=rating', request.url), 303)
  }
}
