import ActivitiesAndMilestones from "@/components/ActivitiesAndMilestones";
import type { Locale } from "@/components/Providers/LocaleProvider";
import WhoWeAre from "@/components/WhoWeAre";

export default async function ActivitiesAndMilestonesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <ActivitiesAndMilestones locale={locale} />;
}
