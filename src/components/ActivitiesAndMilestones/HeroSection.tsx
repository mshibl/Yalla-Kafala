import type { Locale } from "@/components/Providers/LocaleProvider";
import { translations } from "./translations";

interface HeroSectionProps {
  locale: Locale;
}

const HeroSection = ({ locale }: HeroSectionProps) => {
  return (
    <section className="relative bg-gradient-to-b from-primary/5 to-white pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[20%] right-[5%] w-64 h-64 rounded-full bg-primary/5 animate-float"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute top-[40%] left-[10%] w-48 h-48 rounded-full bg-secondary/5 animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-[10%] right-[15%] w-40 h-40 rounded-full bg-primary/5 animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-primary mb-6">
            {translations.hero.title[locale]}
          </h1>
          <p className="text-gray-700 text-lg mb-8">
            {translations.hero.description[locale]}
          </p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
};

export default HeroSection;
