import assert from 'node:assert/strict'

const webURL = process.env.TERROVA_WEB_URL ?? 'http://127.0.0.1:3000'
const cmsURL = process.env.TERROVA_CMS_URL ?? 'http://127.0.0.1:3001'
const timeoutMs = Number(process.env.TERROVA_SMOKE_TIMEOUT_MS ?? 120_000)
const serviceToken = process.env.CMS_SERVICE_TOKEN

function relationshipID(value) {
  return value && typeof value === 'object' ? value.id : value
}

async function cmsRequest(path, { method = 'GET', body, token, service = false } = {}) {
  const headers = { Accept: 'application/json' }
  if (body) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `JWT ${token}`
  if (service) {
    assert.ok(serviceToken, 'CMS_SERVICE_TOKEN is required for integration checks')
    headers['x-terrova-service-token'] = serviceToken
  }
  const response = await fetch(`${cmsURL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  return response
}

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

// Direct Payload API authorization regression checks. These deliberately bypass Next.js routes.
const login = await cmsRequest('/api/customers/login', {
  method: 'POST',
  body: {
    email: process.env.SEED_TEST_CUSTOMER_EMAIL,
    password: process.env.SEED_TEST_CUSTOMER_PASSWORD,
  },
})
assert.equal(login.status, 200, 'Seed customer could not authenticate directly with Payload')
const { token: customerToken, user: customer } = await login.json()
const customerBrand = relationshipID(customer.brand)

const foreignBrandResponse = await cmsRequest('/api/brands', {
  method: 'POST',
  service: true,
  body: {
    name: 'Authorization Test Brand',
    slug: 'authorization-test-brand',
    supportEmail: 'security-test@terrova.local',
    active: true,
  },
})
assert.equal(foreignBrandResponse.status, 201, 'Could not create authorization test brand')
const foreignBrand = await foreignBrandResponse.json()

const addressCreate = await cmsRequest('/api/addresses', {
  method: 'POST',
  token: customerToken,
  body: {
    customer: 'attacker-selected-customer',
    brand: foreignBrand.doc.id,
    label: 'Security test',
    recipientName: 'Release Customer',
    line1: '1 Integrity Lane',
    city: 'Lisbon',
    postalCode: '1000-001',
    countryCode: 'PT',
  },
})
assert.equal(addressCreate.status, 201, 'Customer address creation failed')
const address = (await addressCreate.json()).doc
assert.equal(String(relationshipID(address.customer)), String(customer.id))
assert.equal(String(relationshipID(address.brand)), String(customerBrand))

const addressUpdate = await cmsRequest(`/api/addresses/${address.id}`, {
  method: 'PATCH',
  token: customerToken,
  body: { brand: foreignBrand.doc.id, customer: 'attacker-selected-customer', city: 'Porto' },
})
assert.equal(addressUpdate.status, 200, 'Customer address update failed')
const updatedAddress = (await addressUpdate.json()).doc
assert.equal(String(relationshipID(updatedAddress.customer)), String(customer.id))
assert.equal(String(relationshipID(updatedAddress.brand)), String(customerBrand))

const wineResponse = await cmsRequest('/api/wines?depth=0&limit=1', { service: true })
const wine = (await wineResponse.json()).docs[0]
assert.ok(wine, 'Seed wine is required for authorization checks')
const foreignWineResponse = await cmsRequest('/api/wines', {
  method: 'POST',
  service: true,
  body: {
    brand: foreignBrand.doc.id,
    name: 'Foreign Authorization Wine',
    slug: 'foreign-authorization-wine',
    status: 'live',
    producer: relationshipID(wine.producer),
    country: relationshipID(wine.country),
    region: relationshipID(wine.region),
  },
})
assert.equal(foreignWineResponse.status, 201, 'Could not create cross-brand test wine')
const foreignWine = (await foreignWineResponse.json()).doc
const skuResponse = await cmsRequest(
  `/api/wine-skus?depth=0&limit=1&where[wine][equals]=${encodeURIComponent(String(wine.id))}`,
  { service: true },
)
const sku = (await skuResponse.json()).docs[0]
assert.ok(sku, 'Seed WineSKU is required for authorization checks')

const ownOrderResponse = await cmsRequest('/api/orders', {
  method: 'POST',
  service: true,
  body: {
    code: 'ORD-AUTHORIZATION-OWNER',
    brand: customerBrand,
    customer: customer.id,
    status: 'delivered',
    totalAmount: 0,
    currency: 'EUR',
  },
})
assert.equal(ownOrderResponse.status, 201, 'Could not create owner authorization test order')
const ownOrder = (await ownOrderResponse.json()).doc
const ownCellarResponse = await cmsRequest('/api/cellar-entries', {
  method: 'POST',
  service: true,
  body: {
    customer: customer.id,
    brand: customerBrand,
    wine: wine.id,
    wineSKU: sku.id,
    order: ownOrder.id,
    experiencedAt: new Date().toISOString(),
  },
})
assert.equal(ownCellarResponse.status, 201, 'Could not create owner authorization cellar entry')
const ownCellar = (await ownCellarResponse.json()).doc

const boxResponse = await cmsRequest('/api/boxes?depth=0&limit=1', { service: true })
const box = (await boxResponse.json()).docs[0]
assert.ok(box, 'Seed box is required for inventory lifecycle checks')
const reservedSkuIDs = [...new Set(box.wineSKUs.map(relationshipID).map(String))]
const stockBefore = new Map()
for (const skuID of reservedSkuIDs) {
  const response = await cmsRequest(`/api/wine-skus/${skuID}?depth=0`, { service: true })
  const current = await response.json()
  stockBefore.set(skuID, Number(current.stockReserved))
}
const reservationOrderResponse = await cmsRequest('/api/orders', {
  method: 'POST',
  service: true,
  body: {
    code: 'ORD-INVENTORY-RELEASE',
    brand: customerBrand,
    customer: customer.id,
    box: box.id,
    status: 'paid',
    totalAmount: 4999,
    currency: 'EUR',
  },
})
const reservationOrder = (await reservationOrderResponse.json()).doc
const preparingResponse = await cmsRequest(`/api/orders/${reservationOrder.id}`, {
  method: 'PATCH',
  service: true,
  body: { status: 'preparing' },
})
assert.equal(preparingResponse.status, 200, 'Order could not enter preparation')
for (const skuID of reservedSkuIDs) {
  const response = await cmsRequest(`/api/wine-skus/${skuID}?depth=0`, { service: true })
  const current = await response.json()
  assert.ok(
    Number(current.stockReserved) > stockBefore.get(skuID),
    `Preparation did not reserve WineSKU ${skuID}`,
  )
}
const cancelResponse = await cmsRequest(`/api/orders/${reservationOrder.id}`, {
  method: 'PATCH',
  service: true,
  body: { status: 'cancelled' },
})
assert.equal(cancelResponse.status, 200, 'Prepared order could not be cancelled')
for (const skuID of reservedSkuIDs) {
  const response = await cmsRequest(`/api/wine-skus/${skuID}?depth=0`, { service: true })
  const current = await response.json()
  assert.equal(
    Number(current.stockReserved),
    stockBefore.get(skuID),
    `Cancellation did not release WineSKU ${skuID}`,
  )
}
const retryCancel = await cmsRequest(`/api/orders/${reservationOrder.id}`, {
  method: 'PATCH',
  service: true,
  body: { status: 'cancelled' },
})
assert.equal(retryCancel.status, 200, 'Idempotent cancellation retry failed')
const releaseMovementsResponse = await cmsRequest(
  `/api/inventory-movements?depth=0&limit=100&where[order][equals]=${reservationOrder.id}&where[reason][equals]=release`,
  { service: true },
)
const releaseMovements = (await releaseMovementsResponse.json()).docs
assert.equal(
  releaseMovements.length,
  box.wineSKUs.length,
  'Cancellation retry created duplicate release movements',
)
for (const skuID of reservedSkuIDs) {
  const response = await cmsRequest(`/api/wine-skus/${skuID}?depth=0`, { service: true })
  const current = await response.json()
  assert.equal(
    Number(current.stockReserved),
    stockBefore.get(skuID),
    `Cancellation retry changed WineSKU ${skuID} twice`,
  )
}

const validRating = await cmsRequest('/api/ratings', {
  method: 'POST',
  token: customerToken,
  body: {
    customer: 'attacker-selected-customer',
    brand: foreignBrand.doc.id,
    wine: wine.id,
    cellarEntry: ownCellar.id,
    score: 4,
  },
})
assert.equal(validRating.status, 201, 'Owned rating should be accepted')
const rating = (await validRating.json()).doc
assert.equal(String(relationshipID(rating.customer)), String(customer.id))
assert.equal(String(relationshipID(rating.brand)), String(customerBrand))

const foreignCustomerResponse = await cmsRequest('/api/customers', {
  method: 'POST',
  service: true,
  body: {
    brand: customerBrand,
    email: 'foreign-owner@terrova.local',
    password: 'foreign-release-password',
    name: 'Foreign Owner',
    status: 'active',
    termsAcceptedAt: new Date().toISOString(),
    _verified: true,
  },
})
assert.equal(foreignCustomerResponse.status, 201, 'Could not create foreign authorization customer')
const foreignCustomer = (await foreignCustomerResponse.json()).doc
const foreignOrderResponse = await cmsRequest('/api/orders', {
  method: 'POST',
  service: true,
  body: {
    code: 'ORD-AUTHORIZATION-FOREIGN',
    brand: customerBrand,
    customer: foreignCustomer.id,
    status: 'delivered',
    totalAmount: 0,
    currency: 'EUR',
  },
})
assert.equal(foreignOrderResponse.status, 201, 'Could not create foreign authorization order')
const foreignOrder = (await foreignOrderResponse.json()).doc
const foreignCellarResponse = await cmsRequest('/api/cellar-entries', {
  method: 'POST',
  service: true,
  body: {
    customer: foreignCustomer.id,
    brand: customerBrand,
    wine: wine.id,
    wineSKU: sku.id,
    order: foreignOrder.id,
    experiencedAt: new Date().toISOString(),
  },
})
assert.equal(
  foreignCellarResponse.status,
  201,
  'Could not create foreign authorization cellar entry',
)
const foreignCellar = (await foreignCellarResponse.json()).doc

const crossCustomerRating = await cmsRequest('/api/ratings', {
  method: 'POST',
  token: customerToken,
  body: { wine: wine.id, cellarEntry: foreignCellar.id, score: 5 },
})
assert.ok(
  [400, 403].includes(crossCustomerRating.status),
  'Payload accepted a rating for another customer cellar entry',
)

const crossBrandRating = await cmsRequest('/api/ratings', {
  method: 'POST',
  token: customerToken,
  body: { wine: wine.id, brand: foreignBrand.doc.id, score: 5 },
})
assert.equal(crossBrandRating.status, 201, 'Valid wine should remain rateable')
const derivedCrossBrandRating = (await crossBrandRating.json()).doc
assert.equal(String(relationshipID(derivedCrossBrandRating.brand)), String(customerBrand))

const foreignWineRating = await cmsRequest('/api/ratings', {
  method: 'POST',
  token: customerToken,
  body: { wine: foreignWine.id, brand: customerBrand, score: 5 },
})
assert.ok(
  [400, 403].includes(foreignWineRating.status),
  'Payload accepted a rating for a wine from another brand',
)

const adminResponse = await fetch(`${cmsURL}/admin`, { redirect: 'follow' })
assert.equal(adminResponse.status, 200, 'Payload admin did not load')

console.log(
  'Functional smoke tests passed: public routes, scenes, CMS admin, collections, and direct Payload authorization.',
)
