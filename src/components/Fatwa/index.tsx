import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BackToTopButton } from "@/components/ExploreKafala/BackToTopButton";
import { translations } from "./translations";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ExploreKafalaHero from "../ExploreKafala/ExploreKafalaHero";

const Fatwa = ({ locale }: { locale: Locale }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <ExploreKafalaHero locale={locale} />

      {/* Fatwa Summary Section */}
      <section id="fatwa" className="py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          {/* Title */}
          <div className="max-w-4xl mx-auto mb-12 text-center animate-fade-in">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">
              {translations.fatwaTitle[locale]}
            </h1>
            <div className="w-24 h-1 bg-primary mx-auto mb-8 rounded-full"></div>
            <p className="text-gray-600 max-w-3xl mx-auto">
              {translations.fatwaIntro[locale]}
            </p>
          </div>

          {/* Summary */}
          <div className="max-w-5xl mx-auto mb-16 animate-fade-up">
            <Card>
              <CardContent className="p-8 space-y-6">
                <h2 className="text-2xl font-semibold text-primary text-center mb-6">
                  {translations.summaryTitle[locale]}
                </h2>

                <p className="text-gray-700 leading-relaxed">
                  {translations.summaryBody[locale]}
                </p>

                <div className="bg-primary/5 p-6 rounded-md border-l-4 border-primary mt-6">
                  <h3 className="font-semibold text-primary mb-2">
                    {translations.keyPointsTitle[locale]}
                  </h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    {translations.keyPoints[locale].map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Usage of Zakat Section */}
          <div
            className="max-w-4xl mx-auto mb-16 animate-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                  {translations.zakatUsageTitle[locale]}
                </h2>
                <ul className="list-disc pl-6 text-gray-700 space-y-3">
                  {translations.zakatUsagePoints[locale].map((usage, index) => (
                    <li key={index}>{usage}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Reference Section */}
          <div
            className="max-w-3xl mx-auto mb-20 text-center animate-fade-up"
            style={{ animationDelay: "400ms" }}
          >
            <FileText className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              {translations.referenceTitle[locale]}
            </h3>
            <p className="text-gray-700 mb-6">
              {translations.referenceDescription[locale]}
            </p>

            <Link
              href={`${translations.fatwaPDFUrl[locale]}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                className="bg-primary text-white hover:bg-primary/90"
                size="lg"
              >
                {translations.downloadPDFButton[locale]}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <BackToTopButton />
    </div>
  );
};

export default Fatwa;
