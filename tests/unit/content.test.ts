import {
  aggregateTasteProfile,
  normalizeHostname,
  resolveBrandFromRegistry,
} from '../../packages/content/src/index'
import { describe, expect, it } from 'vitest'

const brand = {
  id: 1,
  name: 'Terrova',
  slug: 'terrova',
  locale: 'en-GB',
  currency: 'EUR' as const,
  hostnames: ['terrova.net', 'www.terrova.net'],
}

describe('multi-brand content resolution', () => {
  it('normalizes ports, case and trailing dots', () => {
    expect(normalizeHostname('WWW.TERROVA.NET.:443')).toBe('terrova.net')
  })

  it('resolves known hosts and safely falls back to the configured brand', () => {
    expect(resolveBrandFromRegistry([brand], 'www.terrova.net').resolvedFrom).toBe('hostname')
    expect(resolveBrandFromRegistry([brand], 'preview.invalid', 'terrova').brand.id).toBe(1)
  })
})

describe('transparent taste aggregation', () => {
  it('uses centred ratings and counts unique wines', () => {
    const result = aggregateTasteProfile([
      {
        score: 5,
        wine: {
          id: 1,
          grapeIds: [10],
          grapeNames: ['Encruzado'],
          regionId: 20,
          regionName: 'Dão',
          countryName: 'Portugal',
          style: 'white',
        },
      },
      {
        score: 2,
        wine: {
          id: 2,
          grapeIds: [10],
          grapeNames: ['Encruzado'],
          regionId: 20,
          regionName: 'Dão',
          countryName: 'Portugal',
          style: 'white',
        },
      },
    ])
    expect(result.observedRatings).toBe(2)
    expect(result.observedWines).toBe(2)
    expect(result.preferences.find((signal) => signal.category === 'grape')?.score).toBe(0.5)
    expect(result.suggestedDirections).toContain('Explore more Encruzado')
  })
})
