import Link from "next/link";
import { isolateLatin } from "@/lib/bidi";
import { CheckCircle2 } from "lucide-react";
import { BackToTopButton } from "../BackToTopButton";
import ExploreKafalaHero from "../ExploreKafalaHero";
import { familyCardSteps, requiredDocuments, steps } from "./constants";
import { translations } from "./translations";
import type { Locale } from "@/components/Providers/LocaleProvider";
const KafalaSteps = ({ locale }: { locale: Locale }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <ExploreKafalaHero
        eyebrow={{ en: "The process", ar: "الخطوات" }}
        locale={locale}
        title={translations.title}
        description={translations.description}
        aside={
          <nav
            aria-label={translations.atAGlance[locale]}
            className="hidden rounded-3xl bg-white p-8 shadow-xl ring-1 ring-primary/10 md:block"
          >
            <p className="mb-5 font-sans text-sm font-semibold uppercase tracking-wider text-gray-900">
              {translations.atAGlance[locale]}
            </p>
            <ol className="space-y-3">
              {steps[locale].map((step, index) => (
                <li key={index}>
                  <a
                    href={`#step-${index + 1}`}
                    className="group flex items-center gap-3"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-serif text-base font-semibold text-white">
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-900 underline-offset-4 group-hover:text-primary group-hover:underline">
                      {step.title}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        }
        actions={[
          { href: "#documents", label: translations.documentsLink },
          {
            href: `mailto:info@yallakafala.org?subject=${encodeURIComponent(translations.cta.meetingSubject[locale])}`,
            label: translations.cta.meeting,
          },
        ]}
      />
      <section id="learn-more" className="bg-white pt-8 pb-14 md:py-20">
        <div className="container mx-auto px-6">
          {/* Kafala Steps */}
          <div className="mx-auto mb-20 max-w-3xl">
            <div className="mb-10 text-center">
              <span className="eyebrow mb-3">
                {translations.stepsEyebrow[locale]}
              </span>
              <h2 className="heading-lg text-gray-900">
                {translations.kafalaStepsTitle[locale]}
              </h2>
            </div>

            <ol className="relative">
              {steps[locale].map((step, index) => {
                const isLast = index === steps[locale].length - 1;
                return (
                  <li
                    key={index}
                    id={`step-${index + 1}`}
                    className="relative flex scroll-mt-28 gap-5 pb-10 last:pb-0 md:gap-7"
                  >
                    {!isLast && (
                      <span
                        aria-hidden="true"
                        className="absolute start-5 top-12 bottom-0 w-0.5 -translate-x-1/2 rtl:translate-x-1/2 bg-primary/15 md:start-6"
                      />
                    )}
                    <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-serif text-lg font-semibold text-white shadow-sm md:h-12 md:w-12 md:text-xl">
                      {index + 1}
                    </span>
                    <div className="pt-1.5 md:pt-2.5">
                      <h3 className="mb-2 text-xl font-semibold text-gray-900 md:text-2xl">
                        {step.title}
                      </h3>
                      <p className="text-base leading-relaxed text-gray-700 md:text-lg">
                        {locale === "ar"
                          ? isolateLatin(step.description)
                          : step.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Required Documents */}
          <div id="documents" className="mx-auto mb-20 max-w-4xl scroll-mt-28">
            <h2 className="heading-md mb-8 text-center text-gray-900">
              {translations.requiredDocumentsTitle[locale]}
            </h2>

            <ul className="gap-x-12 rounded-3xl bg-[#FBF8F4] p-6 md:columns-2 md:p-10">
              {requiredDocuments[locale].map((doc, index) => (
                <li
                  key={index}
                  className="mb-4 flex break-inside-avoid items-start gap-3 last:mb-0"
                >
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span className="leading-relaxed text-gray-800">
                    {locale === "ar" ? isolateLatin(doc) : doc}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Next step */}
          <div className="mx-auto mb-20 max-w-4xl rounded-3xl bg-primary px-6 py-10 text-center text-white md:px-12 md:py-14">
            <h2 className="mb-3 text-3xl font-semibold text-white md:text-4xl">
              {translations.cta.title[locale]}
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-white/85">
              {translations.cta.description[locale]}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={`mailto:info@yallakafala.org?subject=${encodeURIComponent(translations.cta.meetingSubject[locale])}`}
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-semibold text-primary transition-colors hover:bg-white/90"
              >
                {translations.cta.meeting[locale]}
              </a>
              <Link
                href={`/${locale}/faqs`}
                className="inline-flex items-center justify-center rounded-full border-2 border-white/70 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
              >
                {translations.cta.faqs[locale]}
              </Link>
            </div>
          </div>

          {/* Family Card Steps */}
          <div className="mx-auto mb-20 max-w-3xl">
            <h2 className="heading-md mb-8 text-center text-gray-900">
              {translations.familyCardStepsTitle[locale]}
            </h2>

            <ol className="space-y-6">
              {familyCardSteps[locale].map((step, index) => (
                <li key={index} className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <span className="pt-1 text-base leading-relaxed text-gray-800 md:text-lg">
                    {locale === "ar" ? isolateLatin(step) : step}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <BackToTopButton />
    </div>
  );
};

export default KafalaSteps;
