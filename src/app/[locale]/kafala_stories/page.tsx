import ErrorBoundary from "@/src/components/ErrorBoundary";
import LoadingFallback from "@/src/components/LoadingFallback";
import Stories from "@/src/components/Stories";
import StoriesPageHeader from "@/src/components/Stories/StoriesPageHeader";
import { Box } from "@mui/material";
import { Metadata } from "next";
import { Suspense } from "react";
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isArabic = locale === "ar";

  const title = isArabic ? "قصص الكفالة" : "Kafala Stories";
  const description = isArabic
    ? "استمع إلى قصص ملهمة من الأسر الكافلة في مصر وحول العالم. يلا كفالة تشارك رحلات الكفالة التي غيرت حياة الأطفال وأسرهم، وتعرض تجارب حقيقية مع الكفالة."
    : "Hear inspiring stories from kafala families in Egypt and around the world. Yalla Kafala shares life-changing kafala journeys that transformed the lives of children and their families, showcasing real experiences with kafala.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://yallakafala.org/kafala-stories",
      siteName: "Yalla Kafala",
      images: [
        {
          url: "https://yallakafala.org/images/kafala-stories.jpg",
          width: 1200,
          height: 630,
        },
      ],
      locale,
      type: "website",
    },
  };
}

const StoriesPage = ({
  params: { locale },
}: {
  params: { locale: string };
}) => {
  return (
    <ErrorBoundary locale={locale}>
      <Suspense fallback={<LoadingFallback />}>
        <Box pb="100px">
          <StoriesPageHeader locale={locale} />
          <Stories locale={locale} />
        </Box>
      </Suspense>
    </ErrorBoundary>
  );
};

export default StoriesPage;
