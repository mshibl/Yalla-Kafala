import ExploreKafalaHero from "../ExploreKafalaHero";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { translations } from "./translations";
import ResourcesList from "./ResourcesList";

const Resources = async ({ locale }: { locale: Locale }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <ExploreKafalaHero locale={locale} />
      <main className="flex-grow">
        <section
          className="py-12 md:py-16 bg-gray-50"
          dir={locale === "ar" ? "rtl" : "ltr"}
        >
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-semibold text-primary mb-3">
                {translations.title[locale]}
              </h2>
              <p className="text-gray-600">
                {translations.description[locale]}
              </p>
            </div>

            <ResourcesList />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Resources;
