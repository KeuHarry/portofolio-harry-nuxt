// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

const siteUrl = 'https://keuharry.dev'

// Security headers for the deployed site (Nitro passes route rules on to Vercel).
// Nuxt injects an import map, a small config script and inline styles, so inline
// scripts and styles must be allowed; everything else is limited to this origin.
const securityHeaders = {
  'Content-Security-Policy': [
    `default-src 'self'`,
    `script-src 'self' 'unsafe-inline'`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data:`,
    `font-src 'self' data:`,
    `connect-src 'self'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `upgrade-insecure-requests`,
  ].join('; '),
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
}

export default defineNuxtConfig({

  modules: ['@nuxt/eslint', '@nuxt/icon', '@nuxtjs/i18n', '@nuxtjs/sitemap', '@nuxtjs/robots'],
  // Off: its git helper (simple-git) has open advisories, and the overlay isn't needed
  devtools: { enabled: false },

  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#F6F7F5' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: siteUrl,
    name: 'Harry Keumezeu',
  },

  // Production only, so the headers never get in the way of the Vite dev server
  routeRules: process.env.NODE_ENV === 'production'
    ? { '/**': { headers: securityHeaders } }
    : {},

  compatibilityDate: '2025-07-15',

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/fr'],
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  eslint: {
    config: { stylistic: true },
  },

  i18n: {
    baseUrl: siteUrl,
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    detectBrowserLanguage: false,
    locales: [
      { code: 'en', language: 'en-GB', name: 'English', file: 'en.json' },
      { code: 'fr', language: 'fr-FR', name: 'Français', file: 'fr.json' },
    ],
  },

  icon: {
    serverBundle: 'local',
    clientBundle: { scan: true },
  },
})
