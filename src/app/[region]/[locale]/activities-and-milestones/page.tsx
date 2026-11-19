import ActivitiesAndMilestones from "@/components/ActivitiesAndMilestones";
import type { Locale } from "@/components/Providers/LocaleProvider";

export default async function ActivitiesAndMilestonesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <ActivitiesAndMilestones locale={locale} />;
}
