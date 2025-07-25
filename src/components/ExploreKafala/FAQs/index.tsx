import ExploreKafalaHero from "../ExploreKafalaHero";
import type { Locale } from "@/components/Providers/LocaleProvider";
import type { FAQ } from "@/lib/types";
import FAQsHeader from "./FAQsHeader";
import FAQsAccordion from "./FAQsAccordion";
import { MakeDifference } from "@/components/Homepage/MakeDifference";

const FAQs = ({ locale }: { locale: Locale }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <ExploreKafalaHero locale={locale} />
      <main className="flex-grow">
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <FAQsHeader locale={locale} />
            <FAQsAccordion locale={locale} />
          </div>
        </section>
        <MakeDifference locale={locale} />
      </main>
    </div>
  );
};

export default FAQs;
