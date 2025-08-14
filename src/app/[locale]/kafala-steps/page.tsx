import KafalaSteps from "@/components/ExploreKafala/KafalaSteps";
import type { Locale } from "@/components/Providers/LocaleProvider";

export default async function KafalaStepsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <KafalaSteps locale={locale} />;
}
