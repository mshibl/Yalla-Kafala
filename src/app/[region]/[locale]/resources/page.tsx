import Resources from "@/components/ExploreKafala/Resources";
import type { Locale } from "@/components/Providers/LocaleProvider";

export default async function ResourcesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <Resources locale={locale} />;
}
