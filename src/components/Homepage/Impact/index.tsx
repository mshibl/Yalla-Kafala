import type { Locale } from "@/components/Providers/LocaleProvider";
import { translations } from "./translations";
import { impactStats } from "./constants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Impact = ({ locale }: { locale: Locale }) => {
  // The large-scale figures as tiles; the Beit Sagheer figure, a different
  // kind of number, as a link to that programme.
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  return (
    <section id="impact" className="bg-[#FBF8F4] py-16 md:py-20">
      <div className="container mx-auto px-6">
        <div className="mb-8 max-w-3xl md:mb-10">
          <h2 className="heading-lg text-gray-900 mb-4">
            {translations.title[locale]}
          </h2>
          <p className="text-gray-700 text-lg">
            {translations.description[locale]}
          </p>
        </div>

        <dl className="grid gap-3 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
          {impactStats.map((stat, index) => {
            const isBeitSagheer = index === 3;
            const figure = (
              <dd
                className={cn(
                  "order-first w-28 shrink-0 font-serif text-4xl font-semibold sm:w-auto md:text-5xl",
                  isBeitSagheer ? "text-white" : "text-primary",
                )}
              >
                <bdi dir="ltr">
                  {locale === "ar" && stat.number.endsWith("+")
                    ? `+${stat.number.slice(0, -1)}`
                    : stat.number}
                </bdi>
              </dd>
            );
            const label = (
              <dt
                className={cn(
                  "text-[15px] font-medium leading-snug sm:mt-2",
                  isBeitSagheer ? "text-white" : "text-[#3a3340]",
                )}
              >
                {locale === "ar" ? stat.labelAr : stat.label}
              </dt>
            );
            return isBeitSagheer ? (
              <div
                key={stat.number}
                className="flex items-center gap-4 rounded-2xl bg-[#0E6E7A] px-5 py-4 text-start sm:flex-col sm:items-start sm:gap-0 md:px-7 md:py-7"
              >
                {figure}
                <div>
                  {label}
                  <Link
                    href={`/${locale}/beit-sagheer`}
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-white underline underline-offset-4"
                  >
                    {translations.beitSagheerLink[locale]}
                    <Arrow size={16} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ) : (
              <div
                key={stat.number}
                className="flex items-center gap-4 rounded-2xl bg-white px-5 py-4 text-start shadow-sm ring-1 ring-primary/10 sm:flex-col sm:items-start sm:gap-0 md:px-7 md:py-7"
              >
                {figure}
                {label}
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
};

export default Impact;
