<script setup lang="ts">
import { profile } from '~/data/profile'

const { t, locale } = useI18n()
const siteUrl = 'https://keuharry.dev'

useSeoMeta({
  title: () => t('meta.title'),
  description: () => t('meta.description'),
  ogTitle: () => t('meta.title'),
  ogDescription: () => t('meta.description'),
  ogType: 'profile',
  ogImage: `${siteUrl}/og.png`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: () => t('meta.title'),
  twitterImage: `${siteUrl}/og.png`,
})

useHead(() => ({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      'name': profile.name,
      'jobTitle': locale.value === 'fr' ? profile.role.fr : profile.role.en,
      'url': siteUrl,
      'image': `${siteUrl}/images/harry-960.webp`,
      'email': `mailto:${profile.email}`,
      'address': { '@type': 'PostalAddress', 'addressLocality': 'Accra', 'addressCountry': 'GH' },
      'sameAs': [profile.links.linkedin, profile.links.github],
      'knowsLanguage': ['en', 'fr'],
    }),
  }],
}))
</script>

<template>
  <div>
    <HeroIntro />
    <div class="wrap">
      <AboutSection />
      <ExperienceGraph />
    </div>
    <div class="projects-band">
      <NetworkBackdrop />
      <div class="wrap relative">
        <ProjectsSection />
      </div>
    </div>
    <div class="wrap">
      <SkillsList />
      <CredentialsSection />
    </div>
    <div class="contact-band">
      <div class="wrap">
        <ContactSection />
      </div>
    </div>
  </div>
</template>

<style scoped>
.projects-band {
  position: relative;
}

/* Same hairlines as between the other sections: only as wide as the content */
.projects-band :deep(.section) {
  border-block: 1px solid var(--color-rule);
}

.contact-band {
  background: var(--color-mist-soft);
  border-top: 1px solid color-mix(in srgb, var(--color-petrol) 12%, transparent);
}
</style>
