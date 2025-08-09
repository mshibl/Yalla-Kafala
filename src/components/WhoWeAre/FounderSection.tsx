import React from "react";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { translations } from "./translations";

export const FounderSection = ({ locale }: { locale: Locale }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-semibold text-center text-primary mb-8">
          {translations.founder.title[locale]}
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 bg-white rounded-lg shadow-sm p-8">
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-primary/20">
                <img
                  src={translations.founder.image}
                  alt={translations.founder.name[locale]}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <h3 className="text-xl font-semibold text-primary mb-2">
                {translations.founder.name[locale]}
              </h3>
              <p className="text-gray-600 italic mb-4">
                {translations.founder.role[locale]}
              </p>
              {translations.founder.bio.map((b, idx) => (
                <p key={idx} className="text-gray-700 mb-4">
                  {b[locale]}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
