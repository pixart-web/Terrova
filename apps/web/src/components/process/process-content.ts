export interface ProcessStep {
  id: string
  index: string
  verb: string
  title: string
  description: string
}

export const processNarrative = {
  index: '04',
  eyebrow: 'Process',
  title: 'We find. We curate. You discover.',
  supportingLine:
    'From Portuguese vineyards to your doorstep, every edition protects the surprise.',
} as const

export const processSteps: readonly ProcessStep[] = [
  {
    id: 'search',
    index: '01',
    verb: 'We search',
    title: 'Beyond the obvious.',
    description: 'We follow Portuguese regions and native grapes that reward curiosity.',
  },
  {
    id: 'curate',
    index: '02',
    verb: 'We curate',
    title: 'One coherent journey.',
    description:
      'Every monthly edition is composed so its wines reveal more when explored together.',
  },
  {
    id: 'deliver',
    index: '03',
    verb: 'We deliver',
    title: 'Discovery, at your door.',
    description:
      'The sealed edition arrives ready to open, with each producer revealed inside the box.',
  },
  {
    id: 'taste',
    index: '04',
    verb: 'You taste',
    title: 'Your map expands.',
    description:
      'Each bottle adds a new place, maker and reference point to your personal wine story.',
  },
] as const
