// Full-page screenshots of each locale at desktop and phone widths (needs a running server).
import { mkdir } from 'node:fs/promises'
import { chromium } from '@playwright/test'

const base = process.env.BASE_URL ?? 'http://localhost:3400'
const routes = ['/', '/fr']
await mkdir('screenshots', { recursive: true })
const browser = await chromium.launch()

for (const width of [1440, 375]) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' })
  const page = await context.newPage()
  for (const path of routes) {
    await page.goto(base + path, { waitUntil: 'networkidle' })
    await page.waitForTimeout(800)
    const name = `${path === '/' ? 'en' : path.slice(1)}-${width}`
    await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true })
    console.log(`saved screenshots/${name}.png`)
  }
  await context.close()
}

await browser.close()
