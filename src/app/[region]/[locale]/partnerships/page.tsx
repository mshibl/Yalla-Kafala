import Partnerships from "@/components/Partnerships";
import type { Locale } from "@/components/Providers/LocaleProvider";

export default async function PartnershipsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <Partnerships locale={locale} />;
}
