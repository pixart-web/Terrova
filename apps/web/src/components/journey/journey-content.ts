export type PlanCadence = 'monthly' | 'bi_monthly' | 'quarterly'
export type PlanCurrency = 'EUR' | 'GBP' | 'USD'

export interface PlanMoney {
  amount: number
  currency: PlanCurrency
}

export interface PlanPresentation {
  id: string
  code: string
  name: string
  price: PlanMoney
  cadence: PlanCadence
  positioning: string
  description: string
  highlighted: boolean
  highlightLabel?: string
  discoveryAttributes?: readonly string[]
  ctaLabel: string
  ctaHref: string
  tone: 'terracotta' | 'vine' | 'wine'
}

export interface MoneyPresentationOptions {
  locale: string
  currencyPosition: 'prefix' | 'locale'
}

export function formatPlanPrice(
  money: PlanMoney,
  options: MoneyPresentationOptions = { locale: 'pt-PT', currencyPosition: 'prefix' },
) {
  const formatter = new Intl.NumberFormat(options.locale, {
    style: 'currency',
    currency: money.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  if (options.currencyPosition === 'locale') return formatter.format(money.amount)

  const parts = formatter.formatToParts(money.amount)
  const currency = parts.find((part) => part.type === 'currency')?.value ?? money.currency
  const value = parts
    .filter((part) => part.type !== 'currency' && part.type !== 'literal')
    .map((part) => part.value)
    .join('')

  return `${currency}${value}`
}

export const journeyPlans: readonly PlanPresentation[] = [
  {
    id: 'taster',
    code: 'TERROVA_TASTER',
    name: 'Taster',
    price: { amount: 29.99, currency: 'EUR' },
    cadence: 'monthly',
    positioning: 'Start somewhere unexpected.',
    description:
      'An open door into Terrova: a considered monthly encounter with places and makers beyond the familiar.',
    highlighted: false,
    discoveryAttributes: ['Curious beginnings', 'Monthly editorial journey'],
    ctaLabel: 'Choose Taster',
    ctaHref: '/boxes?plan=taster',
    tone: 'terracotta',
  },
  {
    id: 'drinker',
    code: 'TERROVA_DRINKER',
    name: 'Drinker',
    price: { amount: 49.99, currency: 'EUR' },
    cadence: 'monthly',
    positioning: 'Go further.',
    description:
      'The balanced Terrova journey: more room for contrast, context and the bottles that make an edition sing.',
    highlighted: true,
    highlightLabel: 'Most Popular',
    discoveryAttributes: ['The Terrova balance', 'Deeper monthly perspective'],
    ctaLabel: 'Choose Drinker',
    ctaHref: '/boxes?plan=drinker',
    tone: 'vine',
  },
  {
    id: 'premium',
    code: 'TERROVA_PREMIUM',
    name: 'Premium',
    price: { amount: 69.99, currency: 'EUR' },
    cadence: 'monthly',
    positioning: 'Drink something remarkable.',
    description:
      'A rarer point of view, centred on distinctive bottles, singular quality and discoveries with lasting resonance.',
    highlighted: false,
    discoveryAttributes: ['Rarity over quantity', 'Distinctive bottles and makers'],
    ctaLabel: 'Choose Premium',
    ctaHref: '/boxes?plan=premium',
    tone: 'wine',
  },
] as const

export const defaultJourneyPlanId =
  journeyPlans.find((plan) => plan.highlighted)?.id ?? journeyPlans[0].id
