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

  let regionID = await findID('regions', 'slug', 'dao')
  if (!regionID)
    regionID = (
      await payload.create({
        collection: 'regions',
        overrideAccess: true,
        data: {
          name: 'Dão',
          slug: 'dao',
          status: 'live',
          country: countryID,
          story: richText(
            'Granite, altitude and patient farming give the Dão its quiet, architectural wines.',
          ),
        },
      })
    ).id

  const grapeNames = ['Encruzado', 'Touriga Nacional'] as const
  const grapeIDs: SeedID[] = []
  for (const name of grapeNames) {
    let id = await findID('grapes', 'name', name)
    if (!id)
      id = (
        await payload.create({
          collection: 'grapes',
          overrideAccess: true,
          data: { name, colour: name === 'Encruzado' ? 'white' : 'red' },
        })
      ).id
    grapeIDs.push(id)
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
    let id = await findID('plans', 'code', plan.code)
    if (!id)
      id = (
        await payload.create({
          collection: 'plans',
          overrideAccess: true,
          data: {
            ...plan,
            brand: brandID,
            cadence: 'monthly',
            currency: 'EUR',
            active: true,
            externalPriceId:
              process.env.NODE_ENV === 'production' ? undefined : `price_test_terrova_${plan.code}`,
            description:
              'A monthly edition selected around place, season and the people behind each bottle.',
          },
        })
      ).id
    planIDs.set(plan.code, id)
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
          region: regionID,
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
      grape: grapeIDs[0],
      sku: 'TER-PRI-23-750',
      amount: 2800,
    },
    {
      name: 'Tinto da Serra',
      slug: 'tinto-da-serra',
      vintage: 2021,
      style: 'red' as const,
      grape: grapeIDs[1],
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
            region: regionID,
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
          narrative: richText('Granite, altitude and the growers who make patience tangible.'),
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

  if (!(await findID('site-settings', 'siteName', 'Terrova')))
    await payload.create({
      collection: 'site-settings',
      overrideAccess: true,
      data: {
        brand: brandID,
        siteName: 'Terrova',
        siteUrl: process.env.WEB_URL ?? 'http://localhost:3000',
        defaultTitle: 'Terrova — Wine, revealed slowly',
        defaultDescription:
          'A cinematic wine membership built around origin, season and independent producers.',
        supportEmail: 'hello@terrova.net',
        ageGateEnabled: true,
        minimumAge: 18,
        shippingCountries: [{ countryCode: 'PT', label: 'Portugal' }],
      },
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
