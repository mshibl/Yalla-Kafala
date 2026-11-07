import type { Locale } from "@/components/Providers/LocaleProvider";
import React from "react";
import PageHeader from "@/components/ui/PageHeader";

const FAQsHeader = ({ locale }: { locale: Locale }) => (
  <PageHeader
    className="mb-10"
    width="max-w-3xl"
    eyebrow={locale === "en" ? "Explore Kafala" : "استكشف الكفالة"}
    title={locale === "en" ? "Frequently Asked Questions" : "الأسئلة الشائعة"}
    lede={
      locale === "en"
        ? "Find answers to the most common questions about Kafala and our organization."
        : "ابحث عن الإجابات لأكثر الأسئلة الشائعة حول الكفالة ومنظمتنا."
    }
  />
);

export default FAQsHeader;
