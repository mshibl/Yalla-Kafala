import NourStory from "./NourStory";
import { translations } from "./translations";

type ImpactStat = {
  number: string;
  label: string;
  description: string;
  labelAr: string;
  descriptionAr: string;
};

const ImpactSection = ({
  impactStats,
  locale,
}: {
  impactStats: ImpactStat[];
  locale: string;
}) => (
  <section className="py-16 md:py-24 bg-white">
    <div className="container mx-auto px-6">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          {locale === "ar"
            ? translations.impactSection.title.ar
            : translations.impactSection.title.en}
        </h2>
        <p className="text-lg text-gray-600">
          {locale === "ar"
            ? translations.impactSection.description.ar
            : translations.impactSection.description.en}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {impactStats.map((stat, index) => (
          <div key={index} className="text-center p-6 rounded-lg">
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
      <NourStory locale={locale} />
    </div>
  </section>
);

export default ImpactSection;
