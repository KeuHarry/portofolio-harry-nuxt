<script setup lang="ts">
/*
 * Ambient "fiber network" behind the projects: bundles of fine petrol lines that
 * pinch together at junctions, a few strands crossing between bundles, and light
 * pulses travelling along them.
 *
 * Two canvases: the fibers are drawn once on one the size of the section. The
 * pulses are redrawn each frame on a second, viewport-sized canvas that stays
 * stuck to the screen while the section scrolls, so per-frame work never scales
 * with the section's height. The loop stops while the section is off-screen or
 * the tab is hidden, and reduced motion shows the fibers alone.
 */

const host = useTemplateRef<HTMLDivElement>('host')
const staticCanvas = useTemplateRef<HTMLCanvasElement>('staticCanvas')
const pulseCanvas = useTemplateRef<HTMLCanvasElement>('pulseCanvas')

interface Fiber {
  xs: Float32Array
  ys: Float32Array
  lengths: Float32Array // cumulative length at each point
  total: number
}

interface Pulse {
  fiber: number
  s: number // distance of the head along the fiber
  dir: 1 | -1
  speed: number // px per second
  length: number // trail length in px
  wait: number // seconds before it starts
}

const LINE = 'rgba(31, 94, 110, 0.13)'
const NODE_STROKE = 'rgba(31, 94, 110, 0.38)'
const NODE_HALO = 'rgba(31, 94, 110, 0.07)'
const PAPER = '#f6f7f5'
const PULSE_RGB = '42, 140, 163' // a brighter petrol, so the signal reads as light
const MAX_PIXELS = 7_000_000 // per canvas, keeps memory sane on tall phone layouts

// Deterministic randomness: the network keeps the same character across resizes
function random(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function toFiber(xs: number[], ys: number[]): Fiber {
  const lengths = new Float32Array(xs.length)
  for (let i = 1; i < xs.length; i++) {
    lengths[i] = lengths[i - 1]! + Math.hypot(xs[i]! - xs[i - 1]!, ys[i]! - ys[i - 1]!)
  }
  return { xs: Float32Array.from(xs), ys: Float32Array.from(ys), lengths, total: lengths[lengths.length - 1]! }
}

function buildNetwork(width: number, height: number) {
  const rand = random(20190101)
  const between = (min: number, max: number) => min + rand() * (max - min)
  const STEP = 6
  const fibers: Fiber[] = []
  const nodes: { x: number, y: number }[] = []

  const bundleCount = Math.max(2, Math.round(height / 440))
  const centres: ((x: number) => number)[] = []

  for (let b = 0; b < bundleCount; b++) {
    const baseY = ((b + 0.5) * height) / bundleCount + between(-40, 40)
    const amp = between(36, 96)
    const freq = (between(0.7, 1.3) * Math.PI * 2) / Math.max(width, 600)
    const phase = between(0, Math.PI * 2)
    const slope = between(-0.05, 0.05)
    const centre = (x: number) => baseY + slope * (x - width / 2) + amp * Math.sin(freq * x + phase)
    centres.push(centre)

    // Strands spread apart between junctions and meet at them
    const knotGap = between(260, 420)
    const knotShift = between(0, knotGap)
    const spread = (x: number) => Math.abs(Math.sin((Math.PI * (x + knotShift)) / knotGap))
    const strands = 4 + Math.floor(rand() * 3)

    for (let f = 0; f < strands; f++) {
      const offset = (f - (strands - 1) / 2) * between(7, 11)
      const wobble = between(3, 9)
      const wobbleFreq = between(0.004, 0.012)
      const wobblePhase = between(0, Math.PI * 2)
      const xs: number[] = []
      const ys: number[] = []
      for (let x = -40; x <= width + 40; x += STEP) {
        const s = spread(x)
        xs.push(x)
        ys.push(centre(x) + offset * s * 2.4 + wobble * s * Math.sin(wobbleFreq * x + wobblePhase))
      }
      fibers.push(toFiber(xs, ys))
    }

    // Junctions sit where the spread is zero
    for (let k = Math.ceil((40 + knotShift) / knotGap); ; k++) {
      const x = k * knotGap - knotShift
      if (x > width - 40) break
      if (x >= 40) nodes.push({ x, y: centre(x) })
    }
  }

  // A couple of strands hand over from one bundle to the next
  for (let b = 0; b < centres.length - 1; b++) {
    const crossings = 1 + Math.floor(rand() * 2)
    for (let c = 0; c < crossings; c++) {
      const start = between(0.05, 0.55) * width
      const end = start + between(0.25, 0.45) * width
      const from = centres[b]!
      const to = centres[b + 1]!
      const xs: number[] = []
      const ys: number[] = []
      for (let x = -40; x <= width + 40; x += STEP) {
        let t = Math.min(1, Math.max(0, (x - start) / (end - start)))
        t = t * t * (3 - 2 * t)
        xs.push(x)
        ys.push(from(x) + (to(x) - from(x)) * t)
      }
      fibers.push(toFiber(xs, ys))
    }
  }

  return { fibers, nodes }
}

// Point at distance s along a fiber (binary search over the cumulative lengths)
function indexAt(fiber: Fiber, s: number) {
  let lo = 0
  let hi = fiber.lengths.length - 1
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (fiber.lengths[mid]! < s) lo = mid + 1
    else hi = mid
  }
  return lo
}

let cleanup: (() => void) | undefined
onBeforeUnmount(() => cleanup?.())

onMounted(() => {
  const el = host.value
  const base = staticCanvas.value
  const top = pulseCanvas.value
  if (!el || !base || !top) return
  const baseCtx = base.getContext('2d')
  const ctx = top.getContext('2d')
  if (!baseCtx || !ctx) return

  const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  let fibers: Fiber[] = []
  let pulses: Pulse[] = []
  let dpr = 1
  let pulseDpr = 1
  let size = { width: 0, height: 0 }
  let view = { width: 0, height: 0 }
  let frame = 0
  let last = 0
  let onScreen = false
  let fadeStart = 0
  let fadeTop = 0
  let fadeBottom = 0

  const rand = random(7)
  const between = (min: number, max: number) => min + rand() * (max - min)

  function spawn(pulse: Pulse, initial = false) {
    pulse.fiber = Math.floor(rand() * fibers.length)
    pulse.dir = rand() < 0.5 ? 1 : -1
    pulse.speed = between(70, 150)
    pulse.length = between(90, 170)
    pulse.wait = initial ? between(0, 3) : between(0.6, 3.5)
    const total = fibers[pulse.fiber]!.total
    pulse.s = pulse.dir === 1 ? 0 : total
  }

  function layout() {
    const rect = el!.getBoundingClientRect()
    const width = Math.round(rect.width)
    const height = Math.round(rect.height)
    if (!width || !height) return
    size = { width, height }
    dpr = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(MAX_PIXELS / (width * height)))
    base!.width = Math.round(width * dpr)
    base!.height = Math.round(height * dpr)
    // The pulse canvas covers only the visible part of the section
    view = { width, height: Math.round(top!.getBoundingClientRect().height) }
    pulseDpr = Math.min(window.devicePixelRatio || 1, 2)
    top!.width = Math.round(view.width * pulseDpr)
    top!.height = Math.round(view.height * pulseDpr)

    const network = buildNetwork(width, height)
    fibers = network.fibers

    // Fibers and junctions: drawn once
    baseCtx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    baseCtx!.clearRect(0, 0, width, height)
    baseCtx!.lineWidth = 1
    baseCtx!.strokeStyle = LINE
    for (const fiber of fibers) {
      baseCtx!.beginPath()
      baseCtx!.moveTo(fiber.xs[0]!, fiber.ys[0]!)
      for (let i = 1; i < fiber.xs.length; i++) baseCtx!.lineTo(fiber.xs[i]!, fiber.ys[i]!)
      baseCtx!.stroke()
    }
    for (const node of network.nodes) {
      baseCtx!.beginPath()
      baseCtx!.arc(node.x, node.y, 7, 0, Math.PI * 2)
      baseCtx!.fillStyle = NODE_HALO
      baseCtx!.fill()
      baseCtx!.beginPath()
      baseCtx!.arc(node.x, node.y, 2.75, 0, Math.PI * 2)
      baseCtx!.fillStyle = PAPER
      baseCtx!.fill()
      baseCtx!.strokeStyle = NODE_STROKE
      baseCtx!.stroke()
    }

    // Fade the network out at the top and bottom of the band (once, not a CSS mask:
    // a mask over an animating canvas would re-rasterise the whole layer every frame)
    // Keep the area above the section's [data-backdrop-clear] element (its heading
    // and intro) empty, then let the network fade in below it
    const marker = el!.parentElement?.querySelector('[data-backdrop-clear]')
    const clearBottom = marker ? marker.getBoundingClientRect().bottom - rect.top : 0
    fadeStart = Math.max(0, clearBottom - 10)
    fadeTop = Math.min(height * 0.3, fadeStart + 140)
    fadeBottom = Math.min(height * 0.12, 160)
    const fade = baseCtx!.createLinearGradient(0, 0, 0, height)
    fade.addColorStop(0, 'rgba(0, 0, 0, 0)')
    fade.addColorStop(fadeStart / height, 'rgba(0, 0, 0, 0)')
    fade.addColorStop(fadeTop / height, 'rgba(0, 0, 0, 1)')
    fade.addColorStop(1 - fadeBottom / height, 'rgba(0, 0, 0, 1)')
    fade.addColorStop(1, 'rgba(0, 0, 0, 0)')
    baseCtx!.globalCompositeOperation = 'destination-in'
    baseCtx!.fillStyle = fade
    baseCtx!.fillRect(0, 0, width, height)
    baseCtx!.globalCompositeOperation = 'source-over'

    ctx!.setTransform(1, 0, 0, 1, 0, 0)
    ctx!.clearRect(0, 0, top!.width, top!.height)
    const count = Math.min(18, Math.max(4, Math.round(fibers.length * 0.35)))
    pulses = Array.from({ length: count }, () => {
      const pulse = {} as Pulse
      spawn(pulse, true)
      return pulse
    })
  }

  function drawPulses(dt: number) {
    // Where the sticky canvas currently sits inside the section
    const offset = top!.getBoundingClientRect().top - el!.getBoundingClientRect().top
    ctx!.setTransform(1, 0, 0, 1, 0, 0)
    ctx!.clearRect(0, 0, top!.width, top!.height)
    ctx!.setTransform(pulseDpr, 0, 0, pulseDpr, 0, -offset * pulseDpr)

    for (const pulse of pulses) {
      if (pulse.wait > 0) {
        pulse.wait -= dt
        continue
      }
      const fiber = fibers[pulse.fiber]!
      pulse.s += pulse.dir * pulse.speed * dt
      const head = pulse.s
      const tail = head - pulse.dir * pulse.length
      // Finished once the whole trail has left the fiber
      if ((pulse.dir === 1 && tail > fiber.total) || (pulse.dir === -1 && tail < 0)) {
        spawn(pulse)
        continue
      }

      const a = Math.max(0, Math.min(fiber.total, Math.min(head, tail)))
      const b = Math.max(0, Math.min(fiber.total, Math.max(head, tail)))
      if (b - a < 1) continue
      const i0 = indexAt(fiber, a)
      const i1 = indexAt(fiber, b)
      if (i1 <= i0) continue

      const hi = pulse.dir === 1 ? i1 : i0
      const ti = pulse.dir === 1 ? i0 : i1
      const headY = fiber.ys[hi]!
      if (headY < offset - pulse.length || headY > offset + view.height + pulse.length) continue
      const fadeAlpha = Math.min(1, Math.max(0, Math.min((headY - fadeStart) / (fadeTop - fadeStart), (size.height - headY) / fadeBottom)))
      if (fadeAlpha <= 0.02) continue
      const gradient = ctx!.createLinearGradient(fiber.xs[ti]!, fiber.ys[ti]!, fiber.xs[hi]!, fiber.ys[hi]!)
      gradient.addColorStop(0, `rgba(${PULSE_RGB}, 0)`)
      gradient.addColorStop(1, `rgba(${PULSE_RGB}, 0.85)`)

      ctx!.beginPath()
      ctx!.moveTo(fiber.xs[i0]!, fiber.ys[i0]!)
      for (let i = i0 + 1; i <= i1; i++) ctx!.lineTo(fiber.xs[i]!, fiber.ys[i]!)
      ctx!.lineCap = 'round'
      ctx!.strokeStyle = gradient
      ctx!.globalAlpha = 0.18 * fadeAlpha
      ctx!.lineWidth = 6
      ctx!.stroke()
      ctx!.globalAlpha = fadeAlpha
      ctx!.lineWidth = 1.5
      ctx!.stroke()

      // The head itself: a small bright point
      ctx!.beginPath()
      ctx!.arc(fiber.xs[hi]!, fiber.ys[hi]!, 2, 0, Math.PI * 2)
      ctx!.fillStyle = `rgba(${PULSE_RGB}, 0.9)`
      ctx!.fill()
      ctx!.globalAlpha = 1
    }
  }

  function tick(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000) // a long pause must not teleport pulses
    last = now
    drawPulses(dt)
    frame = requestAnimationFrame(tick)
  }

  function start() {
    if (frame || reduceQuery.matches || !onScreen || document.hidden || !fibers.length) return
    last = performance.now()
    frame = requestAnimationFrame(tick)
  }

  function stop() {
    cancelAnimationFrame(frame)
    frame = 0
  }

  function onMotionChange() {
    if (reduceQuery.matches) {
      stop()
      ctx!.setTransform(1, 0, 0, 1, 0, 0)
      ctx!.clearRect(0, 0, top!.width, top!.height)
    }
    else {
      start()
    }
  }

  function onVisibility() {
    if (document.hidden) stop()
    else start()
  }

  // Rebuild when the section changes size (window resize, switching project tabs)
  let resizeTimer: ReturnType<typeof setTimeout> | undefined
  const resizer = new ResizeObserver(() => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      const rect = el.getBoundingClientRect()
      const viewHeight = Math.round(top.getBoundingClientRect().height)
      if (Math.round(rect.width) === size.width && Math.round(rect.height) === size.height && viewHeight === view.height) return
      stop()
      layout()
      start()
    }, 120)
  })

  const watcher = new IntersectionObserver(([entry]) => {
    onScreen = !!entry?.isIntersecting
    if (onScreen) start()
    else stop()
  }, { rootMargin: '100px 0px' })

  layout()
  resizer.observe(el)
  resizer.observe(top)
  watcher.observe(el)
  reduceQuery.addEventListener('change', onMotionChange)
  document.addEventListener('visibilitychange', onVisibility)

  cleanup = () => {
    stop()
    clearTimeout(resizeTimer)
    resizer.disconnect()
    watcher.disconnect()
    reduceQuery.removeEventListener('change', onMotionChange)
    document.removeEventListener('visibilitychange', onVisibility)
  }
})
</script>

<template>
  <div
    ref="host"
    class="backdrop"
    aria-hidden="true"
  >
    <canvas
      ref="staticCanvas"
      class="fibers"
    />
    <canvas
      ref="pulseCanvas"
      class="pulses"
    />
  </div>
</template>

<style scoped>
.backdrop {
  position: absolute;
  inset: 0;
  pointer-events: none;
  /* clip, not hidden: hidden would make this the sticky canvas's scroll container */
  overflow: clip;
}

canvas {
  display: block;
  width: 100%;
}

.fibers {
  position: absolute;
  inset: 0;
  height: 100%;
}

.pulses {
  position: sticky;
  top: 0;
  height: 100vh;
  max-height: 100%;
}
</style>
