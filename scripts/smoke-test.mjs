import assert from 'node:assert/strict'

const webURL = process.env.TERROVA_WEB_URL ?? 'http://127.0.0.1:3000'
const cmsURL = process.env.TERROVA_CMS_URL ?? 'http://127.0.0.1:3001'
const timeoutMs = Number(process.env.TERROVA_SMOKE_TIMEOUT_MS ?? 120_000)

const publicRoutes = [
  '/',
  '/boxes',
  '/producers',
  '/producers/quinta-da-pellada',
  '/wines/primus-branco',
  '/journal',
  '/journal/reading-a-landscape',
  '/gifts',
  '/account',
  '/legal/privacy',
  '/legal/terms',
]
const publicCollections = [
  'brands',
  'plans',
  'wines',
  'wine-skus',
  'producers',
  'countries',
  'regions',
  'grapes',
  'editions',
  'boxes',
  'journal-posts',
  'pages',
  'site-settings',
  'media',
]

const privateCollections = [
  'users',
  'customers',
  'addresses',
  'subscriptions',
  'orders',
  'order-items',
  'inventory-movements',
  'cellar-entries',
  'ratings',
  'taste-signals',
  'gifts',
  'promotions',
  'webhook-events',
]

async function waitFor(url, label) {
  const startedAt = Date.now()
  let lastError

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url, { redirect: 'follow' })
      if (response.ok) return response
      lastError = new Error(`${label} returned ${response.status}`)
    } catch (error) {
      lastError = error
    }

    await new Promise((resolve) => setTimeout(resolve, 1_000))
  }

  throw new Error(`${label} was not ready within ${timeoutMs}ms`, { cause: lastError })
}

const homepage = await waitFor(`${webURL}/`, 'Web application')
const homepageHTML = await homepage.text()

assert.match(homepageHTML, /Discover wine/i, 'Discover headline is missing')
assert.match(homepageHTML, /beyond the label\./i, 'Discover signature is missing')
assert.match(homepageHTML, /Explore the boxes/i, 'Discover primary CTA is missing')
assert.match(
  homepageHTML,
  /data-reduced-motion-ready="true"/i,
  'Static/reduced-motion fallback is missing',
)
assert.match(homepageHTML, /A new discovery, every month\./i, 'Unbox core heading is missing')
assert.match(
  homepageHTML,
  /We search beyond familiar labels/i,
  'Unbox supporting narrative is missing',
)
assert.match(homepageHTML, /Every bottle begins somewhere\./i, 'Origins core heading is missing')
assert.match(
  homepageHTML,
  /We find\. We curate\. You discover\./i,
  'Process core heading is missing',
)
assert.match(homepageHTML, /Choose your journey\./i, 'Journey core heading is missing')
assert.match(
  homepageHTML,
  /Every bottle you try teaches us something about your taste\./i,
  'Your Taste core heading is missing',
)
assert.match(homepageHTML, /A future Wine Profile/i, 'Wine Profile concept is missing')
assert.match(
  homepageHTML,
  /Your discoveries build a richer picture/i,
  'Wine Profile supporting promise is missing',
)
assert.match(
  homepageHTML,
  /Your next favourite wine is still out there\./i,
  'Final CTA heading is missing',
)

for (const origin of [
  'Douro',
  'Portugal',
  'Loire',
  'France',
  'Etna',
  'Italy',
  'Priorat',
  'Spain',
]) {
  assert.match(homepageHTML, new RegExp(origin, 'i'), `Origin narrative missing: ${origin}`)
}

for (const scene of [
  'unbox',
  'origins',
  'process',
  'choose-your-journey',
  'your-taste',
  'final-cta',
]) {
  assert.match(
    homepageHTML,
    new RegExp(`data-motion-scene="${scene}"[^>]*data-motion-mode="static"`, 'i'),
    `Static narrative marker missing: ${scene}`,
  )
}

for (const signal of [
  'Volcanic energy',
  'Atlantic edges',
  'Touriga Franca',
  'Mineral · savoury · bright',
]) {
  assert.match(homepageHTML, new RegExp(signal, 'i'), `Taste signal missing: ${signal}`)
}

const orderedProcessSteps = ['We search', 'We curate', 'We deliver', 'You taste']
let previousProcessStepPosition = -1

for (const step of orderedProcessSteps) {
  const position = homepageHTML.indexOf(step)
  assert.ok(position > previousProcessStepPosition, `Process step order is incorrect at ${step}`)
  previousProcessStepPosition = position
}

for (const [plan, price, positioning] of [
  ['Taster', '€29,99', 'Start somewhere unexpected.'],
  ['Drinker', '€49,99', 'Go further.'],
  ['Premium', '€69,99', 'Drink something remarkable.'],
]) {
  assert.match(homepageHTML, new RegExp(plan, 'i'), `Journey plan missing: ${plan}`)
  assert.match(homepageHTML, new RegExp(price, 'i'), `Journey price missing: ${price}`)
  assert.match(homepageHTML, new RegExp(positioning, 'i'), `Journey positioning missing: ${plan}`)
}

assert.match(homepageHTML, /Most Popular/i, 'Accessible Most Popular label is missing')
assert.match(homepageHTML, /href="\/boxes\?plan=taster"/i, 'Taster CTA is missing')
assert.match(homepageHTML, /href="\/boxes\?plan=drinker"/i, 'Drinker CTA is missing')
assert.match(homepageHTML, /href="\/boxes\?plan=premium"/i, 'Premium CTA is missing')

const orderedSceneMarkers = [
  'data-motion-scene="discover"',
  'data-motion-scene="unbox"',
  'data-motion-scene="origins"',
  'data-motion-scene="process"',
  'data-motion-scene="choose-your-journey"',
  'data-motion-scene="your-taste"',
  'data-motion-scene="final-cta"',
]
let previousScenePosition = -1

for (const marker of orderedSceneMarkers) {
  const position = homepageHTML.indexOf(marker)
  assert.ok(position > previousScenePosition, `Homepage scene order is incorrect at ${marker}`)
  previousScenePosition = position
}

assert.match(homepageHTML, /Join Terrova/i, 'Primary final CTA is missing')
assert.match(homepageHTML, /Explore the boxes/i, 'Secondary final path is missing')
assert.match(homepageHTML, /href="\/boxes"/i, 'Final CTA route boundary is missing')
assert.doesNotMatch(homepageHTML, /href="[^"]*checkout/i, 'Checkout route leaked into homepage')
assert.doesNotMatch(
  homepageHTML,
  /My Terrova|Stripe|recommendation engine/i,
  'Out-of-scope customer or commerce functionality leaked into homepage',
)

for (const destination of ['/boxes', '/producers', '/journal', '/gifts', '/account']) {
  assert.match(
    homepageHTML,
    new RegExp(`href="${destination}"`, 'i'),
    `Navigation destination missing: ${destination}`,
  )
}

for (const scene of [
  'Discover',
  'Unbox',
  'Origins',
  'Process',
  'Choose your journey',
  'Your taste',
  'The next discovery',
]) {
  assert.match(homepageHTML, new RegExp(scene, 'i'), `Homepage scene missing: ${scene}`)
}

for (const route of publicRoutes) {
  const response = await fetch(`${webURL}${route}`)
  assert.equal(response.status, 200, `Public route failed: ${route}`)

  const html = await response.text()
  assert.doesNotMatch(
    html,
    /create next app|get started by editing/i,
    `Framework branding on ${route}`,
  )
}

await waitFor(`${cmsURL}/api/brands?limit=1`, 'Payload API')

for (const collection of publicCollections) {
  const response = await fetch(`${cmsURL}/api/${collection}?limit=1`)
  assert.equal(response.status, 200, `Public collection failed: ${collection}`)

  const payload = await response.json()
  assert.ok(Array.isArray(payload.docs), `Invalid Payload response for ${collection}`)
}

for (const collection of privateCollections) {
  const response = await fetch(`${cmsURL}/api/${collection}?limit=1`)
  if (response.ok) {
    const payload = await response.json()
    assert.equal(payload.docs?.length, 0, `Private collection leaked records: ${collection}`)
  } else {
    assert.ok(
      [401, 403].includes(response.status),
      `Unexpected private collection status for ${collection}: ${response.status}`,
    )
  }
}

const adminResponse = await fetch(`${cmsURL}/admin`, { redirect: 'follow' })
assert.equal(adminResponse.status, 200, 'Payload admin did not load')

console.log('Functional smoke tests passed: public routes, scenes, CMS admin, and collections.')
