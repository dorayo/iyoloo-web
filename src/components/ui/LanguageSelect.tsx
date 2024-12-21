import { ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type LocaleType } from "~/lib/i18n";
import { useLanguageStore } from "~/store/language";

export function LanguageSelect() {
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
        <button className="ml-6 flex items-center">
          <span className="text-sm text-white">
            {languages.find((lang) => lang.code === currentLocale)?.name}
          </span>
          <ChevronDown className="ml-1 h-4 w-4 text-white/70" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[120px] rounded-lg border border-white/10 bg-[#1E1247] p-1">
        <div className="flex flex-col">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className="rounded-md px-3 py-2 text-left text-sm text-white hover:bg-white/10"
            >
              {language.name}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
