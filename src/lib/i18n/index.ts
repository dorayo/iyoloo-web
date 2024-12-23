// lib/i18n/index.ts
import zhCN from "./locales/zh-CN.json";
import enUS from "./locales/en-US.json";

export const locales = {
  "zh-CN": zhCN,
  "en-US": enUS,
} as const;

export type LocaleType = keyof typeof locales;
