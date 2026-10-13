<script setup lang="ts">
import { projects, type ProjectKind } from '~/data/profile'

const { t } = useI18n()
const { l } = useLocalized()

type TabId = 'all' | ProjectKind
const tabs = computed(() => (['all', 'professional', 'personal'] as const).map(id => ({
  id,
  label: t(`projects.tabs.${id}`),
  count: id === 'all' ? projects.length : projects.filter(p => p.kind === id).length,
})))

const active = ref<TabId>('all')
const filtered = computed(() => (active.value === 'all' ? projects : projects.filter(p => p.kind === active.value)))

// Pagination: a page-size picker and numbered pages, back to page 1 whenever the set changes
const pageSizes = [10, 20, 30, 40, 50] as const
const pageSize = ref<number>(pageSizes[0])
const page = ref(1)
const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize.value)))
const visible = computed(() => filtered.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value))
const range = computed(() => ({
  from: filtered.value.length ? (page.value - 1) * pageSize.value + 1 : 0,
  to: Math.min(page.value * pageSize.value, filtered.value.length),
  total: filtered.value.length,
}))
watch([active, pageSize], () => {
  page.value = 1
})

// Changing page from the pager below the cards brings the top of the new page into view,
// once the old page has left and the list has its new height
const panel = useTemplateRef<HTMLElement>('panel')
let scrollAfterSwap = false
function goTo(target: number) {
  if (target < 1 || target > pageCount.value || target === page.value) return
  page.value = target
  scrollAfterSwap = true
}
function onAfterLeave() {
  if (!scrollAfterSwap) return
  scrollAfterSwap = false
  nextTick(() => {
    if ((panel.value?.getBoundingClientRect().top ?? 0) < 0) panel.value?.scrollIntoView({ block: 'start' })
  })
}

// Tabs follow the WAI-ARIA pattern: arrow keys move focus and select, Home/End jump
const tabEls = useTemplateRef<HTMLButtonElement[]>('tabEls')
function onKeydown(event: KeyboardEvent) {
  const ids = tabs.value.map(tab => tab.id)
  const index = ids.indexOf(active.value)
  const next = {
    ArrowRight: (index + 1) % ids.length,
    ArrowLeft: (index - 1 + ids.length) % ids.length,
    Home: 0,
    End: ids.length - 1,
  }[event.key]
  if (next === undefined) return
  event.preventDefault()
  active.value = ids[next]!
  tabEls.value?.[next]?.focus()
}

const open = ref(new Set<string>())
function toggle(id: string) {
  const next = new Set(open.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  open.value = next
}
</script>

<template>
  <section
    id="projects"
    class="section section-wide"
    aria-labelledby="projects-title"
  >
    <div
      class="intro-row"
      data-backdrop-clear
    >
      <h2
        id="projects-title"
        class="section-title"
      >
        {{ t('sections.projects') }}
      </h2>
      <p class="intro">
        {{ t('projects.intro') }}
      </p>
    </div>

    <div>
      <div
        role="tablist"
        :aria-label="t('projects.tabsLabel')"
        class="tabs"
        @keydown="onKeydown"
      >
        <button
          v-for="tab in tabs"
          :id="`projects-tab-${tab.id}`"
          ref="tabEls"
          :key="tab.id"
          type="button"
          role="tab"
          class="tab"
          :aria-selected="active === tab.id"
          aria-controls="projects-panel"
          :tabindex="active === tab.id ? 0 : -1"
          @click="active = tab.id"
        >
          {{ tab.label }}
          <span class="tab-count">{{ tab.count }}</span>
        </button>
      </div>

      <div
        id="projects-panel"
        ref="panel"
        role="tabpanel"
        class="panel"
        :aria-labelledby="`projects-tab-${active}`"
      >
        <Transition
          name="swap"
          mode="out-in"
          @after-leave="onAfterLeave"
        >
          <ul
            :key="`${active}-${pageSize}-${page}`"
            class="grid"
          >
            <li
              v-for="project in visible"
              :key="project.id"
            >
              <article class="card">
                <p class="meta">
                  <span>{{ l(project.context) }}</span>
                  <span
                    v-if="project.period"
                    class="tabular-nums"
                  >{{ project.period }}</span>
                </p>
                <h3 class="title">
                  {{ l(project.title) }}
                </h3>
                <p class="summary">
                  {{ l(project.summary) }}
                </p>

                <div class="bottom">
                  <div
                    v-if="project.role"
                    class="role"
                  >
                    <button
                      :id="`role-btn-${project.id}`"
                      type="button"
                      class="role-toggle"
                      :aria-expanded="open.has(project.id)"
                      :aria-controls="`role-${project.id}`"
                      @click="toggle(project.id)"
                    >
                      {{ t('projects.role') }}
                      <span
                        class="plus"
                        aria-hidden="true"
                      />
                    </button>
                    <div
                      :id="`role-${project.id}`"
                      class="role-body"
                      role="region"
                      :aria-labelledby="`role-btn-${project.id}`"
                      :data-open="open.has(project.id)"
                    >
                      <div>
                        <p>{{ l(project.role) }}</p>
                      </div>
                    </div>
                  </div>

                  <footer class="foot">
                    <p class="type">
                      <Icon
                        :name="project.type === 'website' ? 'lucide:globe' : 'lucide:app-window'"
                        class="size-4"
                        aria-hidden="true"
                      />
                      {{ t(`projects.type.${project.type}`) }}
                    </p>
                    <p
                      v-if="project.stack"
                      class="stack-list"
                    >
                      <span class="sr-only">{{ t('experience.stack') }}:</span>
                      <span
                        v-for="tech in project.stack"
                        :key="tech"
                      >{{ tech }}</span>
                    </p>
                    <a
                      v-if="project.url"
                      :href="project.url"
                      class="link visit font-bold"
                      target="_blank"
                      rel="noopener"
                    >{{ t('projects.visit', { name: l(project.title) }) }}</a>
                  </footer>
                </div>
              </article>
            </li>
          </ul>
        </Transition>

        <div class="pager">
          <PageSizeSelect
            v-model="pageSize"
            :options="pageSizes"
            :label="t('projects.perPage')"
          />

          <p
            class="showing"
            aria-live="polite"
          >
            {{ t('projects.showing', range) }}
          </p>

          <nav
            v-if="pageCount > 1"
            class="pages"
            :aria-label="t('projects.pagination')"
          >
            <button
              type="button"
              class="page-btn"
              :disabled="page === 1"
              :aria-label="t('projects.previous')"
              @click="goTo(page - 1)"
            >
              <Icon
                name="lucide:chevron-left"
                class="size-4"
                aria-hidden="true"
              />
            </button>
            <button
              v-for="n in pageCount"
              :key="n"
              type="button"
              class="page-btn"
              :aria-current="n === page ? 'page' : undefined"
              :aria-label="t('projects.page', { n })"
              @click="goTo(n)"
            >
              {{ n }}
            </button>
            <button
              type="button"
              class="page-btn"
              :disabled="page === pageCount"
              :aria-label="t('projects.next')"
              @click="goTo(page + 1)"
            >
              <Icon
                name="lucide:chevron-right"
                class="size-4"
                aria-hidden="true"
              />
            </button>
          </nav>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* This section spans the full width: the cards need the room */
@media (min-width: 900px) {
  .section-wide {
    grid-template-columns: minmax(0, 1fr);
    gap: 2.5rem;
  }

  .section-wide .section-title {
    position: static;
  }
}

.intro-row {
  display: grid;
  gap: 1rem;
}

@media (min-width: 900px) {
  .intro-row {
    grid-template-columns: 14rem minmax(0, 1fr);
    gap: 3rem;
    align-items: baseline;
  }
}

.intro {
  max-width: 40rem;
  color: var(--color-slate);
}

/* Tabs */
.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.75rem;
}

.tab {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-rule);
  border-radius: 999px;
  background: var(--color-paper);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-ink);
  transition: background-color 160ms ease, border-color 160ms ease, color 160ms ease, transform 160ms var(--ease-out);
}

.tab:active {
  transform: scale(0.97);
}

.tab-count {
  font-weight: 400;
  font-variant-numeric: tabular-nums;
  color: var(--color-slate);
  transition: color 160ms ease;
}

.tab[aria-selected='true'] {
  background: var(--color-petrol);
  border-color: var(--color-petrol);
  color: #fff;
}

.tab[aria-selected='true'] .tab-count {
  color: var(--color-mist);
}

@media (hover: hover) and (pointer: fine) {
  .tab[aria-selected='false']:hover {
    border-color: var(--color-petrol);
    color: var(--color-petrol);
  }
}

/* Cards */
.grid {
  display: grid;
  gap: 1rem;
}

@media (min-width: 700px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1080px) {
  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1.25rem;
  }
}

.grid > li {
  display: flex;
}

.card {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1.5rem;
  border: 1px solid var(--color-rule);
  border-radius: 0.875rem;
  background: #fff;
}

.meta {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--color-slate);
}

.title {
  margin-top: 0.75rem;
  font-size: 1.375rem;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.01em;
}

.summary {
  margin-top: 0.625rem;
  font-size: 1rem;
  line-height: 1.55;
}

/* "My role" disclosure: the panel grows from zero height without measuring it */
.bottom {
  margin-top: auto;
  padding-top: 1.25rem;
}

.role-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 2.75rem;
  padding-block: 0.5rem;
  border-top: 1px solid var(--color-rule);
  font-size: 0.9375rem;
  font-weight: 700;
  text-align: left;
}

.plus {
  position: relative;
  width: 0.75rem;
  height: 0.75rem;
}

.plus::before,
.plus::after {
  content: '';
  position: absolute;
  inset: 50% 0 auto;
  height: 1.5px;
  margin-top: -0.75px;
  background: currentColor;
  transition: transform 200ms var(--ease-out);
}

.plus::after {
  transform: rotate(90deg);
}

.role-toggle[aria-expanded='true'] .plus::after {
  transform: rotate(0deg);
}

.role-body {
  display: grid;
  grid-template-rows: 0fr;
  visibility: hidden;
  transition: grid-template-rows 240ms var(--ease-out), visibility 0s linear 240ms;
}

.role-body[data-open='true'] {
  grid-template-rows: 1fr;
  visibility: visible;
  transition: grid-template-rows 240ms var(--ease-out), visibility 0s;
}

.role-body > div {
  min-height: 0;
  overflow: hidden;
}

.role-body p {
  padding-bottom: 0.5rem;
  font-size: 0.9375rem;
  line-height: 1.55;
  color: var(--color-slate);
}

.foot {
  padding-top: 1rem;
  display: grid;
  gap: 0.625rem;
}

.type {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-petrol);
}

.visit {
  font-size: 0.875rem;
}

.foot .stack-list {
  font-size: 0.875rem;
  gap: 0.125rem 0.75rem;
}

/* Pagination */
.panel {
  scroll-margin-top: 6rem;
}

.pager {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1.5rem;
  margin-top: 1.75rem;
  font-size: 0.9375rem;
  color: var(--color-slate);
}

.showing {
  font-variant-numeric: tabular-nums;
}

.pages {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-left: auto;
}

.page-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.75rem;
  min-height: 2.75rem;
  padding: 0 0.75rem;
  border: 1px solid var(--color-rule);
  border-radius: 999px;
  background: var(--color-paper);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--color-ink);
  transition: background-color 160ms ease, border-color 160ms ease, color 160ms ease, transform 160ms var(--ease-out);
}

.page-btn:not(:disabled):active {
  transform: scale(0.97);
}

.page-btn[aria-current='page'] {
  background: var(--color-petrol);
  border-color: var(--color-petrol);
  color: #fff;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (hover: hover) and (pointer: fine) {
  .page-btn:not(:disabled):not([aria-current='page']):hover {
    border-color: var(--color-petrol);
    color: var(--color-petrol);
  }
}

/* Switching tabs: the old set fades out quickly, the new one settles in */
.swap-leave-active {
  transition: opacity 120ms ease;
}

.swap-enter-active {
  transition: opacity 220ms ease, transform 220ms var(--ease-out);
}

.swap-leave-to,
.swap-enter-from {
  opacity: 0;
}

.swap-enter-from {
  transform: translateY(6px);
}

@media (prefers-reduced-motion: reduce) {
  .swap-enter-from {
    transform: none;
  }

  .role-body,
  .role-body[data-open='true'] {
    transition: none;
  }
}
</style>
