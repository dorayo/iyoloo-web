// store/language.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LocaleType } from "~/lib/i18n";

interface LanguageState {
  currentLocale: LocaleType;
  setLocale: (locale: LocaleType) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      currentLocale: "zh-CN",
      setLocale: (locale) => set({ currentLocale: locale }),
    }),
    {
      name: "language-storage",
    },
  ),
);
