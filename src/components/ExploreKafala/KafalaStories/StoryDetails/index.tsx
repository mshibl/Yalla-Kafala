import { MakeDifference } from "@/components/Homepage/MakeDifference";
import type { Locale } from "@/components/Providers/LocaleProvider";
import StoryNotFound from "./StoryNotFound";
import StoryContent from "./StoryContent";
import { fetchStoryById } from "@/server/actions/stories/fetchStories";
import { Suspense } from "react";
import LoadingState from "./LoadingState";

const StoryDetailsFetch = async ({
  id,
  locale,
}: {
  id: number;
  locale: Locale;
}) => {
  const story = await fetchStoryById(id);
  if (!story.success || !story.data) {
    return <StoryNotFound />;
  }

  return <StoryContent story={story.data} locale={locale} />;
};

export default function StoryDetails({
  id,
  locale,
}: {
  id: number;
  locale: Locale;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-24 md:pt-32">
        <Suspense fallback={<LoadingState />}>
          <StoryDetailsFetch id={id} locale={locale} />
        </Suspense>
        <MakeDifference locale={locale} />
      </main>
    </div>
  );
}
