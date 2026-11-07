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
        <div className="mx-auto max-w-5xl">
          <h2 className="heading-lg mb-8 text-gray-900">
            {translations.whoWeAre.sectionTitle[locale]}
          </h2>
          <div className="mb-10">
            {translations.whoWeAre.paragraphs.map((para, idx) => (
              <p
                key={idx}
                className="mb-4 text-lg leading-relaxed text-gray-700"
              >
                {para[locale]}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
