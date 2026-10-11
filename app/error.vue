<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const { t, locale } = useI18n()
const localePath = useLocalePath()

useHead({ htmlAttrs: { lang: locale } })
useSeoMeta({ title: () => t('error.title'), robots: 'noindex' })
</script>

<template>
  <SiteHeader />
  <main
    id="main"
    class="wrap grid min-h-[70dvh] content-center py-24"
  >
    <p class="text-slate">
      {{ props.error.statusCode }}
    </p>
    <h1 class="mt-2 text-[clamp(2.5rem,7vw,4.5rem)] font-black leading-none tracking-[-0.03em]">
      {{ t('error.title') }}
    </h1>
    <p class="mt-5 text-slate">
      {{ t('error.body') }}
    </p>
    <p class="mt-8">
      <NuxtLink
        :to="localePath('/')"
        class="btn btn-solid"
      >
        {{ t('error.home') }}
      </NuxtLink>
    </p>
  </main>
  <SiteFooter />
</template>
