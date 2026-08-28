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
  supportingLine: 'From vineyard to doorstep, every edition is built around discovery.',
} as const

export const processSteps: readonly ProcessStep[] = [
  {
    id: 'search',
    index: '01',
    verb: 'We search',
    title: 'Beyond the obvious.',
    description: 'We follow growers, regions and bottles that reward curiosity, not familiarity.',
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
      'The edition arrives ready to open, pour and share — with its story close at hand.',
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
