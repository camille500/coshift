import { nl } from './i18n/nl'
import { en } from './i18n/en'

export default defineI18nConfig(() => ({
  legacy: false,
  flatJson: true,
  messages: { nl, en },
}))
