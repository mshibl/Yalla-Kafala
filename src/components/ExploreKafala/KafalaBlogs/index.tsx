import BlogsSection from "./BlogsSection";
import type { Locale } from "@/components/Providers/LocaleProvider";
import type { StoryCategory } from "@/lib/types";

const KafalaBlogs = ({
  locale,
  category = "blog",
}: {
  locale: Locale;
  category?: StoryCategory;
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-24 md:pt-32">
        <BlogsSection locale={locale} category={category} />
      </main>
    </div>
  );
};

export default KafalaBlogs;
