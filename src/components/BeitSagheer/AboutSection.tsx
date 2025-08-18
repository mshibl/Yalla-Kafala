"use server";
import React from "react";
import { translations } from "./translations";

const AboutSection = ({ locale }: { locale: string }) => (
  <section className="py-16 md:py-24 bg-white">
    <div className="container mx-auto px-6">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          {locale === "ar"
            ? translations.about.title.ar
            : translations.about.title.en}
        </h2>
        <p className="text-lg text-gray-600">
          {locale === "ar"
            ? translations.about.description.ar
            : translations.about.description.en}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-primary">
              {locale === "ar"
                ? translations.about.whyTitle.ar
                : translations.about.whyTitle.en}
            </h3>
            <ul className="text-gray-600 list-disc list-inside space-y-2">
              <li>
                {locale === "ar"
                  ? translations.about.whyDescription1.ar
                  : translations.about.whyDescription1.en}
              </li>
              <li>
                {locale === "ar"
                  ? translations.about.whyDescription2.ar
                  : translations.about.whyDescription2.en}
              </li>
              <li>
                {locale === "ar"
                  ? translations.about.whyDescription3.ar
                  : translations.about.whyDescription3.en}
              </li>
              <li>
                {locale === "ar"
                  ? translations.about.whyDescription4.ar
                  : translations.about.whyDescription4.en}
              </li>
            </ul>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-lg"></div>
            <div className="relative z-10 overflow-hidden rounded-lg shadow-lg">
              <img
                src="/images/child-playing.webp"
                alt={"Children playing together"}
                className="w-full h-[400px] object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-secondary/10 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection;
