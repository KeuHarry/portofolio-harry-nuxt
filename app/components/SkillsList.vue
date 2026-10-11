<script setup lang="ts">
import { skills } from '~/data/profile'

const { t } = useI18n()
const { l } = useLocalized()
</script>

<template>
  <section
    id="skills"
    class="section"
    aria-labelledby="skills-title"
  >
    <h2
      id="skills-title"
      class="section-title"
    >
      {{ t('sections.skills') }}
    </h2>
    <dl class="grid gap-x-10 gap-y-6 sm:grid-cols-[11rem_minmax(0,1fr)]">
      <template
        v-for="skill in skills"
        :key="skill.group.en"
      >
        <dt class="font-bold">
          {{ l(skill.group) }}
        </dt>
        <dd class="prose-measure -mt-5 sm:mt-0">
          {{ l(skill.items) }}
        </dd>
      </template>
    </dl>
  </section>
</template>
