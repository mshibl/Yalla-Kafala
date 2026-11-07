import React from "react";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { translations } from "./translations";
import PageHeader from "@/components/ui/PageHeader";

export const HeroSection = ({ locale }: { locale: Locale }) => {
  return (
    <section className="relative bg-gradient-to-b from-primary/[0.06] to-white pt-28 pb-14 md:pt-36 md:pb-20">
      <div className="container mx-auto px-6">
        <PageHeader
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
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#our-story" className="primary-button font-semibold">
              {translations.hero.ctas.ourStory[locale]}
            </a>
            <a href="#our-team" className="outline-button font-semibold">
              {translations.hero.ctas.meetTeam[locale]}
            </a>
          </div>
        </PageHeader>
      </div>
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
};
