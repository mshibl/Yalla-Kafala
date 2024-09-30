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

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://yallakafala.org/kafala-stories/${story_id}`,
      siteName: "Yalla Kafala",
      images: [
        {
          url:
            story.image_link ||
            "https://yallakafala.org/images/default-story.jpg",
          width: 1200,
          height: 630,
        },
      ],
      locale,
      type: "article",
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
