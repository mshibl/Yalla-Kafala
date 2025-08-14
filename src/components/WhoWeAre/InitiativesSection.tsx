import React from "react";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { Award } from "lucide-react";
import { translations } from "./translations";

export const InitiativesSection = ({ locale }: { locale: Locale }) => {
  return (
    <section className="py-16 bg-white" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-semibold text-center text-primary mb-8">
          {translations.initiatives.title[locale]}
        </h2>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <ul className="space-y-6">
              {translations.initiatives.items.map((initiative, index) => (
                <li key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center mb-1">
                      <h3 className="font-semibold text-xl text-primary">
                        {initiative.title[locale]}
                      </h3>
                    </div>
                    <p className="text-gray-700">
                      {initiative.description[locale]}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
