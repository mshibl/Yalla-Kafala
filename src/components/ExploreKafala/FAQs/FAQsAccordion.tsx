import React, { Suspense } from "react";
import FAQsSearchList from "./FAQsSearchList";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";

const FAQsContent = async ({ locale }: { locale: Locale }) => {
  const faqs = await fetchQuery(api.faqs.queries.getFaqs, {
    publishedOnly: true,
  });

  if (!faqs || faqs.length === 0) {
    return (
      <div className="text-center text-gray-600">
        {locale === "en" ? "No questions yet." : "لا توجد أسئلة بعد."}
      </div>
    );
  }
  return <FAQsSearchList faqs={faqs} locale={locale} />;
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
