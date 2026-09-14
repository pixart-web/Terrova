export interface UnboxNarrative {
  index: string
  eyebrow: string
  title: string
  supportingCopy: string
  edition: string
  bottleEditions: readonly [string, string, string]
  variationNote: string
}

export const unboxNarrative: UnboxNarrative = {
  index: '02',
  eyebrow: 'Unbox',
  title: 'A new discovery, every month.',
  supportingCopy:
    'We curate Portuguese wines beyond familiar labels. The bottles and their makers are revealed only as you unbox them.',
  edition: 'Edition 01 / Portuguese discovery',
  bottleEditions: ['Bottle 01', 'Bottle 02', 'Bottle 03'],
  variationNote: 'A sealed selection. One changing point of view.',
}
