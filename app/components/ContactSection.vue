<script setup lang="ts">
import { profile } from '~/data/profile'

const { t } = useI18n()

type CopyState = 'idle' | 'copied' | 'failed'
const state = ref<CopyState>('idle')
const emailLink = useTemplateRef<HTMLAnchorElement>('emailLink')
let timer: ReturnType<typeof setTimeout> | undefined

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(profile.email)
    state.value = 'copied'
  }
  catch {
    // Clipboard blocked: select the address so it can be copied by hand
    state.value = 'failed'
    if (emailLink.value) window.getSelection()?.selectAllChildren(emailLink.value)
  }
  clearTimeout(timer)
  timer = setTimeout(() => (state.value = 'idle'), state.value === 'failed' ? 4000 : 2000)
}

onBeforeUnmount(() => clearTimeout(timer))

const label = computed(() => (state.value === 'copied' ? t('contact.copied') : t('contact.copy')))
</script>

<template>
  <section
    id="contact"
    class="section"
    aria-labelledby="contact-title"
  >
    <h2
      id="contact-title"
      class="section-title"
    >
      {{ t('sections.contact') }}
    </h2>
    <div>
      <p class="cta">
        {{ t('contact.cta') }}
      </p>
      <p class="prose-measure mt-4 text-slate">
        {{ t('contact.lead') }}
      </p>
      <a
        ref="emailLink"
        :href="`mailto:${profile.email}`"
        class="email"
      >{{ profile.email }}</a>

      <div class="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          class="btn btn-ghost copy"
          :data-state="state"
          @click="copyEmail"
        >
          <span class="icon-swap">
            <Icon
              name="lucide:copy"
              class="icon icon-copy"
              aria-hidden="true"
            />
            <Icon
              name="lucide:check"
              class="icon icon-check"
              aria-hidden="true"
            />
          </span>
          <span>{{ label }}</span>
        </button>
        <a
          :href="profile.links.linkedin"
          class="btn btn-ghost"
          rel="me noopener"
          target="_blank"
        >
          <Icon
            name="simple-icons:linkedin"
            class="size-4"
            aria-hidden="true"
          />
          LinkedIn
        </a>
        <a
          :href="profile.links.github"
          class="btn btn-ghost"
          rel="me noopener"
          target="_blank"
        >
          <Icon
            name="simple-icons:github"
            class="size-4"
            aria-hidden="true"
          />
          GitHub
        </a>
      </div>
      <p
        class="mt-3 min-h-6 text-[0.9375rem] text-slate"
        aria-live="polite"
      >
        <span v-if="state === 'copied'">{{ t('contact.copiedAddress', { email: profile.email }) }}</span>
        <span v-else-if="state === 'failed'">{{ t('contact.copyFailed') }}</span>
      </p>
    </div>
  </section>
</template>

<style scoped>
.cta {
  max-width: 22ch;
  font-size: clamp(1.875rem, 4.4vw, 3rem);
  font-weight: 900;
  line-height: 1.08;
  letter-spacing: -0.025em;
  text-wrap: balance;
}

.email {
  display: inline-block;
  margin-top: 1.5rem;
  font-size: clamp(1.25rem, 2.6vw, 1.75rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: var(--color-petrol);
  overflow-wrap: anywhere;
  text-decoration-line: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 0.2em;
  text-decoration-color: color-mix(in srgb, var(--color-petrol) 35%, transparent);
  transition: text-decoration-color 200ms ease, color 200ms ease;
}

@media (hover: hover) and (pointer: fine) {
  .email:hover {
    text-decoration-color: var(--color-petrol);
  }
}

/* Copy button: the copy icon gives way to a check, crossfaded with a slight blur */
.icon-swap {
  position: relative;
  display: inline-grid;
  width: 1.125rem;
  height: 1.125rem;
}

.icon {
  grid-area: 1 / 1;
  width: 100%;
  height: 100%;
  transition: opacity 200ms ease, transform 200ms var(--ease-out), filter 200ms ease;
}

.icon-check {
  opacity: 0;
  transform: scale(0.6);
  filter: blur(2px);
  color: var(--color-petrol);
}

.copy[data-state='copied'] .icon-copy {
  opacity: 0;
  transform: scale(0.6);
  filter: blur(2px);
}

.copy[data-state='copied'] .icon-check {
  opacity: 1;
  transform: scale(1);
  filter: blur(0);
}

@media (prefers-reduced-motion: reduce) {
  .icon {
    transform: none !important;
    filter: none !important;
  }
}

/* Ghost buttons sit on the tinted band: give them a solid fill */
.btn-ghost {
  background: #fff;
}
</style>
