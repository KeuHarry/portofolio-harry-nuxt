import type { Localized } from '~/data/profile'

/** Reads { en, fr } content in the active locale and formats YYYY-MM dates. */
export function useLocalized() {
  const { locale } = useI18n()
  const lang = computed(() => (locale.value === 'fr' ? 'fr' : 'en'))

  const l = (value: string | Localized) => (typeof value === 'string' ? value : value[lang.value])

  const month = (ym: string) => {
    const [year, m] = ym.split('-').map(Number)
    return new Intl.DateTimeFormat(lang.value === 'fr' ? 'fr-FR' : 'en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' })
      .format(new Date(Date.UTC(year!, m! - 1, 1)))
  }

  return { l, month, lang }
}
