import AchievementsSection from "@/src/components/AchievementsSection";
import ActivitiesAndMilestonesHero from "@/src/components/ActivitiesAndMilestonesHero";
import ActivitiesSection from "@/src/components/ActivitiesSection";
import ErrorBoundary from "@/src/components/ErrorBoundary";
import LoadingFallback from "@/src/components/LoadingFallback";
import MilestonesSection from "@/src/components/MilestonesSection";
import OnGroundAccomplishments from "@/src/components/OnGroundAccomplishments";
import { Metadata } from "next";
import { Suspense } from "react";

export async function generateActivitiesMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isArabic = locale === "ar";

  const title = isArabic ? "الأنشطة والمعالم" : "Activities and Milestones";
  const description = isArabic
    ? "اكتشف الأنشطة والمعالم التي تم تحقيقها لدعم الأيتام في مصر من خلال يلا كفالة."
    : "Explore the activities and milestones achieved to support orphans in Egypt through Yalla Kafala.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://yallakafala.org/activities",
      siteName: "Yalla Kafala",
      images: [
        {
          url: "https://yallakafala.org/images/activities.jpg",
          width: 1200,
          height: 630,
        },
      ],
      locale,
      type: "website",
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
