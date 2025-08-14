import type { Locale } from "@/components/Providers/LocaleProvider";
import HeroSection from "./HeroSection";
import ActivitiesSection from "./ActivitiesSection";
import AchievementsSection from "./AchievementsSection";
import MilestonesSection from "./MilestonesSection";
import OnGroundSection from "./OnGroundSection";

const ActivitiesAndMilestones = ({ locale }: { locale: Locale }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection locale={locale} />
      <ActivitiesSection locale={locale} />
      <AchievementsSection locale={locale} />
      <MilestonesSection locale={locale} />
      <OnGroundSection locale={locale} />
    </div>
  );
};

export default ActivitiesAndMilestones;
