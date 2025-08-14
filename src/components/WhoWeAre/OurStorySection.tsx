import React from "react";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { translations } from "./translations";

export const OurStorySection = ({ locale }: { locale: Locale }) => {
  return (
    <section
      id="our-story"
      className="py-16 bg-white"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-primary mb-4">
          {translations.whoWeAre.sectionTitle[locale]}
        </h1>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 mb-10">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              {translations.whoWeAre.ourStoryTitle[locale]}
            </h2>
            {translations.whoWeAre.paragraphs.map((para, idx) => (
              <p key={idx} className="text-gray-700 mb-4">
                {para[locale]}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
