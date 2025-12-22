import KafalaBlogs from "@/components/ExploreKafala/KafalaBlogs";
import type { Locale } from "@/components/Providers/LocaleProvider";
export default async function KafalaBlogsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return <KafalaBlogs locale={locale} />;
}
