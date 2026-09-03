import type {
  BoxSummary,
  BrandIdentity,
  EditorialPageContent,
  JournalEntry,
  ProducerSummary,
  SiteSettings,
  SubscriptionPlan,
  WineIdentity,
} from '@terrova/types'

export const fixtureBrand: BrandIdentity = {
  id: 'terrova-fixture',
  slug: 'terrova',
  name: 'Terrova',
  hostnames: ['terrova.net', 'localhost', '127.0.0.1'],
  locale: 'en-GB',
  currency: 'EUR',
}

export const fixturePlans: SubscriptionPlan[] = [
  {
    id: 'plan-taster',
    brandId: fixtureBrand.id,
    code: 'taster',
    name: 'Taster',
    positioning: 'Start somewhere unexpected.',
    description: 'A first monthly rhythm for curious drinkers.',
    cadence: 'monthly',
    price: { amount: 2999, currency: 'EUR' },
    externalPriceId: 'price_test_terrova_taster',
    active: true,
  },
  {
    id: 'plan-drinker',
    brandId: fixtureBrand.id,
    code: 'drinker',
    name: 'Drinker',
    positioning: 'Go further.',
    description: 'The balanced Terrova journey: more room for contrast, context and discovery.',
    cadence: 'monthly',
    price: { amount: 4999, currency: 'EUR' },
    mostPopular: true,
    externalPriceId: 'price_test_terrova_drinker',
    active: true,
  },
  {
    id: 'plan-premium',
    brandId: fixtureBrand.id,
    code: 'premium',
    name: 'Premium',
    positioning: 'Drink something remarkable.',
    description:
      'Distinctive bottles selected for rarity, precision and a compelling sense of place.',
    cadence: 'monthly',
    price: { amount: 6999, currency: 'EUR' },
    externalPriceId: 'price_test_terrova_premium',
    active: true,
  },
]

export const fixtureProducers: ProducerSummary[] = [
  {
    id: 'producer-1',
    slug: 'casa-do-vale',
    name: 'Casa do Vale',
    region: 'Douro',
    country: 'Portugal',
    introduction: 'High parcels, old vines and a patient reading of schist.',
  },
  {
    id: 'producer-2',
    slug: 'atelier-des-rives',
    name: 'Atelier des Rives',
    region: 'Loire',
    country: 'France',
    introduction: 'A small cellar shaped by limestone, river air and quiet precision.',
  },
  {
    id: 'producer-3',
    slug: 'etna-nord',
    name: 'Etna Nord',
    region: 'Etna',
    country: 'Italy',
    introduction: 'Volcanic altitude translated into lifted, mineral reds.',
  },
]

export const fixtureWines: WineIdentity[] = [
  {
    id: 'wine-1',
    brandId: fixtureBrand.id,
    slug: 'linha-de-xisto',
    name: 'Linha de Xisto',
    producerId: fixtureProducers[0].id,
    producerName: fixtureProducers[0].name,
    regionId: 'douro',
    regionName: 'Douro',
    countryName: 'Portugal',
    grapeIds: ['touriga-franca'],
    grapeNames: ['Touriga Franca'],
    vintage: 2022,
    style: 'red',
    introduction: 'Savoury red fruit, mountain herbs and the graphite line of schist.',
  },
  {
    id: 'wine-2',
    brandId: fixtureBrand.id,
    slug: 'river-stone',
    name: 'River Stone',
    producerId: fixtureProducers[1].id,
    producerName: fixtureProducers[1].name,
    regionId: 'loire',
    regionName: 'Loire',
    countryName: 'France',
    grapeIds: ['chenin-blanc'],
    grapeNames: ['Chenin Blanc'],
    vintage: 2023,
    style: 'white',
    introduction: 'A bright, mineral white with waxed citrus and river-stone tension.',
  },
]

export const fixtureJournal: JournalEntry[] = [
  {
    id: 'journal-1',
    slug: 'the-shape-of-altitude',
    title: 'The shape of altitude',
    excerpt: 'What changes when vines climb above the familiar line.',
    publishedAt: '2026-08-01T10:00:00.000Z',
  },
  {
    id: 'journal-2',
    slug: 'beyond-the-famous-village',
    title: 'Beyond the famous village',
    excerpt: 'A field note on looking one hillside further.',
    publishedAt: '2026-07-14T10:00:00.000Z',
  },
]

export const fixtureBoxes: BoxSummary[] = [
  {
    id: 'box-1',
    name: 'Atlantic & Altitude',
    edition: {
      id: 'edition-1',
      code: 'TRV-2026-09',
      slug: 'atlantic-and-altitude',
      title: 'Atlantic & Altitude',
      period: 'September 2026',
      introduction: 'Two ways landscape leaves a line in the glass.',
    },
    planCode: 'drinker',
    wines: fixtureWines,
  },
]

export const fixtureSiteSettings: SiteSettings = {
  siteName: 'Terrova',
  siteUrl: 'https://terrova.net',
  defaultTitle: 'Terrova — Discover wine beyond the label',
  defaultDescription: 'Remarkable wines, producers and places — delivered as a monthly journey.',
  ageGateEnabled: true,
  minimumAge: 18,
  shippingCountries: ['PT'],
  supportEmail: 'hello@terrova.net',
}

export const fixturePages: EditorialPageContent[] = [
  ['terms', 'Terms of service', 'Membership / Legal'],
  ['privacy', 'Privacy', 'Your data / Legal'],
  ['cookies', 'Cookies', 'Consent / Legal'],
  ['shipping', 'Shipping & delivery', 'Orders / Help'],
  ['returns', 'Returns & cancellations', 'Membership / Help'],
  ['responsible-drinking', 'Responsible drinking', '18+ / Responsibility'],
].map(([slug, title, eyebrow], index) => ({
  id: `page-${index + 1}`,
  slug,
  title,
  eyebrow,
  introduction:
    'This page is structurally complete but requires final jurisdiction-specific review before launch.',
}))
