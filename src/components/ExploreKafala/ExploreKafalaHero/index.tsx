import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { Locale } from "@/components/Providers/LocaleProvider";

type LocalizedText = Record<Locale, string>;

interface ExploreKafalaHeroProps {
  locale: Locale;
  title: LocalizedText;
  description: LocalizedText;
  /** A photo for the side, or `aside` instead; with neither, one column. */
  imageSrc?: string;
  imageAlt?: LocalizedText;
  aside?: React.ReactNode;
  /** The section label above the title; defaults to "Explore Kafala". */
  eyebrow?: LocalizedText;
  actions?: { href: string; label: LocalizedText }[];
}

const ExploreKafalaHero = ({
  locale,
  title,
  description,
  imageSrc,
  imageAlt,
  aside,
  eyebrow = { en: "Explore Kafala", ar: "استكشف الكفالة" },
  actions = [],
}: ExploreKafalaHeroProps) => {
  const hasSide = Boolean(imageSrc || aside);
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-primary/[0.07] to-white pb-12 pt-28 md:pb-16 md:pt-36"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-6">
        <div
          className={cn(
            "mx-auto grid max-w-6xl items-center gap-12 md:gap-16",
            hasSide && "md:grid-cols-2",
          )}
        >
          <div className="animate-fade-in">
            <p className="eyebrow mb-4">{eyebrow[locale]}</p>
            <h1 className="mb-5 text-[2.125rem] font-semibold leading-[1.1] text-gray-900 md:text-5xl">
              {title[locale]}
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-gray-700 md:text-xl">
              {description[locale]}
            </p>
            {actions.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                {actions.map((action, index) => (
                  <Link
                    key={action.href}
                    href={
                      action.href.startsWith("/")
                        ? `/${locale}${action.href}`
                        : action.href
                    }
                    className={
                      index === 0
                        ? "primary-button font-semibold"
                        : "outline-button font-semibold"
                    }
                  >
                    {action.label[locale]}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {aside && <div className="animate-fade-in md:ps-8">{aside}</div>}
          {imageSrc && !aside && (
            <div className="animate-fade-in md:ps-8">
              <div className="relative mx-auto max-w-xl">
                <div className="absolute inset-4 -translate-x-4 translate-y-4 rounded-[2rem] bg-primary/20 blur-3xl"></div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-xl ring-1 ring-black/5">
                  <Image
                    src={imageSrc}
                    alt={imageAlt?.[locale] ?? ""}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ExploreKafalaHero;
