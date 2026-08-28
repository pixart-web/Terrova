import type { BottleTone } from '../art-direction/temporary-assets'

export interface OriginNarrative {
  id: string
  region: string
  country: string
  coordinates: string
  producer: string
  producerInitials: string
  context: string
  editorialLine: string
  tone: BottleTone
}

export const originJourney: readonly OriginNarrative[] = [
  {
    id: 'douro',
    region: 'Douro',
    country: 'Portugal',
    coordinates: '41.16° N / 7.79° W',
    producer: 'Quinta da Serra Alta',
    producerInitials: 'SA',
    context: 'Schist terraces / field blend / high altitude',
    editorialLine: 'Stone, heat and a river that redraws the horizon.',
    tone: 'terracotta',
  },
  {
    id: 'loire',
    region: 'Loire',
    country: 'France',
    coordinates: '47.38° N / 0.69° E',
    producer: 'Atelier des Rives',
    producerInitials: 'AR',
    context: 'Tuffeau limestone / old vines / cool river air',
    editorialLine: 'A quiet tension held between chalk and water.',
    tone: 'chalk',
  },
  {
    id: 'etna',
    region: 'Etna',
    country: 'Italy',
    coordinates: '37.75° N / 14.99° E',
    producer: 'Vigna del Cratere',
    producerInitials: 'VC',
    context: 'Volcanic sand / Nerello / north slope',
    editorialLine: 'Altitude, ash and red fruit drawn with a fine line.',
    tone: 'wine',
  },
  {
    id: 'priorat',
    region: 'Priorat',
    country: 'Spain',
    coordinates: '41.14° N / 0.82° E',
    producer: 'Celler de la Llicorella',
    producerInitials: 'CL',
    context: 'Llicorella slate / dry farming / steep parcels',
    editorialLine: 'A dark mineral landscape with light at its edges.',
    tone: 'vine',
  },
] as const
