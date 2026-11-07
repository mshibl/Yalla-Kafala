import ExploreKafalaHero from "../ExploreKafalaHero";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { translations } from "./translations";
import ResourcesList from "./ResourcesList";

const Resources = async ({ locale }: { locale: Locale }) => {
  return (
    <div className="flex flex-col">
      <ExploreKafalaHero
        eyebrow={{ en: "Downloads", ar: "للتحميل" }}
        locale={locale}
        title={translations.title}
        description={translations.description}
      />
      <div className="flex-grow">
        <section
          className="py-12 md:py-16 bg-gray-50"
          dir={locale === "ar" ? "rtl" : "ltr"}
        >
          <div className="container mx-auto px-6">
            <ResourcesList />
            <p className="mt-8 text-gray-700">
              {translations.somethingElse[locale]}{" "}
              <a
                href="mailto:info@yallakafala.org"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                info@yallakafala.org
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Resources;
