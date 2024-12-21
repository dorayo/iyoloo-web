// hooks/useTranslation.ts
import { useLanguageStore } from "~/store/language";
import { locales } from "~/lib/i18n";

export function useTranslation() {
  const { currentLocale } = useLanguageStore();
  const translations = locales[currentLocale];

  const t = (key: string) => {
    return key.split(".").reduce((obj, k) => obj?.[k], translations) || key;
  };

  return { t, locale: currentLocale };
}
