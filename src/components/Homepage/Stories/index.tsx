import StoriesClient from "./StoriesClient";
import { fetchStories } from "@/server/actions/stories/fetchStories";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingSkeleton = () => (
  <div className="w-full max-w-7xl mx-auto p-10">
    <div className="rounded-lg overflow-hidden shadow-md bg-white">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
        <div className="md:col-span-6 relative h-80 md:h-[450px]">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="md:col-span-6 p-6 md:p-10">
          <div className="hidden md:block mb-6">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-3/4" />
          </div>
          <div className="relative">
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gray-200 rounded"></div>
            <div className="pl-6">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
              <div className="mt-8">
                <Skeleton className="h-6 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const StoriesContent = async () => {
  const stories = await fetchStories({ featuredOnly: true });
  if (!stories.success || !stories.data) return null;
  return <StoriesClient stories={stories.data} />;
};

const Stories = () => {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <StoriesContent />
    </Suspense>
  );
};

export default Stories;
