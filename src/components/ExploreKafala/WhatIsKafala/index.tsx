import { MakeDifference } from "@/components/Homepage/MakeDifference";
import ExploreKafalaHero from "../ExploreKafalaHero";
import { translations } from "./translations";
import { BackToTopButton } from "../BackToTopButton";
import type { Locale } from "@/components/Providers/LocaleProvider";

const WhatIsKafala = ({ locale }: { locale: Locale }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <ExploreKafalaHero locale={locale} />
      <section id="learn-more" className="py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6 text-center">
              {translations.title[locale]}
            </h1>
            <div className="w-24 h-1 bg-primary mx-auto mb-8 rounded-full"></div>
          </div>

          <div className="prose prose-lg max-w-4xl mx-auto animate-fade-up">
            <p>{translations.firstParagraph[locale]}</p>

            <p>{translations.secondParagraph[locale]}</p>

            <blockquote className="bg-gray-100 p-6 border-l-4 border-primary my-8">
              <p className="text-right font-arabic text-lg mb-4">
                عَنْ سَهْلِ بْنِ سَعْدٍ رضي الله عنه قَالَ: قَالَ رَسُولَ
                اَللَّهِ صلى الله عليه وسلم: أَنَا وَكَافِلُ الْيَتِيمِ في
                الْجَنَّةِ هكَذَا، وَأَشَارَ بِالسَّبَّابَةِ وَالْوُسطَى
                وَفَرَّجَ بَيْنَهُمَا شَيْئاً.
              </p>
              {locale === "en" && (
                <p>
                  From Sahl bin Sa&apos;ad (may Allah be pleased with him), he
                  said: &ldquo;The Messenger of Allah sallallaahu &apos;alaihi
                  wa sallam said: &ldquo;I and the one who looks after an orphan
                  will be like this in Paradise,&rdquo; showing his middle and
                  index fingers and separating them.&rdquo; [Sahih al-Bukhari]
                </p>
              )}
            </blockquote>
            <p>{translations.firstHadith.explaination[locale]}</p>
            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">
              {translations.firstHadith.essentialPhrases.title[locale]}
            </h2>

            <ol className="list-decimal pl-6 space-y-4">
              {translations.firstHadith.essentialPhrases.phrases[locale].map(
                (phrase, index) => (
                  <li key={index}>{phrase}</li>
                ),
              )}
            </ol>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">
              {translations.islamicRules.description[locale]}
            </h2>

            <ul className="list-disc pl-6 space-y-4">
              <li>
                {translations.islamicRules.rules[locale][0]}
                <blockquote className="bg-gray-100 p-4 my-2 border-l-4 border-primary">
                  <p className="text-right font-arabic">
                    ادْعُوهُمْ لِآبَائِهِمْ هُوَ أَقْسَطُ عِندَ اللَّـهِ ۚ فَإِن
                    لَّمْ تَعْلَمُوا آبَاءَهُمْ فَإِخْوَانُكُمْ فِي الدِّينِ
                    وَمَوَالِيكُمْ سورة
                  </p>
                  {locale === "en" && (
                    <p>
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
                  <li key={index + 1}>{rule}</li>
                ))}
            </ul>

            <div className="text-sm mt-12 border-t pt-6 text-gray-600">
              <p>{translations.Footnote.copiedFrom[locale]}</p>

              <h3 className="font-bold mt-6 mb-2">
                {translations.Footnote.list.listTitle[locale]}
              </h3>
              <ol className="list-decimal pl-6 space-y-1">
                {translations.Footnote.list.listItems[locale].map(
                  (item, index) => (
                    <li key={index}>{item}</li>
                  ),
                )}
              </ol>

              <h3 className="font-bold mt-6 mb-2">
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

              <h3 className="font-bold mt-6 mb-2">
                {translations.References.title[locale]}
              </h3>
              <ol className="list-decimal pl-6 space-y-1">
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

      <BackToTopButton />
    </div>
  );
};

export default WhatIsKafala;
