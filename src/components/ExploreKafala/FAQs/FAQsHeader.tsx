import type { Locale } from "@/components/Providers/LocaleProvider";
import React from "react";

const FAQsHeader = ({ locale }: { locale: Locale }) => (
  <div className="max-w-4xl mx-auto mb-8 animate-fade-in-up transition-all duration-700 ease-out">
    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6 text-center">
      {locale === "en" ? "Frequently Asked Questions" : "الأسئلة الشائعة"}
    </h1>
    <div className="w-24 h-1 bg-primary mx-auto mb-8 rounded-full"></div>
    <p className="text-gray-600 text-center mb-12">
      {locale === "en"
        ? "Find answers to the most common questions about Kafala and our organization."
        : "ابحث عن الإجابات لأكثر الأسئلة الشائعة حول الكفالة ومنظمتنا."}
    </p>
  </div>
);

export default FAQsHeader;
