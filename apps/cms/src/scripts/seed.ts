import { getPayload, type CollectionSlug, type Where } from 'payload'

import config from '../payload.config'
import type { JournalPost, Page } from '../payload-types'

type SeedID = number

function richText(text: string): Page['body'] {
  return {
    root: {
      type: 'root',
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          type: 'paragraph',
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
          children: [
            { type: 'text', text, detail: 0, format: 0, mode: 'normal', style: '', version: 1 },
          ],
        },
      ],
    },
  }
}

async function main() {
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_PRODUCTION_SEED !== 'true') {
    throw new Error(
      'Production seed refused. Set ALLOW_PRODUCTION_SEED=true for an explicit, non-destructive run.',
    )
  }

  const payload = await getPayload({ config })
  const findID = async (
    collection: CollectionSlug,
    field: string,
    value: string,
  ): Promise<SeedID | undefined> => {
    const where = { [field]: { equals: value } } as Where
    const result = await payload.find({
      collection,
      where,
      depth: 0,
      limit: 1,
      overrideAccess: true,
    })
    const id = result.docs[0]?.id
    return typeof id === 'number' ? id : undefined
  }

  let brandID = await findID('brands', 'slug', 'terrova')
  if (!brandID) {
    brandID = (
      await payload.create({
        collection: 'brands',
        overrideAccess: true,
        data: {
          name: 'Terrova',
          slug: 'terrova',
          locale: 'en-GB',
          currency: 'EUR',
          active: true,
          supportEmail: 'hello@terrova.net',
          hostnames: [
            { hostname: 'localhost' },
            { hostname: 'terrova.net' },
            { hostname: 'www.terrova.net' },
          ],
          theme: { ink: '#171714', cream: '#F3EFE4', accent: '#B65F43', secondary: '#35483A' },
        },
      })
    ).id
  }

  let countryID = await findID('countries', 'code', 'PT')
  if (!countryID)
    countryID = (
      await payload.create({
        collection: 'countries',
        overrideAccess: true,
        data: { name: 'Portugal', code: 'PT' },
      })
    ).id

  const regionSeeds = [
    {
      name: 'Douro',
      slug: 'douro',
      tagline: 'Steep terraces. Ancient vines. Unmistakable character.',
      description:
        'Carved by the Douro River, this dramatic landscape of schist slopes creates wines with depth, structure and a powerful sense of place.',
    },
    {
      name: 'Alentejo',
      slug: 'alentejo',
      tagline: 'Wide horizons. Warm days. Generous wines.',
      description:
        'Across sunlit plains and ancient soils, the Alentejo produces expressive wines shaped by Mediterranean warmth, altitude and remarkable local diversity.',
    },
    {
      name: 'Vinho Verde',
      slug: 'vinho-verde',
      tagline: 'Green landscapes shaped by the Atlantic.',
      description:
        "Portugal's northwest is a land of freshness and vibrant native grapes, where cool Atlantic influence gives the wines energy, fragrance and natural acidity.",
    },
    {
      name: 'Dão',
      slug: 'dao',
      tagline: 'Mountain vineyards. Granite soils. Quiet elegance.',
      description:
        'Protected by surrounding mountains, the Dão is known for freshness, balance and refined wines shaped by altitude, granite and slow ripening.',
    },
    {
      name: 'Bairrada',
      slug: 'bairrada',
      tagline: 'Atlantic air. Limestone soils. Wines built on freshness.',
      description:
        'Between the mountains and the ocean, Bairrada combines cool maritime influence with distinctive native grapes and a long tradition of age-worthy wines and sparkling wine.',
    },
  ] as const
  const regionIDs = new Map<string, SeedID>()
  for (const region of regionSeeds) {
    const id = await findID('regions', 'slug', region.slug)
    const data = {
      name: region.name,
      slug: region.slug,
      status: 'live' as const,
      country: countryID,
      tagline: region.tagline,
      shortDescription: region.description,
      story: richText(region.description),
    }
    const doc = id
      ? await payload.update({ collection: 'regions', id, overrideAccess: true, data })
      : await payload.create({ collection: 'regions', overrideAccess: true, data })
    regionIDs.set(region.slug, doc.id)
  }

  const grapeSeeds = [
    {
      name: 'Touriga Nacional',
      aliases: [] as { name: string }[],
      colour: 'red' as const,
      tagline: 'Floral, structured and unmistakably Portuguese.',
      description:
        "One of Portugal's iconic native grapes, combining dark fruit, floral aromas, freshness and remarkable ageing potential.",
    },
    {
      name: 'Alvarinho',
      aliases: [] as { name: string }[],
      colour: 'white' as const,
      tagline: 'Fragrant, precise and full of Atlantic freshness.',
      description:
        'A vibrant northern variety known for citrus, stone fruit and floral aromas, balanced by striking acidity and concentration.',
    },
    {
      name: 'Arinto',
      aliases: [] as { name: string }[],
      colour: 'white' as const,
      tagline: 'Freshness with a distinctly Portuguese edge.',
      description:
        'Known for its vibrant acidity and citrus character, Arinto thrives across Portugal and remains remarkably fresh even in warmer regions.',
    },
    {
      name: 'Baga',
      aliases: [] as { name: string }[],
      colour: 'red' as const,
      tagline: 'Character, tension and remarkable longevity.',
      description:
        'The signature red grape of Bairrada, producing structured wines with vivid acidity, firm tannins and impressive ability to evolve with age.',
    },
    {
      name: 'Aragonez',
      aliases: [{ name: 'Tinta Roriz' }],
      colour: 'red' as const,
      tagline: 'Ripe fruit, spice and many regional identities.',
      description:
        'Known by different names across Portugal, this versatile variety brings fruit, structure and spice to wines from north to south.',
    },
  ] as const
  const grapeIDs = new Map<string, SeedID>()
  for (const grape of grapeSeeds) {
    const id = await findID('grapes', 'name', grape.name)
    const data = {
      name: grape.name,
      aliases: [...grape.aliases],
      status: 'live' as const,
      colour: grape.colour,
      tagline: grape.tagline,
      shortDescription: grape.description,
    }
    const doc = id
      ? await payload.update({ collection: 'grapes', id, overrideAccess: true, data })
      : await payload.create({ collection: 'grapes', overrideAccess: true, data })
    grapeIDs.set(grape.name, doc.id)
  }

  const plans = [
    {
      name: 'Taster',
      code: 'taster',
      positioning: 'Start somewhere unexpected.',
      priceAmount: 2999,
      mostPopular: false,
    },
    {
      name: 'Drinker',
      code: 'drinker',
      positioning: 'Go further.',
      priceAmount: 4999,
      mostPopular: true,
    },
    {
      name: 'Premium',
      code: 'premium',
      positioning: 'Drink something remarkable.',
      priceAmount: 6999,
      mostPopular: false,
    },
  ] as const
  const planIDs = new Map<string, SeedID>()
  for (const plan of plans) {
    const id = await findID('plans', 'code', plan.code)
    const data = {
      ...plan,
      brand: brandID,
      cadence: 'monthly' as const,
      currency: 'EUR' as const,
      active: true,
      description: 'A monthly surprise box of Portuguese wines, revealed only when it reaches you.',
    }
    const doc = id
      ? await payload.update({ collection: 'plans', id, overrideAccess: true, data })
      : await payload.create({
          collection: 'plans',
          overrideAccess: true,
          data: {
            ...data,
            externalPriceId:
              process.env.NODE_ENV === 'production' ? undefined : `price_test_terrova_${plan.code}`,
          },
        })
    planIDs.set(plan.code, doc.id)
  }

  let producerID = await findID('producers', 'slug', 'quinta-da-pellada')
  if (!producerID)
    producerID = (
      await payload.create({
        collection: 'producers',
        overrideAccess: true,
        data: {
          brands: [brandID],
          name: 'Quinta da Pellada',
          slug: 'quinta-da-pellada',
          status: 'live',
          introduction:
            'A family estate reading the granitic slopes of the Dão with clarity and restraint.',
          country: countryID,
          region: regionIDs.get('dao')!,
          story: richText(
            'The work begins with old parcels, mixed exposures and a belief that precision should never erase origin.',
          ),
        },
      })
    ).id

  const wineSeeds = [
    {
      name: 'Primus Branco',
      slug: 'primus-branco',
      vintage: 2023,
      style: 'white' as const,
      grape: grapeIDs.get('Arinto')!,
      sku: 'TER-PRI-23-750',
      amount: 2800,
    },
    {
      name: 'Tinto da Serra',
      slug: 'tinto-da-serra',
      vintage: 2021,
      style: 'red' as const,
      grape: grapeIDs.get('Touriga Nacional')!,
      sku: 'TER-SER-21-750',
      amount: 3200,
    },
  ]
  const wineIDs: SeedID[] = []
  const skuIDs: SeedID[] = []
  for (const wine of wineSeeds) {
    let wineID = await findID('wines', 'slug', wine.slug)
    if (!wineID)
      wineID = (
        await payload.create({
          collection: 'wines',
          overrideAccess: true,
          data: {
            brand: brandID,
            name: wine.name,
            slug: wine.slug,
            status: 'live',
            introduction: 'A composed, site-led wine selected for the Terrova table.',
            producer: producerID,
            country: countryID,
            region: regionIDs.get('dao')!,
            grapes: [wine.grape],
            vintage: wine.vintage,
            style: wine.style,
            story: richText('A bottle that rewards attention without demanding ceremony.'),
          },
        })
      ).id
    wineIDs.push(wineID)
    let skuID = await findID('wine-skus', 'sku', wine.sku)
    if (!skuID)
      skuID = (
        await payload.create({
          collection: 'wine-skus',
          overrideAccess: true,
          data: {
            wine: wineID,
            brand: brandID,
            sku: wine.sku,
            bottleSizeMl: 750,
            priceAmount: wine.amount,
            currency: 'EUR',
            active: true,
            stockOnHand: 120,
            stockReserved: 0,
          },
        })
      ).id
    skuIDs.push(skuID)
  }

  let editionID = await findID('editions', 'code', 'ED-FOUNDATIONS')
  if (!editionID)
    editionID = (
      await payload.create({
        collection: 'editions',
        overrideAccess: true,
        data: {
          brand: brandID,
          title: 'Foundations',
          code: 'ED-FOUNDATIONS',
          slug: 'foundations',
          status: 'live',
          period: 'Release candidate edition',
          periodStart: '2026-09-01T00:00:00.000Z',
          periodEnd: '2026-12-31T23:59:59.000Z',
          publishAt: '2026-09-01T00:00:00.000Z',
          narrative: richText(
            'A Portuguese wine discovery whose bottles and producers stay sealed until opening.',
          ),
          eligiblePlans: [...planIDs.values()],
          wineSKUs: skuIDs,
          storyChapters: [
            {
              title: 'Stone and altitude',
              body: richText('Two bottles, one landscape, and a conversation across colour.'),
            },
          ],
        },
      })
    ).id

  for (const plan of plans) {
    const code = `BOX-FOUNDATIONS-${plan.code.toUpperCase()}`
    if (!(await findID('boxes', 'code', code)))
      await payload.create({
        collection: 'boxes',
        overrideAccess: true,
        data: {
          brand: brandID,
          edition: editionID,
          plan: planIDs.get(plan.code)!,
          name: `Foundations / ${plan.name}`,
          code,
          status: 'ready',
          wineSKUs: skuIDs,
          packingNote: 'Use the approved Foundations tissue, story card and recyclable inserts.',
          packingDeadline: '2026-09-20T12:00:00.000Z',
          expectedShipAt: '2026-09-24T09:00:00.000Z',
        },
      })
  }

  const siteSettingsID = await findID('site-settings', 'siteName', 'Terrova')
  const siteSettingsData = {
    brand: brandID,
    siteName: 'Terrova',
    siteUrl: process.env.WEB_URL ?? 'http://localhost:3000',
    defaultTitle: 'Terrova — Wine, revealed slowly',
    defaultDescription:
      'Portuguese wine discoveries, kept a surprise until each monthly Terrova box is opened.',
    supportEmail: 'hello@terrova.net',
    ageGateEnabled: true,
    minimumAge: 18,
    shippingCountries: [{ countryCode: 'PT', label: 'Portugal' }],
  }
  if (siteSettingsID)
    await payload.update({
      collection: 'site-settings',
      id: siteSettingsID,
      overrideAccess: true,
      data: siteSettingsData,
    })
  else
    await payload.create({
      collection: 'site-settings',
      overrideAccess: true,
      data: siteSettingsData,
    })

  if (!(await findID('journal-posts', 'slug', 'reading-a-landscape')))
    await payload.create({
      collection: 'journal-posts',
      overrideAccess: true,
      data: {
        brand: brandID,
        title: 'Reading a landscape',
        slug: 'reading-a-landscape',
        excerpt: 'Why a wine can be a record of altitude, weather and a grower’s decisions.',
        body: richText(
          'Terrova begins with the land, then follows the decisions that carry it into the bottle.',
        ) as JournalPost['body'],
        authorName: 'Terrova Studio',
        status: 'live',
        publishedAt: '2026-09-01T09:00:00.000Z',
        publishAt: '2026-09-01T09:00:00.000Z',
        seo: {
          title: 'Reading a landscape — Terrova',
          description: 'A field note on origin, wine and the people connecting both.',
        },
      },
    })

  const legalPages = [
    [
      'terms',
      'Terms of service',
      'The contractual terms governing Terrova membership and use of this website.',
    ],
    ['privacy', 'Privacy', 'How Terrova handles account, order and preference data.'],
    ['cookies', 'Cookie policy', 'How essential and optional measurement technologies are used.'],
    ['shipping', 'Shipping', 'Delivery areas, timing and fulfilment expectations.'],
    [
      'returns',
      'Returns and refunds',
      'The process for delivery issues, returns and eligible refunds.',
    ],
    [
      'responsible-drinking',
      'Responsible drinking',
      'Terrova is intended only for adults of legal drinking age.',
    ],
  ] as const
  for (const [slug, title, introduction] of legalPages) {
    if (!(await findID('pages', 'slug', slug)))
      await payload.create({
        collection: 'pages',
        overrideAccess: true,
        data: {
          brand: brandID,
          title,
          slug,
          eyebrow: 'Legal / operator review required',
          introduction,
          body: richText(
            'This page is structurally ready but requires jurisdiction-specific review and approval before public launch.',
          ),
          status: 'live',
          publishAt: '2026-09-01T00:00:00.000Z',
          seo: { noIndex: false },
        },
      })
  }

  const testEmail = process.env.SEED_TEST_CUSTOMER_EMAIL
  const testPassword = process.env.SEED_TEST_CUSTOMER_PASSWORD
  if (
    process.env.NODE_ENV !== 'production' &&
    testEmail &&
    testPassword &&
    !(await findID('customers', 'email', testEmail))
  ) {
    await payload.create({
      collection: 'customers',
      overrideAccess: true,
      data: {
        brand: brandID,
        email: testEmail,
        password: testPassword,
        name: 'Release Test Customer',
        status: 'active',
        termsAcceptedAt: new Date().toISOString(),
        _verified: true,
      },
    })
  }

  payload.logger.info('Terrova seed complete (existing records preserved)')
  process.exit(0)
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Unknown seed failure')
  process.exit(1)
})
