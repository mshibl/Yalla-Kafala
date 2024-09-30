import ErrorBoundary from "@/src/components/ErrorBoundary";
import FAQs from "@/src/components/FAQs";
import FAQsPageHeader from "@/src/components/FAQs/FAQsPageHeader";
import LoadingFallback from "@/src/components/LoadingFallback";
import { Box } from "@mui/material";
import { Metadata } from "next";
import { Suspense } from "react";
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isArabic = locale === "ar";

  const title = isArabic ? "الأسئلة الشائعة" : "FAQs";
  const description = isArabic
    ? "تجد هنا إجابات عن الأسئلة الشائعة حول الكفالة، الإجراءات، المتطلبات، والدعم الذي تقدمه يلا كفالة للأسر الكافلة."
    : "Find answers to frequently asked questions about kafala, the process, requirements, and the support Yalla Kafala provides to kafala families.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://yallakafala.org/faqs",
      siteName: "Yalla Kafala",
      images: [
        {
          url: "https://yallakafala.org/images/faqs.jpg",
          width: 1200,
          height: 630,
        },
      ],
      locale,
      type: "website",
    },
  };
}

const FAQsPage = ({ params: { locale } }: { params: { locale: string } }) => {
  return (
    <ErrorBoundary locale={locale}>
      <Suspense fallback={<LoadingFallback />}>
        <Box>
          <FAQsPageHeader locale={locale} />
          <FAQs locale={locale} firstFaqOpen={true} />
        </Box>
      </Suspense>
    </ErrorBoundary>
  );
};

export default FAQsPage;
