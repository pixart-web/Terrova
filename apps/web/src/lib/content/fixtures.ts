import type {
  BoxSummary,
  BrandIdentity,
  EditorialPageContent,
  GrapeVarietySummary,
  JournalEntry,
  SiteSettings,
  SubscriptionPlan,
  WineRegionSummary,
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
    description: 'A first monthly surprise of Portuguese wines for curious drinkers.',
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
    description:
      'A balanced monthly surprise with more room for Portuguese contrast and discovery.',
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
      'Distinctive Portuguese bottles kept secret until opening, selected for rarity and precision.',
    cadence: 'monthly',
    price: { amount: 6999, currency: 'EUR' },
    externalPriceId: 'price_test_terrova_premium',
    active: true,
  },
]

export const fixtureRegions: WineRegionSummary[] = [
  {
    id: 'region-douro',
    slug: 'douro',
    name: 'Douro',
    tagline: 'Steep terraces. Ancient vines. Unmistakable character.',
    description:
      'Carved by the Douro River, this dramatic landscape of schist slopes creates wines with depth, structure and a powerful sense of place.',
  },
  {
    id: 'region-alentejo',
    slug: 'alentejo',
    name: 'Alentejo',
    tagline: 'Wide horizons. Warm days. Generous wines.',
    description:
      'Across sunlit plains and ancient soils, the Alentejo produces expressive wines shaped by Mediterranean warmth, altitude and remarkable local diversity.',
  },
  {
    id: 'region-vinho-verde',
    slug: 'vinho-verde',
    name: 'Vinho Verde',
    tagline: 'Green landscapes shaped by the Atlantic.',
    description:
      "Portugal's northwest is a land of freshness and vibrant native grapes, where cool Atlantic influence gives the wines energy, fragrance and natural acidity.",
  },
  {
    id: 'region-dao',
    slug: 'dao',
    name: 'Dão',
    tagline: 'Mountain vineyards. Granite soils. Quiet elegance.',
    description:
      'Protected by surrounding mountains, the Dão is known for freshness, balance and refined wines shaped by altitude, granite and slow ripening.',
  },
  {
    id: 'region-bairrada',
    slug: 'bairrada',
    name: 'Bairrada',
    tagline: 'Atlantic air. Limestone soils. Wines built on freshness.',
    description:
      'Between the mountains and the ocean, Bairrada combines cool maritime influence with distinctive native grapes and a long tradition of age-worthy wines and sparkling wine.',
  },
]

export const fixtureGrapes: GrapeVarietySummary[] = [
  {
    id: 'grape-touriga-nacional',
    name: 'Touriga Nacional',
    aliases: [],
    type: 'red',
    tagline: 'Floral, structured and unmistakably Portuguese.',
    description:
      "One of Portugal's iconic native grapes, combining dark fruit, floral aromas, freshness and remarkable ageing potential.",
  },
  {
    id: 'grape-alvarinho',
    name: 'Alvarinho',
    aliases: [],
    type: 'white',
    tagline: 'Fragrant, precise and full of Atlantic freshness.',
    description:
      'A vibrant northern variety known for citrus, stone fruit and floral aromas, balanced by striking acidity and concentration.',
  },
  {
    id: 'grape-arinto',
    name: 'Arinto',
    aliases: [],
    type: 'white',
    tagline: 'Freshness with a distinctly Portuguese edge.',
    description:
      'Known for its vibrant acidity and citrus character, Arinto thrives across Portugal and remains remarkably fresh even in warmer regions.',
  },
  {
    id: 'grape-baga',
    name: 'Baga',
    aliases: [],
    type: 'red',
    tagline: 'Character, tension and remarkable longevity.',
    description:
      'The signature red grape of Bairrada, producing structured wines with vivid acidity, firm tannins and impressive ability to evolve with age.',
  },
  {
    id: 'grape-aragonez',
    name: 'Aragonez',
    aliases: ['Tinta Roriz'],
    type: 'red',
    tagline: 'Ripe fruit, spice and many regional identities.',
    description:
      'Known by different names across Portugal, this versatile variety brings fruit, structure and spice to wines from north to south.',
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
    name: 'Terrova surprise edition',
    edition: {
      id: 'edition-1',
      code: 'TRV-2026-09',
      slug: 'atlantic-and-altitude',
      title: 'Terrova surprise edition',
      period: 'September 2026',
      introduction: 'A Portuguese wine discovery kept sealed until opening.',
    },
    planCode: 'drinker',
  },
]

export const fixtureSiteSettings: SiteSettings = {
  siteName: 'Terrova',
  siteUrl: 'https://terrova.net',
  defaultTitle: 'Terrova — Discover wine beyond the label',
  defaultDescription:
    'Portuguese wine discoveries, kept a surprise until each monthly Terrova box is opened.',
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
