<script setup lang="ts">
import { profile } from '~/data/profile'

const { t } = useI18n()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-rule">
    <div class="wrap flex flex-col gap-2 py-10 text-[0.9375rem] text-slate sm:flex-row sm:items-center sm:justify-between">
      <p>© {{ year }} {{ profile.name }}</p>
      <a
        href="#main"
        class="back"
      >
        {{ t('footer.top') }}
        <Icon
          name="lucide:arrow-up"
          class="size-4"
          aria-hidden="true"
        />
      </a>
    </div>
  </footer>
</template>

<style scoped>
.back {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  align-self: flex-start;
  color: var(--color-ink);
  font-weight: 700;
  transition: color 160ms ease;
}

.back .iconify,
.back svg {
  transition: transform 200ms var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .back:hover {
    color: var(--color-petrol);
  }

  .back:hover svg {
    transform: translateY(-2px);
  }
}
</style>
