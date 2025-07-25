import { Skeleton } from "@/components/ui/skeleton";
import BackToStoriesButton from "./BackToStoriesButton";

export default function LoadingState() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-6">
        <BackToStoriesButton locale={"en"} />

        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-3/4 mb-8" />

          {/* Image skeleton */}
          <div className="aspect-video bg-gray-200 rounded-lg mb-8 animate-pulse" />

          {/* Content skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    </section>
  );
}
