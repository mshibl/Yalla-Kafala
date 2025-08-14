import type { Locale } from "@/components/Providers/LocaleProvider";
import { HeroSection } from "./HeroSection";
import { OurStorySection } from "./OurStorySection";
import { FounderSection } from "./FounderSection";
import { TeamSection } from "./TeamSection";
import { VideoSection } from "./VideoSection";
import { InitiativesSection } from "./InitiativesSection";

const WhoWeAre = ({ locale }: { locale: Locale }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <HeroSection locale={locale} />
        <OurStorySection locale={locale} />
        <FounderSection locale={locale} />
        {/* <TeamSection locale={locale} /> */}
        <VideoSection locale={locale} />
        <InitiativesSection locale={locale} />
      </main>
    </div>
  );
};

export default WhoWeAre;
