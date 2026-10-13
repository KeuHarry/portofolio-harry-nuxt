<script setup lang="ts">
// Select-only combobox (WAI-ARIA pattern) styled like the project tabs.
// Arrow keys, Home/End, Enter/Space and Escape work as with a native select.
const props = defineProps<{ options: readonly number[], label: string }>()
const model = defineModel<number>({ required: true })

const id = useId()
const open = ref(false)
const activeIndex = ref(0)
const root = useTemplateRef<HTMLElement>('root')
const trigger = useTemplateRef<HTMLButtonElement>('trigger')

function show() {
  activeIndex.value = Math.max(0, props.options.indexOf(model.value))
  open.value = true
}

function close(refocus = true) {
  open.value = false
  if (refocus) trigger.value?.focus()
}

function choose(index: number) {
  model.value = props.options[index]!
  close()
}

function onKeydown(event: KeyboardEvent) {
  const last = props.options.length - 1
  if (!open.value) {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
      event.preventDefault()
      show()
    }
    return
  }
  const next = {
    ArrowDown: Math.min(activeIndex.value + 1, last),
    ArrowUp: Math.max(activeIndex.value - 1, 0),
    Home: 0,
    End: last,
  }[event.key]
  if (next !== undefined) {
    event.preventDefault()
    activeIndex.value = next
  }
  else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    choose(activeIndex.value)
  }
  else if (event.key === 'Escape') {
    event.preventDefault()
    close()
  }
  else if (event.key === 'Tab') {
    choose(activeIndex.value)
  }
}

// Clicking anywhere else closes the list without moving focus
function onOutside(event: PointerEvent) {
  if (!root.value?.contains(event.target as Node)) close(false)
}
watch(open, (isOpen) => {
  if (isOpen) document.addEventListener('pointerdown', onOutside)
  else document.removeEventListener('pointerdown', onOutside)
})
onBeforeUnmount(() => document.removeEventListener('pointerdown', onOutside))
</script>

<template>
  <div
    ref="root"
    class="size-select"
  >
    <span
      :id="`${id}-label`"
      class="size-label"
    >{{ label }}</span>
    <div class="anchor">
      <button
        :id="`${id}-button`"
        ref="trigger"
        type="button"
        role="combobox"
        class="trigger"
        aria-haspopup="listbox"
        :aria-expanded="open"
        :aria-controls="`${id}-list`"
        :aria-labelledby="`${id}-label ${id}-button`"
        :aria-activedescendant="open ? `${id}-option-${activeIndex}` : undefined"
        @click="open ? close() : show()"
        @keydown="onKeydown"
      >
        {{ model }}
        <Icon
          name="lucide:chevron-down"
          class="chevron size-4"
          aria-hidden="true"
        />
      </button>
      <Transition name="pop">
        <ul
          v-show="open"
          :id="`${id}-list`"
          role="listbox"
          class="list"
          :aria-labelledby="`${id}-label`"
          tabindex="-1"
        >
          <li
            v-for="(option, i) in options"
            :id="`${id}-option-${i}`"
            :key="option"
            role="option"
            class="option"
            :aria-selected="option === model"
            :data-active="i === activeIndex"
            @pointerenter="activeIndex = i"
            @click="choose(i)"
          >
            {{ option }}
            <Icon
              v-if="option === model"
              name="lucide:check"
              class="size-4"
              aria-hidden="true"
            />
          </li>
        </ul>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.size-select {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
}

.anchor {
  position: relative;
}

.trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  padding: 0.5rem 0.875rem 0.5rem 1.125rem;
  border: 1px solid var(--color-rule);
  border-radius: 999px;
  background: var(--color-paper);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--color-ink);
  transition: border-color 160ms ease, color 160ms ease, transform 160ms var(--ease-out);
}

.trigger:active {
  transform: scale(0.97);
}

.trigger[aria-expanded='true'] {
  border-color: var(--color-petrol);
  color: var(--color-petrol);
}

@media (hover: hover) and (pointer: fine) {
  .trigger:hover {
    border-color: var(--color-petrol);
    color: var(--color-petrol);
  }
}

.chevron {
  transition: transform 200ms var(--ease-out);
}

.trigger[aria-expanded='true'] .chevron {
  transform: rotate(180deg);
}

.list {
  position: absolute;
  z-index: 20;
  top: calc(100% + 0.375rem);
  left: 0;
  min-width: 100%;
  padding: 0.3125rem;
  border: 1px solid var(--color-rule);
  border-radius: 0.875rem;
  background: #fff;
  box-shadow: 0 12px 32px -12px rgb(24 34 45 / 0.22);
  transform-origin: top left;
}

.option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 2.5rem;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  font-variant-numeric: tabular-nums;
  color: var(--color-ink);
  cursor: pointer;
}

.option[data-active='true'] {
  background: var(--color-mist-soft);
}

.option[aria-selected='true'] {
  font-weight: 700;
  color: var(--color-petrol);
}

/* Opens quickly from the trigger, closes a touch faster */
.pop-enter-active {
  transition: opacity 160ms ease, transform 160ms var(--ease-out);
}

.pop-leave-active {
  transition: opacity 110ms ease, transform 110ms ease;
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.97);
}

@media (prefers-reduced-motion: reduce) {
  .pop-enter-from,
  .pop-leave-to {
    transform: none;
  }

  .chevron {
    transition: none;
  }
}
</style>
