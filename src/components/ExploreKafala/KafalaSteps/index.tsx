import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MakeDifference } from "@/components/Homepage/MakeDifference";
import { BackToTopButton } from "../BackToTopButton";
import ExploreKafalaHero from "../ExploreKafalaHero";
import { familyCardSteps, requiredDocuments, steps } from "./constants";
import { translations } from "./translations";
import type { Locale } from "@/components/Providers/LocaleProvider";
const KafalaSteps = ({ locale }: { locale: Locale }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <ExploreKafalaHero locale={locale} />
      <section id="learn-more" className="py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto mb-12 animate-fade-in">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6 text-center">
              {translations.title[locale]}
            </h1>
            <div className="w-24 h-1 bg-primary mx-auto mb-8 rounded-full"></div>
            <p className="text-gray-600 text-center max-w-3xl mx-auto mb-8">
              {translations.description[locale]}
            </p>
          </div>

          {/* Kafala Steps */}
          <div className="max-w-5xl mx-auto mb-20">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
              {translations.kafalaStepsTitle[locale]}
            </h2>

            <div className="grid gap-8 md:grid-cols-2">
              {steps[locale].map((step, index) => (
                <div
                  key={index}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Card className="h-full border-l-4 border-primary overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2 text-gray-800">
                            {step.title}
                          </h3>
                          <p className="text-gray-600">{step.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Required Documents */}
          <div
            className="max-w-4xl mx-auto mb-20 animate-fade-up"
            style={{ animationDelay: "600ms" }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
              {translations.requiredDocumentsTitle[locale]}
            </h2>

            <Card>
              <CardContent className="p-8">
                <ul className="space-y-4">
                  {requiredDocuments[locale].map((doc, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-primary shrink-0 mt-1" />
                      <span className="text-gray-700">{doc}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Family Card Steps */}
          <div
            className="max-w-4xl mx-auto mb-12 animate-fade-up"
            style={{ animationDelay: "800ms" }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
              {translations.familyCardStepsTitle[locale]}
            </h2>

            <Card>
              <CardContent className="p-8">
                <ol className="list-decimal pl-5 space-y-4">
                  {familyCardSteps[locale].map((step, index) => (
                    <li key={index} className="text-gray-700 pl-2">
                      {step}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <MakeDifference locale={locale} />

      <BackToTopButton />
    </div>
  );
};

export default KafalaSteps;
