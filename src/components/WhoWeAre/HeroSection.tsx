import React from "react";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { translations } from "./translations";
import PageHeader from "@/components/ui/PageHeader";

export const HeroSection = ({ locale }: { locale: Locale }) => {
  return (
    <section className="relative bg-gradient-to-b from-primary/[0.06] to-white pt-28 pb-14 md:pt-36 md:pb-20">
      <div className="container mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2 md:gap-14">
        <PageHeader
          width="max-w-none"
          eyebrow={translations.hero.badge[locale]}
          title={
            <>
              {translations.hero.title.part1[locale]}{" "}
              <span className="text-primary">
                {translations.hero.title.part2[locale]}
              </span>
            </>
          }
          lede={translations.hero.description[locale]}
        >
          <div className="mt-6 flex flex-wrap gap-6">
            <a
              href="#our-story"
              className="inline-flex items-center gap-2 font-semibold text-primary underline-offset-4 hover:underline"
            >
              {translations.hero.ctas.ourStory[locale]}
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#our-team"
              className="inline-flex items-center gap-2 font-semibold text-primary underline-offset-4 hover:underline"
            >
              {translations.hero.ctas.meetTeam[locale]}
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </PageHeader>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-xl ring-1 ring-black/5">
          <Image
            src="/images/yk-team-1.webp"
            alt={
              locale === "ar"
                ? "فريق يلا كفالة ومتطوعوها معاً"
                : "The Yalla Kafala team and volunteers together"
            }
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover object-[center_40%]"
          />
        </div>
      </div>
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
};
