import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import ExploreKafalaHero from "../ExploreKafalaHero";
import { translations } from "./translations";
import { BackToTopButton } from "../BackToTopButton";
import type { Locale } from "@/components/Providers/LocaleProvider";

const WhatIsKafala = ({ locale }: { locale: Locale }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <ExploreKafalaHero
        locale={locale}
        title={translations.title}
        description={translations.heroDescription}
        imageSrc="/images/what-is-kafala.webp"
        imageAlt={{
          en: "A family embracing a child at home",
          ar: "أسرة تحتضن طفلاً في المنزل",
        }}
        actions={[
          { href: "/kafala-steps", label: translations.nextStep.steps },
          { href: "/faqs", label: translations.nextStep.faqs },
        ]}
      />
      <section aria-labelledby="kafala-brief" className="bg-white pt-4 md:pt-8">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-5xl rounded-3xl bg-[#F6F1F8] p-6 md:p-10">
            <h2
              id="kafala-brief"
              className="mb-6 font-sans text-sm font-semibold uppercase tracking-wider text-gray-900"
            >
              {translations.brief.title[locale]}
            </h2>
            <ul className="grid gap-6 md:grid-cols-3">
              {translations.brief.items.map((item) => (
                <li key={item.title.en} className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-1 h-5 w-5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="mb-1 text-xl font-semibold text-gray-900">
                      {item.title[locale]}
                    </h3>
                    <p className="leading-relaxed text-gray-700">
                      {item.text[locale]}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section id="learn-more" className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-6">
          <div className="prose prose-lg prose-gray mx-auto max-w-3xl animate-fade-up prose-headings:font-serif prose-strong:text-gray-900">
            <p>{translations.firstParagraph[locale]}</p>

            <p>{translations.secondParagraph[locale]}</p>

            <blockquote className="not-prose my-10 rounded-2xl border-s-4 border-primary bg-white p-6 shadow-sm ring-1 ring-primary/10 md:p-8">
              <p
                lang="ar"
                dir="rtl"
                className="mb-5 text-start font-serif text-xl leading-loose text-gray-900 md:text-2xl"
              >
                عَنْ سَهْلِ بْنِ سَعْدٍ رضي الله عنه قَالَ: قَالَ رَسُولَ
                اَللَّهِ صلى الله عليه وسلم: أَنَا وَكَافِلُ الْيَتِيمِ في
                الْجَنَّةِ هكَذَا، وَأَشَارَ بِالسَّبَّابَةِ وَالْوُسطَى
                وَفَرَّجَ بَيْنَهُمَا شَيْئاً.
              </p>
              {locale === "en" && (
                <p className="text-base leading-relaxed text-gray-700">
                  From Sahl bin Sa&apos;ad (may Allah be pleased with him), he
                  said: &ldquo;The Messenger of Allah sallallaahu &apos;alaihi
                  wa sallam said: &ldquo;I and the one who looks after an orphan
                  will be like this in Paradise,&rdquo; showing his middle and
                  index fingers and separating them.&rdquo; [Sahih al-Bukhari]
                </p>
              )}
            </blockquote>
            <p>{translations.firstHadith.explaination[locale]}</p>
            <h2 className="mt-12 mb-5 text-2xl font-semibold text-gray-900 md:text-3xl">
              {translations.firstHadith.essentialPhrases.title[locale]}
            </h2>

            <ol className="list-decimal ps-6 space-y-4">
              {translations.firstHadith.essentialPhrases.phrases[locale].map(
                (phrase, index) => (
                  <li key={index}>
                    <strong>{phrase.title}</strong> {phrase.description}
                  </li>
                ),
              )}
            </ol>

            <h2 className="mt-12 mb-5 text-2xl font-semibold text-gray-900 md:text-3xl">
              {translations.islamicRules.description[locale]}
            </h2>

            <ul className="list-disc ps-6 space-y-4">
              <li>
                <strong>
                  {translations.islamicRules.rules[locale][0]!.title}
                </strong>{" "}
                {translations.islamicRules.rules[locale][0]!.description}
                <blockquote className="not-prose my-4 rounded-2xl border-s-4 border-primary bg-white p-5 shadow-sm ring-1 ring-primary/10">
                  <p
                    lang="ar"
                    dir="rtl"
                    className="mb-4 text-start font-serif text-xl leading-loose text-gray-900"
                  >
                    ادْعُوهُمْ لِآبَائِهِمْ هُوَ أَقْسَطُ عِندَ اللَّـهِ ۚ فَإِن
                    لَّمْ تَعْلَمُوا آبَاءَهُمْ فَإِخْوَانُكُمْ فِي الدِّينِ
                    وَمَوَالِيكُمْ
                    <span className="mt-2 block font-sans text-sm text-gray-600">
                      [الأحزاب: 5]
                    </span>
                  </p>
                  {locale === "en" && (
                    <p className="text-base leading-relaxed text-gray-700">
                      Call them by [the names of] their fathers; it is more just
                      in the sight of Allah. But if you do not know their
                      fathers - then they are [still] your brothers in religion
                      and those entrusted to you. And there is no blame upon you
                      for that in which you have erred but [only for] what your
                      hearts intended. And ever is Allah Forgiving and Merciful.
                      [33:5]
                    </p>
                  )}
                </blockquote>
              </li>
              {translations.islamicRules.rules[locale]
                .slice(1)
                .map((rule, index) => (
                  <li
                    key={index + 1}
                    className={
                      index === 1
                        ? "rounded-xl border-s-4 border-accent bg-accent/10 py-3 pe-4 ps-4"
                        : undefined
                    }
                  >
                    <strong>{rule.title}</strong> {rule.description}
                  </li>
                ))}
            </ul>

            <div className="not-prose mt-14 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600">
              <p>{translations.Footnote.copiedFrom[locale]}</p>

              <h3 className="mt-8 mb-3 font-sans text-sm font-semibold uppercase tracking-wider text-gray-900">
                {translations.Footnote.list.listTitle[locale]}
              </h3>
              <ol className="space-y-1.5">
                {translations.Footnote.list.listItems[locale].map(
                  (item, index) => (
                    <li key={index}>{item}</li>
                  ),
                )}
              </ol>

              <h3 className="mt-8 mb-3 font-sans text-sm font-semibold uppercase tracking-wider text-gray-900">
                {translations.sources.title[locale]}
              </h3>
              <p>
                <a
                  href="https://almanhaj.or.id/3364-keutamaan-menyantuni-anak-yatim.html"
                  className="text-primary hover:underline"
                >
                  https://almanhaj.or.id/3364-keutamaan-menyantuni-anak-yatim.html
                </a>
              </p>

              <h3 className="mt-8 mb-3 font-sans text-sm font-semibold uppercase tracking-wider text-gray-900">
                {translations.References.title[locale]}
              </h3>
              <ol className="list-decimal space-y-1.5 ps-5 break-words">
                {translations.References.list.listItems[locale].map(
                  (item, index) => (
                    <li key={index}>{item}</li>
                  ),
                )}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white pb-16 md:pb-24">
        <div className="container mx-auto px-6">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 rounded-3xl bg-primary px-6 py-10 text-center md:px-12">
            <h2 className="text-3xl font-semibold text-white md:text-4xl">
              {translations.nextStep.title[locale]}
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href={`/${locale}/kafala-steps`}
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-semibold text-primary transition-colors hover:bg-white/90"
              >
                {translations.nextStep.steps[locale]}
              </Link>
              <Link
                href={`/${locale}/faqs`}
                className="inline-flex items-center justify-center rounded-full border-2 border-white/70 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
              >
                {translations.nextStep.faqs[locale]}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <BackToTopButton />
    </div>
  );
};

export default WhatIsKafala;
