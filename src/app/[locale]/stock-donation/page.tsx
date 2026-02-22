import type { Locale } from "@/components/Providers/LocaleProvider";
import StockDonation from "@/components/StockDonation";

export default async function StockDonationPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <StockDonation locale={locale} />;
}
