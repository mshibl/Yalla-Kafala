"use client";
import React from "react";
import { MapPin } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import type { Locale } from "../Providers/LocaleProvider";
import { useRegion } from "../Providers/RegionProvider";
import {
  REGION_QUERY_PARAM,
  isProductionHost,
  regionOrigin,
  type Region,
} from "@/lib/region";

const labels: Record<Region, Record<Locale, string>> = {
  eg: { en: "Egypt", ar: "مصر" },
  us: { en: "International", ar: "دولي" },
};

/**
 * Switches between eg. and us. while keeping the current page. On production the
 * middleware remembers the choice (cookie on .yallakafala.org); on previews and
 * localhost the ?region= query param sets it instead.
 */
export const RegionSwitcher = ({
  locale,
  isMobile = false,
}: {
  locale: Locale;
  isMobile?: boolean;
}) => {
  const region = useRegion();
  const pathname = usePathname();

  const switchTo = (target: Region) => {
    if (target === region) return;
    const { hostname, search, hash } = window.location;
    if (isProductionHost(hostname)) {
      window.location.assign(
        `${regionOrigin(target)}${pathname}${search}${hash}`,
      );
    } else {
      const params = new URLSearchParams(search);
      params.set(REGION_QUERY_PARAM, target);
      window.location.assign(`${pathname}?${params.toString()}${hash}`);
    }
  };

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
          aria-label={locale === "ar" ? "تغيير الموقع" : "Change site region"}
        >
          <MapPin className="w-5 h-5" />
          <span
            className={cn("font-medium", isMobile ? "text-base" : "text-sm")}
          >
            {labels[region][locale]}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isMobile ? "center" : "end"}>
        {(["eg", "us"] as const).map((r) => (
          <DropdownMenuItem key={r} onClick={() => switchTo(r)}>
            {labels[r][locale]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RegionSwitcher;
