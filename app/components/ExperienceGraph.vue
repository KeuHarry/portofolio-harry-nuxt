<script setup lang="ts">
import { experience } from '~/data/profile'

const { t } = useI18n()
const { l, month } = useLocalized()
</script>

<template>
  <section
    id="experience"
    class="section"
    aria-labelledby="experience-title"
  >
    <h2
      id="experience-title"
      class="section-title"
    >
      {{ t('sections.experience') }}
    </h2>
    <div>
      <p class="sr-only">
        {{ t('experience.graphNote') }}
      </p>
      <ol class="graph">
        <li
          v-for="(role, i) in experience"
          :key="role.id"
          class="row"
          :class="{ first: i === 0, last: i === experience.length - 1 }"
        >
          <div
            class="rail"
            aria-hidden="true"
          >
            <span class="track track-main" />
            <span
              v-if="role.lane === 1"
              class="track track-branch"
              :class="{ 'from-merge': role.mergesAbove, 'to-branch': role.branchesBelow }"
            />
            <svg
              v-if="role.mergesAbove"
              class="curve curve-top"
              viewBox="0 0 24 24"
              preserveAspectRatio="none"
            ><path d="M24 24 C24 12 0 12 0 0" /></svg>
            <svg
              v-if="role.branchesBelow"
              class="curve curve-bottom"
              viewBox="0 0 24 24"
              preserveAspectRatio="none"
            ><path d="M24 0 C24 12 0 12 0 24" /></svg>
            <span
              class="node"
              :class="role.lane === 1 ? 'node-branch' : 'node-main'"
            />
          </div>

          <article
            class="body"
            :class="{ 'is-branch': role.lane === 1 }"
          >
            <header class="head">
              <h3 class="title">
                {{ l(role.title) }}
              </h3>
              <p class="dates">
                <time :datetime="role.start">{{ month(role.start) }}</time>
                –
                <time :datetime="role.end">{{ month(role.end) }}</time>
              </p>
              <p class="where">
                <span class="font-bold text-ink">{{ role.company }}</span>, {{ l(role.place) }}
              </p>
            </header>
            <ul class="points">
              <li
                v-for="(point, j) in role.points"
                :key="j"
              >
                {{ l(point) }}
              </li>
            </ul>
            <p class="stack-list mt-4">
              <span class="sr-only">{{ t('experience.stack') }}:</span>
              <span
                v-for="tech in role.stack"
                :key="tech"
              >{{ tech }}</span>
            </p>
            <aside
              v-if="role.reference"
              class="reference"
              :aria-label="`${t('experience.reference')}, ${role.company}`"
            >
              <p class="reference-label">
                {{ t('experience.reference') }}
              </p>
              <p>
                <span class="font-bold text-ink">{{ role.reference.name }}</span>,
                {{ l(role.reference.title) }}, {{ l(role.reference.place) }}
              </p>
              <p class="reference-contact">
                <a
                  :href="`mailto:${role.reference.email}`"
                  class="link"
                  :aria-label="t('experience.email', { name: role.reference.name })"
                >{{ role.reference.email }}</a>
                <a
                  :href="`tel:${role.reference.phone.replace(/\s/g, '')}`"
                  class="link tabular-nums"
                  :aria-label="t('experience.call', { name: role.reference.name })"
                >{{ role.reference.phone }}</a>
              </p>
            </aside>
          </article>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
/*
 * Commit graph. Lane 0 is the main line; lane 1 is a short branch for the two
 * roles at the same company. Geometry: lanes sit 24px apart, node centres line
 * up with the first line of each role title.
 */
.graph {
  --lane-0: 11px;
  --lane-gap: 24px;
  --pad: 3rem;
  --node-y: calc(var(--pad) + 0.8rem);
  --line: color-mix(in srgb, var(--color-petrol) 45%, var(--color-paper));
}

.row {
  position: relative;
  display: grid;
  grid-template-columns: 3.25rem minmax(0, 1fr);
  padding-top: var(--pad);
}

.row.first {
  padding-top: 0;
  --node-y: 0.8rem;
}

/* The rail spans the whole row, padding included, so lines join across rows */
.rail {
  position: absolute;
  inset: 0 auto 0 0;
  width: 3.25rem;
}

.body {
  grid-column: 2;
}

.track {
  position: absolute;
  width: 2px;
  background: var(--line);
}

.track-main {
  left: calc(var(--lane-0) - 1px);
  top: 0;
  bottom: 0;
}

.first .track-main {
  top: var(--node-y);
}

.last .track-main {
  height: var(--node-y);
  bottom: auto;
}

.track-branch {
  left: calc(var(--lane-0) + var(--lane-gap) - 1px);
  top: 0;
  bottom: 0;
}

.track-branch.from-merge {
  top: 24px;
}

.track-branch.to-branch {
  bottom: 24px;
}

.curve {
  position: absolute;
  left: var(--lane-0);
  width: var(--lane-gap);
  height: 24px;
  overflow: visible;
  fill: none;
  stroke: var(--line);
  stroke-width: 2px;
  vector-effect: non-scaling-stroke;
}

.curve path {
  vector-effect: non-scaling-stroke;
}

.curve-top {
  top: 0;
}

.curve-bottom {
  bottom: 0;
}

.node {
  position: absolute;
  top: var(--node-y);
  width: 12px;
  height: 12px;
  border-radius: 999px;
  translate: -50% -50%;
}

.node-main {
  left: var(--lane-0);
  background: var(--color-petrol);
  box-shadow: 0 0 0 4px var(--color-paper);
}

.node-branch {
  left: calc(var(--lane-0) + var(--lane-gap));
  background: var(--color-paper);
  border: 2px solid var(--color-petrol);
  box-shadow: 0 0 0 3px var(--color-paper);
}

.body.is-branch {
  padding-left: 1.5rem;
}

.head {
  display: grid;
  gap: 0.125rem 1.5rem;
}

@media (min-width: 640px) {
  .head {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .dates {
    grid-column: 2;
    grid-row: 1;
    text-align: right;
  }
}

.title {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.3;
}

.dates,
.where {
  font-size: 0.9375rem;
  color: var(--color-slate);
  font-variant-numeric: tabular-nums;
}

.dates {
  white-space: nowrap;
}

.points {
  margin-top: 0.875rem;
  max-width: 64ch;
  display: grid;
  gap: 0.5rem;
}

.points li {
  position: relative;
  padding-left: 1.125rem;
}

.reference {
  margin-top: 1rem;
  max-width: 64ch;
  padding: 0.875rem 1rem;
  border-left: 2px solid var(--line);
  background: color-mix(in srgb, var(--color-petrol) 5%, var(--color-paper));
  border-radius: 0 0.5rem 0.5rem 0;
  font-size: 0.9375rem;
  color: var(--color-slate);
}

.reference-label {
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-petrol);
}

.reference-contact {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.25rem;
  margin-top: 0.25rem;
  overflow-wrap: anywhere;
}

.points li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.8em;
  width: 0.5rem;
  height: 1px;
  background: var(--color-slate);
}
</style>
