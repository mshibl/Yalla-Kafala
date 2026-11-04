import KafalaBlogs from "@/components/ExploreKafala/KafalaBlogs";
import type { Locale } from "@/components/Providers/LocaleProvider";
export default async function KafalaArticlesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return <KafalaBlogs locale={locale} category="article" />;
}
