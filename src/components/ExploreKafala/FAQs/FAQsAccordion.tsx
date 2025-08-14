import React, { Suspense } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { fetchFaqs } from "@/server/actions/faqs/fetchFaqs";
import { Skeleton } from "@/components/ui/skeleton";

const FAQsContent = async ({ locale }: { locale: Locale }) => {
  const faqs = await fetchFaqs();
  if (!faqs.success || !faqs.data) {
    return (
      <div className="text-center text-gray-500">Unable to fetch FAQs</div>
    );
  }
  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {faqs.data.map((faq, index) => (
        <AccordionItem
          key={index}
          value={`item-${index}`}
          className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
        >
          <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <span className="text-left text-gray-800 font-medium text-base">
              {locale === "en" ? faq.questionEn : faq.questionAr}
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 pt-2 text-gray-600">
            <div
              className="text-base"
              dangerouslySetInnerHTML={{
                __html: locale === "en" ? faq.answerEn : faq.answerAr,
              }}
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

const LoadingSkeleton = () => (
  <div className="w-full space-y-4">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
      >
        <div className="px-6 py-4">
          <Skeleton className="h-6 w-3/4 mb-2" />
        </div>
        <div className="px-6 pb-4 pt-2">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    ))}
  </div>
);

const FAQsAccordion = async ({ locale }: { locale: Locale }) => {
  return (
    <div
      className="max-w-3xl mx-auto animate-fade-in-up transition-all duration-700 ease-out delay-100"
      data-faqs-content
    >
      <Suspense fallback={<LoadingSkeleton />}>
        <FAQsContent locale={locale} />
      </Suspense>
    </div>
  );
};

export default FAQsAccordion;
