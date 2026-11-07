import type { Locale } from "@/components/Providers/LocaleProvider";
import { translations } from "./translations";
import { impactStats } from "./constants";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Impact = ({ locale }: { locale: Locale }) => {
  // The large-scale figures as tiles; the Beit Sagheer figure, a different
  // kind of number, as a link to that programme.
  const beitSagheer = impactStats[3];
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  return (
    <section id="impact" className="bg-[#FBF8F4] py-16 md:py-20">
      <div className="container mx-auto px-6">
        <div className="mb-8 max-w-3xl md:mb-10">
          <span className="eyebrow mb-3">{translations.chip[locale]}</span>
          <h2 className="heading-lg text-gray-900 mb-4">
            {translations.title[locale]}
          </h2>
          <p className="text-gray-700 text-lg">
            {translations.description[locale]}
          </p>
        </div>

        <dl className="grid gap-3 sm:grid-cols-3 md:gap-6">
          {impactStats.slice(0, 3).map((stat) => (
            <div
              key={stat.number}
              className="flex items-center gap-4 rounded-2xl bg-white px-5 py-4 text-start shadow-sm ring-1 ring-primary/10 sm:flex-col sm:gap-0 sm:p-6 sm:text-center md:p-8"
            >
              <dd className="order-first w-28 shrink-0 font-serif text-4xl font-semibold text-primary sm:w-auto sm:text-5xl md:text-6xl">
                <bdi dir="ltr">
                  {locale === "ar" && stat.number.endsWith("+")
                    ? `+${stat.number.slice(0, -1)}`
                    : stat.number}
                </bdi>
              </dd>
              <dt className="text-[15px] font-medium leading-snug text-gray-700 sm:mx-auto sm:mt-2 sm:max-w-[18ch] sm:text-sm md:text-base">
                {locale === "ar" ? stat.labelAr : stat.label}
              </dt>
            </div>
          ))}
        </dl>

        {beitSagheer && (
          <Link
            href={`/${locale}/beit-sagheer`}
            className="group mt-3 flex flex-col items-start gap-2 rounded-2xl bg-[#0E6E7A] px-5 py-5 text-start text-white sm:flex-row sm:items-center sm:justify-between md:mt-6 md:px-8"
          >
            <span className="flex items-center gap-4 text-start">
              <span className="font-serif text-4xl font-semibold">
                <bdi dir="ltr">{beitSagheer.number}</bdi>
              </span>
              <span className="text-base font-medium [text-wrap:balance] md:text-lg">
                {locale === "ar" ? beitSagheer.labelAr : beitSagheer.label}
              </span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-2 font-semibold underline-offset-4 group-hover:underline">
              {translations.beitSagheerLink[locale]}
              <Arrow size={18} aria-hidden="true" />
            </span>
          </Link>
        )}
      </div>
    </section>
  );
};

export default Impact;
