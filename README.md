# keuharry.dev

Personal portfolio of Harry Keumezeu Feujio, senior software engineer. Built with Nuxt 4, in English (`/`) and French (`/fr`).

## Develop

```bash
pnpm install
pnpm dev            # http://localhost:3400
```

All content lives in `app/data/profile.ts` (CV content, `{ en, fr }`) and `i18n/locales/*.json` (interface text).

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm generate       # static build in .output/public
pnpm test:a11y      # axe WCAG 2.1 AA scan, needs `pnpm dev` running
node scripts/screenshots.mjs   # full-page screenshots into ./screenshots
pnpm og             # regenerates public/og.png and public/apple-touch-icon.png
```

## Portrait

`scripts/source/portrait-cutout.png` is the original photo with its background removed. The site serves the AVIF/WebP versions in `public/images/harry-480|960.*`. To swap the photo, cut it out, export the same file names, then run `pnpm og`.

## Deploy on Vercel

1. Push this repository to GitHub and import it in Vercel. The Nuxt preset is detected automatically.
2. Keep the default build command (`nuxt build`). Every page is prerendered.
3. In **Settings → Domains**, add `keuharry.dev` (and `www.keuharry.dev` redirecting to it), then set the DNS records Vercel shows at your registrar.

## Security

- Security headers (CSP, HSTS, `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`) are set in `nuxt.config.ts` through `routeRules`. They apply to production builds only, and Nitro passes them on to Vercel. Check them after deploying with `curl -sI https://keuharry.dev`.
- Nuxt DevTools is turned off because its git helper (`simple-git`) has open advisories that `pnpm audit` reports. Turn it back on in `nuxt.config.ts` once `@nuxt/devtools` ships a patched version. Until then, the audit keeps listing it even though it never runs.
