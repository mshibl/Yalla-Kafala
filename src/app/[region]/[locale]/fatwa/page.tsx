import Fatwa from "@/components/Fatwa";
import type { Locale } from "@/components/Providers/LocaleProvider";

export default async function FatwaPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <Fatwa locale={locale} />;
}
