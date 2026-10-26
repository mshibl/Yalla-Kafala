import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import AnimatedContainer from "./AnimatedContainer";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Locale } from "@/components/Providers/LocaleProvider";
import type { StoryCategory } from "@/lib/types";
import { translations } from "./translations";

const BlogsContent = async ({
  locale,
  category,
}: {
  locale: Locale;
  category: StoryCategory;
}) => {
  const blogs = await fetchQuery(api.stories.queries.getStories, {
    publishedOnly: true,
    category,
  });

  if (!blogs || blogs.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-2xl font-bold">
          {translations.empty[category][locale]}
        </p>
      </div>
    );
  }

  return <AnimatedContainer blogs={blogs} category={category} />;
};

const BlogsSection = ({
  locale,
  category,
}: {
  locale: Locale;
  category: StoryCategory;
}) => {
  return (
    <section className="bg-gray-50 pb-24 pt-12 md:pt-16">
      <Suspense
        fallback={
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="rounded-lg overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        }
      >
        <BlogsContent locale={locale} category={category} />
      </Suspense>
    </section>
  );
};

export default BlogsSection;
