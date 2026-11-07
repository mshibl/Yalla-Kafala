import type { Locale } from "@/components/Providers/LocaleProvider";
import { translations } from "./translations";
import { impactStats } from "./constants";

const Impact = ({ locale }: { locale: Locale }) => {
  return (
    <section id="impact" className="bg-[#F6F1F8] py-16 md:py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-12">
          <span className="eyebrow mb-3">{translations.chip[locale]}</span>
          <h2 className="heading-lg text-gray-900 mb-4">
            {translations.title[locale]}
          </h2>
          <p className="text-gray-700 text-lg">
            {translations.description[locale]}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
          {impactStats.map((stat) => (
            <div
              key={stat.number}
              className="flex flex-col rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-primary/10 md:p-8"
            >
              <dd className="order-first font-serif text-4xl font-semibold text-primary md:text-5xl">
                <bdi dir="ltr">{stat.number}</bdi>
              </dd>
              <dt className="mt-2 text-sm font-medium leading-snug text-gray-700 md:text-base">
                {locale === "ar" ? stat.labelAr : stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default Impact;
