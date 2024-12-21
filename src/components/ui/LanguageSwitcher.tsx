// components/LanguageSwitcher.tsx
import { useLanguageStore } from "~/store/language";
import { type LocaleType } from "~/lib/i18n";

import { ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function LanguageSwitcher() {
  const { currentLocale, setLocale } = useLanguageStore();
  const languages: { code: LocaleType; name: string }[] = [
    { code: "zh-CN", name: "简体中文" },
    { code: "en-US", name: "English" },
  ];

  const handleLanguageChange = (locale: LocaleType) => {
    setLocale(locale);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex transform items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm font-medium text-white/90 backdrop-blur-sm transition-all duration-200 hover:bg-white/10 active:scale-95">
          {languages.find((lang) => lang.code === currentLocale)?.name}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] rounded-xl border border-white/10 bg-white/5 p-2 shadow-lg backdrop-blur-lg">
        <div className="flex flex-col space-y-1">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`rounded-lg px-4 py-2 text-sm text-white/90 transition-all duration-200 ${currentLocale === language.code ? "bg-white/20" : "hover:bg-white/10"} ${currentLocale === language.code ? "font-medium" : "font-normal"} transform active:scale-95`}
            >
              {language.name}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
