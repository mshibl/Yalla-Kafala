import { Suspense } from "react";
import { FaqsList } from "./FaqsList";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { translations } from "./translations";

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    ))}
  </div>
);

const FAQsContent = async ({ locale }: { locale: Locale }) => {
  const faqs = await fetchQuery(api.faqs.queries.getFaqs, { publishedOnly: true });
  if (!faqs || faqs.length === 0) {
    return null;
  }

  const featuredFaqs = faqs.filter((faq) => faq.featured);
  return <FaqsList locale={locale} faqs={featuredFaqs} />;
};

const FAQs = ({ locale }: { locale: Locale }) => {
  return (
    <section id="faq" className="section-padding bg-white">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="heading-md text-primary mb-6 animate-fade-up opacity-0">
            {translations.title[locale]}
          </h2>
          <p className="text-gray-600 text-lg animate-fade-up opacity-0 animation-delay-200">
            {translations.description[locale]}
          </p>
        </div>

        <div className="max-w-4xl mx-auto glass-card p-6 md:p-8 rounded-2xl shadow-lg animate-fade-up opacity-0 animation-delay-400">
          <Suspense fallback={<LoadingSkeleton />}>
            <FAQsContent locale={locale} />
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default FAQs;
