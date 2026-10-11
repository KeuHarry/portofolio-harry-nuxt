// Builds the header logo from the portrait cutout: a stencil-style face where light
// areas turn white and dark features (hair, brows, eyes, beard) fall back to petrol.
// Writes public/images/logo-face.{webp,png} (circle) and public/apple-touch-icon.png (square).
import sharp from 'sharp'

const SOURCE = 'scripts/source/portrait-cutout.png'
const PETROL = [0x1f, 0x5e, 0x6e]
const [T0, T1] = [0.30, 0.66] // luminance band mapped from petrol to white
// Crop window over the padded cutout: CROP=pad,left,top,size (defaults keep the head centred)
const [PAD, LEFT, TOP, SIZE] = (process.env.CROP ?? '90,51,30,520').split(',').map(Number)
const OUT = process.env.OUT ?? 'public'

// Pad the top so the head has room, then crop head and shoulders into a square
const padded = await sharp(SOURCE).extend({ top: PAD, background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer()
const { data, info } = await sharp(padded)
  .extract({ left: LEFT, top: TOP, width: SIZE, height: SIZE })
  .resize(480, 480)
  .blur(1.1)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const luminance = i => (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255

// Auto-levels over the opaque (person) pixels
let min = 1
let max = 0
for (let i = 0; i < data.length; i += 4) {
  if (data[i + 3] < 200) continue
  min = Math.min(min, luminance(i))
  max = Math.max(max, luminance(i))
}

const pixels = Buffer.alloc(data.length)
for (let i = 0; i < data.length; i += 4) {
  const l = (luminance(i) - min) / (max - min || 1)
  let k = Math.min(1, Math.max(0, (l - T0) / (T1 - T0)))
  k = k * k * (3 - 2 * k) * (data[i + 3] / 255)
  for (let c = 0; c < 3; c++) pixels[i + c] = Math.round(PETROL[c] + (255 - PETROL[c]) * k)
  pixels[i + 3] = 255
}

const square = await sharp(pixels, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer()
const r = info.width / 2
const circleMask = Buffer.from(`<svg width="${info.width}" height="${info.height}"><circle cx="${r}" cy="${r}" r="${r}"/></svg>`)
const circle = await sharp(square).composite([{ input: circleMask, blend: 'dest-in' }]).png().toBuffer()

await sharp(circle).resize(120, 120).webp({ quality: 90 }).toFile(`${OUT}/images/logo-face.webp`)
await sharp(circle).resize(120, 120).png({ compressionLevel: 9 }).toFile(`${OUT}/images/logo-face.png`)
await sharp(square).resize(180, 180).png({ compressionLevel: 9 }).toFile(`${OUT}/apple-touch-icon.png`)
console.log('wrote public/images/logo-face.{webp,png} and public/apple-touch-icon.png')
