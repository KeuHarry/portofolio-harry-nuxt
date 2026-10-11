<script setup lang="ts">
import { intro, profile } from '~/data/profile'

const { t } = useI18n()
const { l } = useLocalized()
</script>

<template>
  <section class="wrap hero">
    <div class="hero-text">
      <h1 class="name">
        <span class="line">Harry</span>
        <span class="line">Keumezeu</span>
        <span class="line">Feujio</span>
      </h1>
      <p class="role reveal">
        {{ l(profile.role) }}
      </p>
      <p class="intro reveal">
        {{ l(intro) }}
      </p>
      <p class="remote reveal">
        {{ t('hero.remote') }}
      </p>
      <div class="actions reveal">
        <a
          :href="`mailto:${profile.email}`"
          class="btn btn-solid"
        >
          <Icon
            name="lucide:mail"
            class="size-[1.125rem]"
            aria-hidden="true"
          />
          {{ t('hero.email') }}
        </a>
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
    </div>

    <figure class="portrait">
      <div
        class="arch"
        aria-hidden="true"
      />
      <picture>
        <source
          type="image/avif"
          srcset="/images/harry-480.avif 480w, /images/harry-960.avif 960w"
          sizes="(min-width: 900px) 26rem, 18rem"
        >
        <img
          src="/images/harry-480.webp"
          srcset="/images/harry-480.webp 480w, /images/harry-960.webp 960w"
          sizes="(min-width: 900px) 26rem, 18rem"
          width="622"
          height="620"
          :alt="t('hero.portraitAlt')"
          fetchpriority="high"
        >
      </picture>
    </figure>
  </section>
</template>

<style scoped>
.hero {
  display: grid;
  gap: 2.5rem;
  padding-top: 2.5rem;
  padding-bottom: 4.5rem;
}

@media (min-width: 900px) {
  .hero {
    grid-template-columns: minmax(0, 1fr) 26rem;
    align-items: end;
    gap: 4rem;
    padding-top: 5rem;
    padding-bottom: 6.5rem;
  }
}

.hero-text {
  order: 2;
}

.portrait {
  order: 1;
}

@media (min-width: 900px) {
  .hero-text,
  .portrait {
    order: 0;
  }
}

.name {
  font-size: clamp(3.25rem, 9vw, 6rem);
  font-weight: 900;
  line-height: 0.94;
  letter-spacing: -0.03em;
}

.line {
  display: block;
}

.role {
  margin-top: 1.25rem;
  font-size: clamp(1.125rem, 1.8vw, 1.3125rem);
  font-weight: 700;
  color: var(--color-petrol);
}

/* The statement carries the hero after the name: large, tight, short measure */
.intro {
  margin-top: 1.75rem;
  max-width: 30ch;
  font-size: clamp(1.4375rem, 2.6vw, 1.9375rem);
  line-height: 1.28;
  letter-spacing: -0.012em;
  text-wrap: balance;
}

.remote {
  margin-top: 1.25rem;
  max-width: 36rem;
  font-size: 1rem;
  color: var(--color-slate);
}

.actions {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

/* Portrait: the cutout stands on a mist arch, head rising above its top edge */
.portrait {
  position: relative;
  width: min(100%, 18rem);
}

@media (min-width: 900px) {
  .portrait {
    width: 100%;
  }
}

.arch {
  position: absolute;
  inset: 16% 0 0 0;
  border-radius: 999px 999px 0 0;
  background: var(--color-mist);
  transform-origin: bottom center;
}

.portrait picture,
.portrait img {
  position: relative;
  display: block;
  width: 100%;
  height: auto;
}

/* One orchestrated entrance: name lines, then the text, then the portrait */
@media (prefers-reduced-motion: no-preference) {
  .line,
  .reveal {
    animation: rise 560ms var(--ease-out) both;
  }

  .line:nth-child(2) { animation-delay: 60ms; }
  .line:nth-child(3) { animation-delay: 120ms; }
  .role { animation-delay: 200ms; }
  .intro { animation-delay: 240ms; }
  .remote { animation-delay: 280ms; }
  .actions { animation-delay: 320ms; }

  .arch {
    animation: arch-in 640ms var(--ease-out) 120ms both;
  }

  .portrait picture {
    animation: rise 640ms var(--ease-out) 220ms both;
  }
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(0.75rem);
  }
}

@keyframes arch-in {
  from {
    opacity: 0;
    transform: scaleY(0.92);
  }
}
</style>
