import assert from 'node:assert/strict'

const webURL = process.env.TERROVA_WEB_URL ?? 'http://127.0.0.1:3000'
const cmsURL = process.env.TERROVA_CMS_URL ?? 'http://127.0.0.1:3001'
const timeoutMs = Number(process.env.TERROVA_SMOKE_TIMEOUT_MS ?? 120_000)

const publicRoutes = ['/', '/boxes', '/producers', '/journal', '/gifts', '/account']
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
  'media',
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

for (const scene of [
  'Discover',
  'Unbox',
  'Origins',
  'Process',
  'Choose your journey',
  'Your taste',
  'Begin here',
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

const usersResponse = await fetch(`${cmsURL}/api/users?limit=1`)
assert.ok(
  [401, 403].includes(usersResponse.status),
  `Users collection must require authentication; received ${usersResponse.status}`,
)

const adminResponse = await fetch(`${cmsURL}/admin`, { redirect: 'follow' })
assert.equal(adminResponse.status, 200, 'Payload admin did not load')

console.log('Functional smoke tests passed: public routes, scenes, CMS admin, and collections.')
