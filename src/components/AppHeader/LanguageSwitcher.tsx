import React from "react";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Locale } from "../Providers/LocaleProvider";
interface LanguageSwitcherProps {
  locale: Locale;
  isMobile?: boolean;
  compact?: boolean;
  onSwitchLanguage: () => void;
}

/** One tap to the other language, labelled in that language's own script. */
export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  locale,
  isMobile = false,
  compact = false,
  onSwitchLanguage,
}) => {
  const target = locale === "ar" ? "en" : "ar";
  return (
    <button
      type="button"
      onClick={onSwitchLanguage}
      lang={target}
      className={cn(
        "flex items-center gap-2 font-medium text-gray-800 transition-colors hover:text-primary",
        compact
          ? "text-sm"
          : cn(
              "rounded-full border border-gray-200 hover:bg-gray-50",
              isMobile
                ? "w-40 justify-center px-4 py-3 text-base"
                : "px-3 py-2 text-sm",
            ),
      )}
      aria-label={target === "ar" ? "العربية – Arabic" : "English – الإنجليزية"}
    >
      {!compact && <Globe className="h-4 w-4" aria-hidden="true" />}
      {target === "ar" ? "العربية" : "English"}
    </button>
  );
};

export default LanguageSwitcher;
