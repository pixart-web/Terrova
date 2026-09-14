import type { BottleTone } from '../art-direction/temporary-assets'

export interface OriginNarrative {
  id: string
  region: string
  country: string
  coordinates: string
  tagline: string
  description: string
  tone: BottleTone
}

export const originJourney: readonly OriginNarrative[] = [
  {
    id: 'douro',
    region: 'Douro',
    country: 'Portugal',
    coordinates: '41.16° N / 7.79° W',
    tagline: 'Steep terraces. Ancient vines. Unmistakable character.',
    description:
      'Carved by the Douro River, this dramatic landscape of schist slopes creates wines with depth, structure and a powerful sense of place.',
    tone: 'terracotta',
  },
  {
    id: 'alentejo',
    region: 'Alentejo',
    country: 'Portugal',
    coordinates: '38.02° N / 7.86° W',
    tagline: 'Wide horizons. Warm days. Generous wines.',
    description:
      'Across sunlit plains and ancient soils, the Alentejo produces expressive wines shaped by Mediterranean warmth, altitude and remarkable local diversity.',
    tone: 'chalk',
  },
  {
    id: 'vinho-verde',
    region: 'Vinho Verde',
    country: 'Portugal',
    coordinates: '41.69° N / 8.83° W',
    tagline: 'Green landscapes shaped by the Atlantic.',
    description:
      "Portugal's northwest is a land of freshness and vibrant native grapes, where cool Atlantic influence gives the wines energy, fragrance and natural acidity.",
    tone: 'wine',
  },
  {
    id: 'dao',
    region: 'Dão',
    country: 'Portugal',
    coordinates: '40.60° N / 7.90° W',
    tagline: 'Mountain vineyards. Granite soils. Quiet elegance.',
    description:
      'Protected by surrounding mountains, the Dão is known for freshness, balance and refined wines shaped by altitude, granite and slow ripening.',
    tone: 'vine',
  },
  {
    id: 'bairrada',
    region: 'Bairrada',
    country: 'Portugal',
    coordinates: '40.43° N / 8.46° W',
    tagline: 'Atlantic air. Limestone soils. Wines built on freshness.',
    description:
      'Between the mountains and the ocean, Bairrada combines cool maritime influence with distinctive native grapes and a long tradition of age-worthy wines and sparkling wine.',
    tone: 'terracotta',
  },
] as const
