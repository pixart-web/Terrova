import type {
  TasteProfile,
  TasteSignalCategory,
  TasteSignalScore,
  WineIdentity,
} from '@terrova/types'

export interface TasteObservation {
  score: number
  wine: Pick<
    WineIdentity,
    'id' | 'grapeIds' | 'grapeNames' | 'regionId' | 'regionName' | 'countryName' | 'style'
  >
}

interface Aggregate {
  category: TasteSignalCategory
  key: string
  label: string
  total: number
  observations: number
}

export function aggregateTasteProfile(observations: TasteObservation[]): TasteProfile {
  const aggregates = new Map<string, Aggregate>()

  const add = (category: TasteSignalCategory, key: string | number | undefined, label?: string) => {
    if (key === undefined || !label) return
    const mapKey = `${category}:${key}`
    const current = aggregates.get(mapKey) ?? {
      category,
      key: String(key),
      label,
      total: 0,
      observations: 0,
    }
    return { mapKey, current }
  }

  observations.forEach(({ score, wine }) => {
    const centredScore = Math.max(-2, Math.min(2, score - 3))
    const entries = [
      ...wine.grapeIds.map((grape, index) => add('grape', grape, wine.grapeNames?.[index])),
      add('region', wine.regionId, wine.regionName),
      add('country', wine.countryName?.toLowerCase(), wine.countryName),
      add('style', wine.style, wine.style),
    ].filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))

    entries.forEach(({ mapKey, current }) => {
      current.total += centredScore
      current.observations += 1
      aggregates.set(mapKey, current)
    })
  })

  const preferences: TasteSignalScore[] = [...aggregates.values()]
    .map(({ total, ...entry }) => ({
      ...entry,
      score: Math.round((total / entry.observations) * 100) / 100,
    }))
    .sort((left, right) => right.score - left.score || right.observations - left.observations)

  return {
    observedRatings: observations.length,
    observedWines: new Set(observations.map(({ wine }) => String(wine.id))).size,
    preferences,
    suggestedDirections: preferences
      .filter(({ score }) => score > 0)
      .slice(0, 3)
      .map(({ label }) => `Explore more ${label}`),
  }
}
