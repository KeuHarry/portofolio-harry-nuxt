<script setup lang="ts">
import { about, facts } from '~/data/profile'

const { t } = useI18n()
const { l } = useLocalized()
</script>

<template>
  <section
    id="about"
    class="section"
    aria-labelledby="about-title"
  >
    <h2
      id="about-title"
      class="section-title"
    >
      {{ t('sections.about') }}
    </h2>
    <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-12">
      <div class="prose-measure space-y-5">
        <p
          v-for="(paragraph, i) in about"
          :key="i"
        >
          {{ l(paragraph) }}
        </p>
      </div>
      <dl class="space-y-5 text-[0.9375rem] lg:border-l lg:border-rule lg:pl-8">
        <div
          v-for="fact in facts"
          :key="fact.label.en"
        >
          <dt class="text-slate">
            {{ l(fact.label) }}
          </dt>
          <dd class="font-bold">
            {{ l(fact.value) }}
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>
