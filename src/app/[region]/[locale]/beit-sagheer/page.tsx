import BeitSagheer from "@/components/BeitSagheer";
import type { Locale } from "@/components/Providers/LocaleProvider";

export default async function BeitSagheerPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <BeitSagheer locale={locale} />;
}
