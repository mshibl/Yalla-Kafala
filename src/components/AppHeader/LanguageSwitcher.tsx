import React from "react";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import type { Locale } from "../Providers/LocaleProvider";
interface LanguageSwitcherProps {
  locale: Locale;
  isMobile?: boolean;
  onSwitchLanguage: () => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  locale,
  isMobile = false,
  onSwitchLanguage,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 hover:bg-gray-100 transition-colors border border-gray-200",
            isMobile
              ? "px-4 py-3 rounded-full w-40 justify-center"
              : "px-3 py-2 rounded-full",
          )}
          aria-label="Change language"
        >
          <Globe className="w-5 h-5" />
          <span
            className={cn("font-medium", isMobile ? "text-base" : "text-sm")}
          >
            {locale === "ar" ? "العربية" : "English"}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isMobile ? "center" : "end"}>
        <DropdownMenuItem onClick={onSwitchLanguage}>English</DropdownMenuItem>
        <DropdownMenuItem onClick={onSwitchLanguage}>العربية</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
