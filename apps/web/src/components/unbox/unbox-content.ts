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
    'We search beyond familiar labels to assemble a changing selection of wines worth discovering.',
  edition: 'Edition 01 / Atlantic edge',
  bottleEditions: ['Bottle 01', 'Bottle 02', 'Bottle 03'],
  variationNote: 'Three bottles. One changing point of view.',
}
