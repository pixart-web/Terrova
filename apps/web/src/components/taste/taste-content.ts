export type TasteSignalCategory = 'place' | 'grape' | 'style' | 'memory'
export type TasteSentiment = 'enjoyed' | 'curious' | 'saved'
export type TasteSignalWeight = 'quiet' | 'supporting' | 'primary'

export interface TasteSignal {
  id: string
  index: string
  category: TasteSignalCategory
  label: string
  value: string
  region?: string
  country?: string
  grape?: string
  style?: string
  sentiment: TasteSentiment
  displayWeight: TasteSignalWeight
  position: Readonly<{ x: number; y: number }>
}

export const tasteNarrative = {
  index: '06',
  eyebrow: 'Your taste',
  title: 'Every bottle you try teaches us something about your taste.',
  supportingLine:
    'Your discoveries build a richer picture of what you enjoy — and what you may want to discover next.',
  profileLabel: 'A future Wine Profile',
  profileCopy:
    'Over time, places explored, styles enjoyed and bottles saved can become a personal memory of your wine journey.',
  boundaryNote:
    'Wine Profile is a product direction, not a live rating or recommendation system today.',
} as const

export const tasteSignals: readonly TasteSignal[] = [
  {
    id: 'volcanic-energy',
    index: '01',
    category: 'style',
    label: 'A style enjoyed',
    value: 'Volcanic energy',
    region: 'Etna',
    country: 'Italy',
    style: 'Lifted red',
    sentiment: 'enjoyed',
    displayWeight: 'primary',
    position: { x: 48, y: 38 },
  },
  {
    id: 'atlantic-edge',
    index: '02',
    category: 'place',
    label: 'A place revisited',
    value: 'Atlantic edges',
    region: 'Vinho Verde',
    country: 'Portugal',
    style: 'Coastal white',
    sentiment: 'curious',
    displayWeight: 'supporting',
    position: { x: 23, y: 62 },
  },
  {
    id: 'touriga-franca',
    index: '03',
    category: 'grape',
    label: 'A grape remembered',
    value: 'Touriga Franca',
    region: 'Douro',
    country: 'Portugal',
    grape: 'Touriga Franca',
    sentiment: 'saved',
    displayWeight: 'supporting',
    position: { x: 76, y: 65 },
  },
  {
    id: 'cellar-thread',
    index: '04',
    category: 'memory',
    label: 'A thread saved',
    value: 'Mineral · savoury · bright',
    sentiment: 'saved',
    displayWeight: 'quiet',
    position: { x: 65, y: 24 },
  },
] as const
