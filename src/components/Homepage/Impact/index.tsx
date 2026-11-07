import type { Locale } from "@/components/Providers/LocaleProvider";
import { translations } from "./translations";
import { impactStats } from "./constants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Impact = ({ locale }: { locale: Locale }) => {
  // The large-scale figures as tiles; the Beit Sagheer figure, a different
  // kind of number, as a link to that programme.
  const beitSagheer = impactStats[3];
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
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

        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-6">
          {impactStats.map((stat, index) => (
            <div
              key={stat.number}
              className={cn(
                "flex flex-col rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-primary/10 sm:p-6 md:p-8",
                // Beit Sagheer is a tile on phones, a banner from sm up.
                index === 3 && "sm:hidden",
              )}
            >
              <dd className="order-first font-serif text-4xl font-semibold text-primary sm:text-5xl md:text-6xl">
                <bdi dir="ltr">{stat.number}</bdi>
              </dd>
              <dt className="mx-auto mt-2 max-w-[18ch] text-[13px] font-medium leading-snug text-gray-700 sm:text-sm md:text-base">
                {locale === "ar" ? stat.labelAr : stat.label}
              </dt>
            </div>
          ))}
        </dl>

        {beitSagheer && (
          <Link
            href={`/${locale}/beit-sagheer`}
            className="mx-auto mt-4 flex w-fit items-center gap-2 font-semibold text-primary underline-offset-4 hover:underline sm:hidden"
          >
            {translations.beitSagheerLink[locale]}
            <Arrow size={18} aria-hidden="true" />
          </Link>
        )}
        {beitSagheer && (
          <Link
            href={`/${locale}/beit-sagheer`}
            className="group mt-3 hidden flex-col items-center gap-3 rounded-2xl bg-primary sm:flex px-6 py-5 text-center text-white sm:flex-row sm:justify-between sm:text-start md:mt-6 md:px-8"
          >
            <span className="flex items-center gap-4">
              <span className="font-serif text-4xl font-semibold">
                <bdi dir="ltr">{beitSagheer.number}</bdi>
              </span>
              <span className="text-base font-medium md:text-lg">
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
