import { nl } from './nl';
import { en } from './en';

export type Locale = 'nl' | 'en';

const translations: Record<Locale, Record<string, string>> = { nl, en };

export function getLocaleFromURL(url: URL): Locale {
  const [, lang] = url.pathname.split('/');
  return lang === 'en' ? 'en' : 'nl';
}

export function useTranslations(locale: Locale) {
  return function t(key: string): string {
    return translations[locale][key] ?? key;
  };
}

export function getLocalePath(path: string, locale: Locale): string {
  return locale === 'en' ? `/en${path}` : path;
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === 'nl' ? 'en' : 'nl';
}
