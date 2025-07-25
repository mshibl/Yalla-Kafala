import StoriesSection from "./StoriesSection";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { MakeDifference } from "@/components/Homepage/MakeDifference";
import ExploreKafalaHero from "../ExploreKafalaHero";

const KafalaStories = ({ locale }: { locale: Locale }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <ExploreKafalaHero locale={locale} />

      <main className="flex-grow">
        <StoriesSection locale={locale} />
        <MakeDifference locale={locale} />
      </main>
    </div>
  );
};

export default KafalaStories;
