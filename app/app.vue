<script setup lang="ts">
const { t } = useI18n()
const head = useLocaleHead()

useHead(() => ({
  htmlAttrs: { lang: head.value.htmlAttrs.lang },
  link: [...(head.value.link || [])],
  meta: [...(head.value.meta || [])],
}))

useSeoMeta({
  titleTemplate: '%s',
  ogSiteName: 'Harry Keumezeu',
  twitterCard: 'summary_large_image',
})

const skipLabel = computed(() => t('skip'))
</script>

<template>
  <NuxtRouteAnnouncer />
  <a
    href="#main"
    class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
  >{{ skipLabel }}</a>
  <SiteHeader />
  <main id="main">
    <NuxtPage />
  </main>
  <SiteFooter />
</template>
