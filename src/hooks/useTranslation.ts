// hooks/useTranslation.ts
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/consistent-indexed-object-style */

import { useLanguageStore } from "~/store/language";
import { locales } from "~/lib/i18n";

interface Translations {
  [key: string]: string | { [key: string]: any };
}

export function useTranslation() {
  const { currentLocale } = useLanguageStore();
  const translations = locales[currentLocale] as Translations;

  const t = (key: string): string => {
    const result = key.split('.').reduce((obj, k) => {
      if (typeof obj === 'object' && obj !== null) {
        return obj[k] ?? key;
      }
      return key;
    }, translations);

    return typeof result === 'string' ? result : key;
  };

  return { t, locale: currentLocale };
}