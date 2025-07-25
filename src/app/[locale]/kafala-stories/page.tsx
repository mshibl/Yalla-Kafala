import KafalaStories from "@/components/ExploreKafala/KafalaStories";
import type { Locale } from "@/components/Providers/LocaleProvider";
export default async function KafalaStoriesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return <KafalaStories locale={locale} />;
}
