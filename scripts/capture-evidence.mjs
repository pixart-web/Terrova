import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium, devices } from '@playwright/test'

const origin = process.env.TERROVA_WEB_URL ?? 'http://localhost:3000'
const output = new URL('../docs/evidence/', import.meta.url)
await mkdir(output, { recursive: true })

const browser = await chromium.launch()
for (const [name, options] of [
  ['desktop', { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }],
  ['mobile', devices['Pixel 7']],
]) {
  const context = await browser.newContext({ ...options, reducedMotion: 'reduce' })
  await context.addCookies([
    { name: 'terrova-age', value: 'confirmed', url: origin },
    { name: 'terrova-analytics', value: 'denied', url: origin },
  ])
  const page = await context.newPage()

  await page.goto(origin, { waitUntil: 'domcontentloaded' })
  await page.locator('.journey-heading').scrollIntoViewIfNeeded()
  await page.waitForTimeout(700)
  await page.screenshot({ path: fileURLToPath(new URL(`rc-journey-${name}.png`, output)) })

  await page.goto(`${origin}/boxes?plan=drinker`, { waitUntil: 'domcontentloaded' })
  await page.locator('.selected-plan').scrollIntoViewIfNeeded()
  await page.waitForTimeout(300)
  await page.screenshot({ path: fileURLToPath(new URL(`rc-boxes-${name}.png`, output)) })

  await page.goto(`${origin}/account`, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(300)
  await page.screenshot({ path: fileURLToPath(new URL(`rc-account-${name}.png`, output)) })
  await context.close()
}
await browser.close()
console.log('Release candidate evidence written to docs/evidence')
