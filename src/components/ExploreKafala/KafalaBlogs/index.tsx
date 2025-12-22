import BlogsSection from "./BlogsSection";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { MakeDifference } from "@/components/Homepage/MakeDifference";
import ExploreKafalaHero from "../ExploreKafalaHero";

const KafalaBlogs = ({ locale }: { locale: Locale }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <ExploreKafalaHero locale={locale} />

      <main className="flex-grow">
        <BlogsSection locale={locale} />
      </main>
    </div>
  );
};

export default KafalaBlogs;
