import React from "react";
import { translations } from "./translations";
import type { Locale } from "@/components/Providers/LocaleProvider";
const ExploreKafalaHero = ({ locale }: { locale: Locale }) => {
  return (
    <section className="bg-gradient-to-b from-primary/10 to-white pt-24 pb-12 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center max-w-6xl mx-auto">
          <div className="md:w-1/2 mb-10 md:mb-0 animate-fade-right">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4">
              {translations.title.firstWord[locale]}{" "}
              <span className="text-secondary">
                {translations.title.secondWord[locale]}
              </span>
            </h1>
            <div className="w-20 h-1 bg-primary mb-6 rounded-full"></div>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              {translations.description[locale]}
            </p>
          </div>
          <div className="md:w-1/2 pl-0 md:pl-12 animate-fade-left">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl transform -translate-x-4 translate-y-4"></div>
              <img
                src="/images/explore-kafala-hero.webp"
                alt="Children in a loving home environment"
                className="relative z-10 rounded-lg shadow-xl max-w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExploreKafalaHero;
