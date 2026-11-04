import FAQs from "@/components/ExploreKafala/FAQs";
import type { Locale } from "@/components/Providers/LocaleProvider";

export default async function FaqsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <FAQs locale={locale} />;
}
