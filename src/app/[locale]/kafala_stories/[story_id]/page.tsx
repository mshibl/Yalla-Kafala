import ErrorBoundary from "@/src/components/ErrorBoundary";
import LoadingFallback from "@/src/components/LoadingFallback";
import Stories from "@/src/components/Stories";
import Story from "@/src/components/Stories/Story";
import { fetchStory } from "@/src/utils/fetch-stories";
import { Box, Typography } from "@mui/material";
import { Metadata } from "next";
import { Suspense } from "react";

export async function generateMetadata({
  params: { locale, story_id },
}: {
  params: { locale: string; story_id: string };
}): Promise<Metadata> {
  // Fetch story details based on story_id
  const story = await fetchStory({ story_id });

  // Determine if locale is Arabic
  const isArabic = locale === "ar";

  // Set title and description based on the fetched story details
  const title = isArabic ? story.arabic_title : story.english_title;
  const description = isArabic
    ? story.arabic_description
    : story.english_description;

  // Set image URL with fallback if none provided
  const imageUrl =
    story.image_link || "https://yallakafala.org/images/default-story.jpg";

  // Return metadata for the page
  return {
    title,
    description,
    alternates: {
      languages: {
        en: `/en/kafala-stories/${story_id}`,
        ar: `/ar/kafala-stories/${story_id}`,
      },
    },
    keywords: isArabic
      ? [
          "كفالة",
          "تبني",
          "أيتام",
          "مصر",
          "رعاية الأطفال",
          "حماية الطفل",
          "منظمة غير حكومية",
          "دار أيتام",
          "رعاية بديلة",
          "حقوق الطفل",
          "دعم الأطفال",
          "الأسر البديلة",
          "الرعاية الاجتماعية",
          "تمكين الأطفال",
          "العمل الخيري",
          "التطوع في مصر",
          "مساعدة الأطفال المحتاجين",
          "برامج رعاية الأيتام",
          "الأسر الكافلة",
          "حماية الأطفال المعرضين للخطر",
          "التنمية الاجتماعية",
          "الدعم النفسي للأطفال",
          "الرعاية الصحية للأيتام",
          "التعليم للأطفال المحرومين",
          "مؤسسة خيرية للأطفال",
          "يلا كفالة",
          "خدمات الدعم للأيتام",
          "تحسين حياة الأطفال",
          "الحماية الاجتماعية للأطفال",
          "مبادرات رعاية الطفل",
        ]
      : [
          "kafala",
          "adoption",
          "orphans",
          "Egypt",
          "child welfare",
          "child protection",
          "NGO",
          "orphanage",
          "alternative care",
          "children's rights",
          "child support",
          "foster families",
          "social care",
          "child empowerment",
          "charity work",
          "volunteering in Egypt",
          "helping children in need",
          "orphan care programs",
          "sponsoring families",
          "protecting at-risk children",
          "social development",
          "psychological support for children",
          "healthcare for orphans",
          "education for underprivileged children",
          "children's charity foundation",
          "Yalla Kafala",
          "support services for orphans",
          "improving children's lives",
          "social protection for children",
          "child care initiatives",
          "Egyptian adoption",
          "guardianship in Egypt",
          "child advocacy",
          "family-based care",
          "child development programs",
          "community outreach",
          "child poverty alleviation",
          "child rights advocacy",
          "sustainable child care",
          "international adoption in Egypt",
        ],
    openGraph: {
      title,
      description,
      url: `https://yallakafala.org/kafala-stories/${story_id}`,
      siteName: "Yalla Kafala",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: isArabic ? "ar_EG" : "en_US",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      creator: "@YallaKafala",
    },
    robots: {
      index: true,
      follow: true,
    },
    other: {
      "og:image:width": "1200",
      "og:image:height": "630",
      "og:image:secure_url": imageUrl,
      "og:site_name": "Yalla Kafala",
      "og:locale": isArabic ? "ar_EG" : "en_US",
      "og:locale:alternate": isArabic ? "en_US" : "ar_EG",
    },
  };
}

const StoryPage = ({
  params: { locale, story_id },
}: {
  params: { locale: string; story_id: string };
}) => {
  return (
    <ErrorBoundary locale={locale}>
      <Suspense fallback={<LoadingFallback />}>
        <Story story_id={story_id} locale={locale} />
        <Box sx={{ p: "16px" }}>
          <Typography variant="h6" fontWeight={700}>
            {locale === "ar" ? "المزيد من قصص الكفالة" : "More Kafala Stories"}
          </Typography>
          <Suspense fallback={<Box height={{ xs: "1040px", md: "520px" }} />}>
            <Stories
              locale={locale}
              storiesCount={3}
              cardsPerRow={3}
              exclude={[story_id]}
              random={true}
            />
          </Suspense>
        </Box>
      </Suspense>
    </ErrorBoundary>
  );
};

export default StoryPage;
