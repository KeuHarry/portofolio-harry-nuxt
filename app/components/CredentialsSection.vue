<script setup lang="ts">
import { certifications, education } from '~/data/profile'

const { t } = useI18n()
const { l, month } = useLocalized()
</script>

<template>
  <section
    id="credentials"
    class="section"
    aria-labelledby="credentials-title"
  >
    <h2
      id="credentials-title"
      class="section-title"
    >
      {{ t('sections.credentials') }}
    </h2>
    <div class="grid gap-10 md:grid-cols-2 md:gap-12">
      <div>
        <h3 class="mb-4 text-slate">
          {{ t('credentials.education') }}
        </h3>
        <p class="font-bold leading-snug">
          {{ l(education.degree) }}
        </p>
        <p class="mt-1 text-[0.9375rem] text-slate">
          {{ education.school }}, {{ l(education.place) }}
        </p>
        <p class="text-[0.9375rem] text-slate">
          <time :datetime="education.date">{{ month(education.date) }}</time>
        </p>
      </div>
      <div>
        <h3 class="mb-4 text-slate">
          {{ t('credentials.certifications') }}
        </h3>
        <ul class="grid gap-4">
          <li
            v-for="cert in certifications"
            :key="cert.name"
          >
            <p class="font-bold leading-snug">
              {{ cert.name }}
            </p>
            <p class="mt-1 text-[0.9375rem] text-slate">
              {{ cert.issuer }}, <time :datetime="cert.date">{{ month(cert.date) }}</time>
            </p>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
