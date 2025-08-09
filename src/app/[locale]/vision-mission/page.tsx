import ActivitiesAndMilestones from "@/components/ActivitiesAndMilestones";
import type { Locale } from "@/components/Providers/LocaleProvider";
import VisionMission from "@/components/VisionAndMission";

export default async function VisionMissionPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <VisionMission locale={locale} />;
}
