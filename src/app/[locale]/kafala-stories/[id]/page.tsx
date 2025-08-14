import StoryDetails from "@/components/ExploreKafala/KafalaStories/StoryDetails";
import StoryNotFound from "@/components/ExploreKafala/KafalaStories/StoryDetails/StoryNotFound";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { fetchStoriesIds } from "@/server/actions/stories/fetchStories";

export default async function KafalaStoryPage({
  params,
}: {
  params: Promise<{ id: string; locale: Locale }>;
}) {
  const { locale, id } = await params;
  if (isNaN(parseInt(id))) {
    return <StoryNotFound />;
  }
  return <StoryDetails id={parseInt(id)} locale={locale} />;
}

export async function generateStaticParams() {
  const storiesIds = await fetchStoriesIds();
  if (!storiesIds.success || !storiesIds.data) {
    return [];
  }
  return storiesIds.data;
}
