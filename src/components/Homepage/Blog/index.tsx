import BlogsClient from "./BlogsClient";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingSkeleton = () => (
  <div className="container mx-auto grid gap-6 px-6 py-16 md:grid-cols-2 lg:grid-cols-3">
    {[0, 1, 2].map((i) => (
      <div key={i} className="overflow-hidden rounded-3xl bg-white">
        <Skeleton className="aspect-video w-full" />
        <div className="space-y-2 p-6">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    ))}
  </div>
);

const BlogsContent = async () => {
  const blogs = await fetchQuery(api.stories.queries.getStories, {
    featuredOnly: true,
    category: "blog",
  });
  if (!blogs || blogs.length === 0) return null;
  return <BlogsClient blogs={blogs} />;
};

const Blogs = () => {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <BlogsContent />
    </Suspense>
  );
};

export default Blogs;
