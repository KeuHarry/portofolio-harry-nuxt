<script setup lang="ts">
import { profile } from '~/data/profile'

const { t, locale } = useI18n()
const { l } = useLocalized()
const switchLocalePath = useSwitchLocalePath()
const localePath = useLocalePath()

const other = computed(() => (locale.value === 'fr' ? 'en' : 'fr'))
const links = computed(() => [
  { id: 'about', label: t('nav.about') },
  { id: 'experience', label: t('nav.experience') },
  { id: 'projects', label: t('nav.project') },
  { id: 'contact', label: t('nav.contact') },
])

// Hairline under the bar only once the page has scrolled
const scrolled = ref(false)
onMounted(() => {
  const onScroll = () => {
    scrolled.value = window.scrollY > 8
  }
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
})
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b bg-paper/90 backdrop-blur-md transition-[border-color] duration-200"
    :class="scrolled ? 'border-rule' : 'border-transparent'"
  >
    <div class="wrap flex h-16 items-center justify-between gap-6">
      <NuxtLink
        :to="localePath('/')"
        class="brand"
        :aria-label="t('nav.home')"
      >
        <picture>
          <source
            type="image/webp"
            srcset="/images/logo-face.webp"
          >
          <img
            src="/images/logo-face.png"
            width="40"
            height="40"
            alt=""
            class="brand-face"
          >
        </picture>
        <span class="brand-text">
          <span class="brand-name">{{ profile.shortName }}</span>
          <span class="brand-role">{{ l(profile.role) }}</span>
        </span>
      </NuxtLink>

      <nav
        :aria-label="t('nav.label')"
        class="flex items-center gap-1 sm:gap-2"
      >
        <a
          v-for="(link, i) in links"
          :key="link.id"
          :href="`#${link.id}`"
          class="nav-link"
          :class="{ 'max-md:hidden': i < links.length - 1 }"
        >{{ link.label }}</a>
        <NuxtLink
          :to="switchLocalePath(other)"
          :hreflang="other"
          :lang="other"
          class="lang"
          :aria-label="t('nav.switchTo')"
        >
          {{ t('nav.switchShort') }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
  border-radius: 999px;
}

.brand-face {
  display: block;
  flex: none;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  transition: transform 160ms var(--ease-out);
}

.brand:active .brand-face {
  transform: scale(0.95);
}

.brand-text {
  display: grid;
  line-height: 1.2;
}

.brand-name {
  font-size: 0.9375rem;
  font-weight: 900;
  letter-spacing: -0.005em;
  white-space: nowrap;
}

.brand-role {
  font-size: 0.8125rem;
  color: var(--color-slate);
  white-space: nowrap;
}

.nav-link {
  padding: 0.5rem 0.75rem;
  border-radius: 999px;
  font-size: 0.9375rem;
  color: var(--color-slate);
  transition: color 160ms ease;
}

.lang {
  margin-left: 0.25rem;
  display: inline-grid;
  place-items: center;
  min-width: 2.75rem;
  height: 2.25rem;
  padding-inline: 0.75rem;
  border: 1px solid var(--color-rule);
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--color-ink);
  transition: border-color 160ms ease, color 160ms ease, transform 160ms var(--ease-out);
}

.lang:active {
  transform: scale(0.96);
}

@media (hover: hover) and (pointer: fine) {
  .nav-link:hover {
    color: var(--color-ink);
  }

  .lang:hover {
    border-color: var(--color-petrol);
    color: var(--color-petrol);
  }
}
</style>
