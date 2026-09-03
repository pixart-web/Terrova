import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test.beforeEach(async ({ context }) => {
  const origin = process.env.TERROVA_WEB_URL ?? 'http://localhost:3000'
  await context.addCookies([
    { name: 'terrova-age', value: 'confirmed', url: origin },
    { name: 'terrova-analytics', value: 'denied', url: origin },
  ])
})

test('cinematic homepage preserves the seven-scene journey', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /Discover wine/i })).toBeVisible()
  for (const scene of [
    'discover',
    'unbox',
    'origins',
    'process',
    'choose-your-journey',
    'your-taste',
    'final-cta',
  ]) {
    await expect(page.locator(`[data-motion-scene="${scene}"]`)).toHaveCount(1)
  }
  await expect(page.getByRole('link', { name: /Choose Drinker/i })).toHaveAttribute(
    'href',
    '/boxes?plan=drinker',
  )
})

test('plan selection reaches the provider-neutral checkout confirmation', async ({ page }) => {
  await page.goto('/boxes?plan=drinker')
  await expect(page.getByRole('heading', { name: 'Go further.' })).toBeVisible()
  await page.getByRole('button', { name: 'Begin with Drinker' }).click()
  await expect(page).toHaveURL(/\/checkout\/success\?session_id=cs_test_terrova_fixture/)
  await expect(page.getByRole('heading', { name: /Your journey has begun/i })).toBeVisible()
})

test('gift intent is persisted without pretending that billing is complete', async ({ page }) => {
  await page.goto('/gifts')
  await page.getByLabel('Your email').fill('giver@example.com')
  await page.getByLabel('Recipient name').fill('Alex')
  await page.getByLabel('Recipient email').fill('alex@example.com')
  await page.getByRole('button', { name: 'Save gift intent' }).click()
  await expect(page).toHaveURL(/\/gifts\?submitted=1/)
  await expect(page.getByText(/gift intent is safely recorded/i)).toBeVisible()
})

test('authenticated customer can enter My Terrova', async ({ page }) => {
  await page.goto('/account')
  await page
    .getByRole('heading', { name: 'Welcome back' })
    .locator('..')
    .getByLabel('Email')
    .fill(process.env.SEED_TEST_CUSTOMER_EMAIL ?? 'release-test@terrova.local')
  await page
    .getByRole('heading', { name: 'Welcome back' })
    .locator('..')
    .getByLabel('Password')
    .fill(process.env.SEED_TEST_CUSTOMER_PASSWORD ?? 'local-release-test-password')
  await page.getByRole('button', { name: 'Enter My Terrova' }).click()
  await expect(page).toHaveURL('/account')
  await expect(
    page.getByRole('heading', { name: /Your next discovery starts here/i }),
  ).toBeVisible()
  await expect(page.getByText(/No deliveries yet|recorded/)).toBeVisible()
})

test('legal and editorial routes have real, indexable shells', async ({ page }) => {
  for (const route of ['/producers', '/journal', '/legal/privacy', '/legal/terms']) {
    const response = await page.goto(route)
    expect(response?.status()).toBe(200)
    await expect(page.locator('main#main-content.public-page')).toBeVisible()
    await expect(page.locator('h1')).toBeVisible()
  }
})

test('critical public surfaces have no automated WCAG A/AA violations', async ({ page }) => {
  for (const route of ['/', '/boxes?plan=drinker', '/account']) {
    await page.goto(route)
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    expect(
      result.violations,
      `${route}: ${result.violations.map(({ id }) => id).join(', ')}`,
    ).toEqual([])
  }
})

test('reduced motion keeps every scene readable without cinematic pinning', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  for (const scene of [
    'discover',
    'unbox',
    'origins',
    'process',
    'choose-your-journey',
    'your-taste',
    'final-cta',
  ]) {
    await expect(page.locator(`[data-motion-scene="${scene}"]`)).toHaveAttribute(
      'data-motion-mode',
      'static',
    )
  }
  await expect(
    page.getByRole('heading', { name: /Your next favourite wine is still out there/i }),
  ).toBeVisible()
})
