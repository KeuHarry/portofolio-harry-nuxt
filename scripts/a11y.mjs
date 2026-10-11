// axe-core WCAG 2.1 AA scan of both locales against a running server (pnpm dev or pnpm preview).
import AxeBuilder from '@axe-core/playwright'
import { chromium } from '@playwright/test'

const base = process.env.BASE_URL ?? 'http://localhost:3400'
const routes = ['/', '/fr', '/missing-page']
const browser = await chromium.launch()
let total = 0

for (const width of [1280, 375]) {
  const context = await browser.newContext({ viewport: { width, height: 900 } })
  const page = await context.newPage()
  const errors = []
  page.on('console', msg => msg.type() === 'error' && errors.push(msg.text()))
  for (const path of routes) {
    await page.goto(base + path, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1200) // let the hero entrance finish so contrast is measured at rest
    const { violations } = await new AxeBuilder({ page }).exclude('nuxt-devtools-frame').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
    total += violations.length
    console.log(`${violations.length ? '✗' : '✓'} ${path} @${width}`)
    for (const v of violations) {
      console.log(`   ${v.id} (${v.impact}): ${v.help}`)
      for (const n of v.nodes.slice(0, 3)) console.log(`     ${n.target.join(' ')} ${n.failureSummary?.split('\n')[1] ?? ''}`)
    }
  }
  const real = errors.filter(e => !e.includes('404'))
  if (real.length) console.log('console errors:', real)
  await context.close()
}

await browser.close()
process.exit(total ? 1 : 0)
