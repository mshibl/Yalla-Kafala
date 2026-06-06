import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import AnimatedContainer from "./AnimatedContainer";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Locale } from "@/components/Providers/LocaleProvider";

const BlogsContent = async () => {
  const blogs = await fetchQuery(api.stories.queries.getStories, {
    publishedOnly: true,
  });

  if (!blogs || blogs.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-2xl font-bold">No blogs found</p>
      </div>
    );
  }

  return <AnimatedContainer blogs={blogs} />;
};

const BlogsSection = ({ locale }: { locale: Locale }) => {
  return (
    <section className="py-24 bg-gray-50">
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
        <BlogsContent />
      </Suspense>
    </section>
  );
};

export default BlogsSection;
