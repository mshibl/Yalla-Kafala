import AchievementsSection from "@/src/components/AchievementsSection";
import ActivitiesAndMilestonesHero from "@/src/components/ActivitiesAndMilestonesHero";
import ActivitiesSection from "@/src/components/ActivitiesSection";
import ErrorBoundary from "@/src/components/ErrorBoundary";
import LoadingFallback from "@/src/components/LoadingFallback";
import MilestonesSection from "@/src/components/MilestonesSection";
import OnGroundAccomplishments from "@/src/components/OnGroundAccomplishments";
import { Metadata } from "next";
import { Suspense } from "react";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isArabic = locale === "ar";

  const title = isArabic ? "الأنشطة والمعالم" : "Activities and Milestones";
  const description = isArabic
    ? "اكتشف الأنشطة والمعالم التي تم تحقيقها لدعم الأيتام في مصر من خلال يلا كفالة."
    : "Explore the activities and milestones achieved to support orphans in Egypt through Yalla Kafala.";

  const url = `https://yallakafala.org/${locale}/activities`;
  const imageUrl = "https://yallakafala.org/images/activities.jpg";

  return {
    title,
    description,
    alternates: {
      languages: {
        en: "/en/activities",
        ar: "/ar/activities",
      },
    },
    keywords: isArabic
      ? ["الأنشطة", "المعالم", "كفالة", "أيتام", "مصر"]
      : ["activities", "milestones", "kafala", "orphans", "Egypt"],
    viewport: {
      width: "device-width",
      initialScale: 1,
      maximumScale: 1,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Yalla Kafala",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: isArabic ? "الأنشطة والمعالم" : "Activities and Milestones",
        },
      ],
      locale: isArabic ? "ar_EG" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      creator: "@YallaKafala",
    },
    other: {
      "og:image:width": "1200",
      "og:image:height": "630",
      "og:site_name": "Yalla Kafala",
      "og:locale": isArabic ? "ar_EG" : "en_US",
      "og:locale:alternate": isArabic ? "en_US" : "ar_EG",
      "og:image:secure_url": imageUrl, // WhatsApp specific
      "fb:pages": "469771757195549", // Facebook Page ID
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

const ActivitiesAndMilestonesPage = ({
  params: { locale },
}: {
  params: { locale: string };
}) => {
  return (
    <ErrorBoundary locale={locale}>
      <Suspense fallback={<LoadingFallback />}>
        <ActivitiesAndMilestonesHero />

        <ActivitiesSection locale={locale} />

        <AchievementsSection locale={locale} />

        <MilestonesSection locale={locale} />

        <OnGroundAccomplishments locale={locale} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default ActivitiesAndMilestonesPage;
