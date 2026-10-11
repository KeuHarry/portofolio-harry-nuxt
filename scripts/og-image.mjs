// Renders public/og.png, the 1200×630 social preview.
import { readFile } from 'node:fs/promises'
import { chromium } from '@playwright/test'

const dataUri = async (path, type) => `data:${type};base64,${(await readFile(path)).toString('base64')}`
const font = weight => dataUri(`node_modules/@fontsource/lato/files/lato-latin-${weight}-normal.woff2`, 'font/woff2')
const portrait = await dataUri('public/images/harry-960.webp', 'image/webp')

const fonts = `
  @font-face { font-family: Lato; font-weight: 400; src: url(${await font(400)}) format('woff2'); }
  @font-face { font-family: Lato; font-weight: 700; src: url(${await font(700)}) format('woff2'); }
  @font-face { font-family: Lato; font-weight: 900; src: url(${await font(900)}) format('woff2'); }
  * { margin: 0; box-sizing: border-box; }
  body { font-family: Lato, sans-serif; color: #18222d; background: #f6f7f5; }
`

const og = `<!doctype html><html><head><style>${fonts}
  .card { position: relative; width: 1200px; height: 630px; padding: 72px 80px; overflow: hidden; }
  h1 { font-size: 104px; font-weight: 900; line-height: .94; letter-spacing: -.03em; }
  .role { margin-top: 28px; font-size: 34px; font-weight: 700; color: #1f5e6e; }
  .url { position: absolute; left: 80px; bottom: 64px; font-size: 26px; color: #56606d; }
  .arch { position: absolute; right: 80px; bottom: 0; width: 400px; height: 470px; border-radius: 999px 999px 0 0; background: #ddebec; }
  img { position: absolute; right: 80px; bottom: 0; width: 400px; }
</style></head><body><div class="card">
  <h1>Harry<br>Keumezeu<br>Feujio</h1>
  <p class="role">Senior software engineer</p>
  <p class="url">keuharry.dev</p>
  <div class="arch"></div><img src="${portrait}" alt="">
</div></body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.setContent(og, { waitUntil: 'load' })
await page.evaluate(() => document.fonts.ready)
await page.locator('.card').screenshot({ path: 'public/og.png' })
await browser.close()
console.log('wrote public/og.png')
