import {
  aggregateTasteProfile,
  normalizeHostname,
  resolveBrandFromRegistry,
} from '../../packages/content/src/index'
import { originJourney } from '../../apps/web/src/components/origins/origins-content'
import { fixtureGrapes, fixtureRegions } from '../../apps/web/src/lib/content/fixtures'
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

describe('Portuguese discovery content', () => {
  it('uses the approved five-region order across the homepage and CMS fallback', () => {
    const expected = ['Douro', 'Alentejo', 'Vinho Verde', 'Dão', 'Bairrada']
    expect(originJourney.map(({ region }) => region)).toEqual(expected)
    expect(fixtureRegions.map(({ name }) => name)).toEqual(expected)
    expect(JSON.stringify({ originJourney, fixtureRegions })).not.toMatch(/Loire|Etna|Priorat/)
  })

  it('publishes only the approved native-grape set and preserves the Aragonez alias', () => {
    expect(fixtureGrapes.map(({ name }) => name)).toEqual([
      'Touriga Nacional',
      'Alvarinho',
      'Arinto',
      'Baga',
      'Aragonez',
    ])
    expect(fixtureGrapes.find(({ name }) => name === 'Aragonez')?.aliases).toEqual(['Tinta Roriz'])
    expect(JSON.stringify(fixtureGrapes)).not.toMatch(/Encruzado/)
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
