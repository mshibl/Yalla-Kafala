import type { Locale } from "@/components/Providers/LocaleProvider";
import { translations } from "./translations";
import { impactStats } from "./constants";

const Impact = ({ locale }: { locale: Locale }) => {
  return (
    <section
      id="impact"
      className="py-24 bg-gradient-to-br from-[#F8F7FF] to-[#EAEDFF]"
    >
      <div className="container mx-auto px-6">
        <div className="relative">
          <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-up">
            <div className="inline-block bg-secondary/10 text-secondary font-medium px-4 py-2 rounded-full mb-4">
              {translations.chip[locale]}
            </div>
            <h2 className="heading-md text-primary mb-6">
              {translations.title[locale]}
            </h2>
            <p className="text-gray-600 text-lg">
              {translations.description[locale]}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-lg bg-white shadow-md"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {locale === "ar" ? stat.labelAr : stat.label}
                </h3>
                <p className="text-gray-600">
                  {locale === "ar" ? stat.descriptionAr : stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Impact;
