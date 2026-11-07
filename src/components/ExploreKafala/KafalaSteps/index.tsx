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
        locale={locale}
        title={translations.title}
        description={translations.description}
        imageSrc="/images/kafala-steps.webp"
        imageAlt={{
          en: "Family hands joined in support",
          ar: "أيدي أسرة متشابكة في الدعم",
        }}
        actions={[
          { href: "#documents", label: translations.documentsLink },
          {
            href: "mailto:info@yallakafala.org",
            label: translations.cta.contact,
          },
        ]}
      />
      <section id="learn-more" className="bg-white py-14 md:py-20">
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
                    className="relative flex gap-5 pb-10 last:pb-0 md:gap-7"
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

            <ul className="gap-x-12 rounded-3xl bg-[#F6F1F8] p-6 md:columns-2 md:p-10">
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

          {/* Family Card Steps */}
          <div className="mx-auto mb-20 max-w-3xl">
            <h2 className="heading-md mb-8 text-center text-gray-900">
              {translations.familyCardStepsTitle[locale]}
            </h2>

            <ol className="space-y-4">
              {familyCardSteps[locale].map((step, index) => (
                <li key={index} className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {index + 1}
                  </span>
                  <span className="pt-1 leading-relaxed text-gray-800">
                    {locale === "ar" ? isolateLatin(step) : step}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Next step */}
          <div className="mx-auto max-w-4xl rounded-3xl bg-primary px-6 py-10 text-center text-white md:px-12 md:py-14">
            <h2 className="mb-3 text-3xl font-semibold text-white md:text-4xl">
              {translations.cta.title[locale]}
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-white/85">
              {translations.cta.description[locale]}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href={`/${locale}/faqs`}
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-semibold text-primary transition-colors hover:bg-white/90"
              >
                {translations.cta.faqs[locale]}
              </Link>
              <a
                href="mailto:info@yallakafala.org"
                className="inline-flex items-center justify-center rounded-full border-2 border-white/70 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
              >
                {translations.cta.contact[locale]}
              </a>
            </div>
          </div>
        </div>
      </section>

      <BackToTopButton />
    </div>
  );
};

export default KafalaSteps;
