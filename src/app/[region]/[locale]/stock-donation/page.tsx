import { redirect } from "next/navigation";
import type { Locale } from "@/components/Providers/LocaleProvider";
import StockDonation from "@/components/StockDonation";
import type { Region } from "@/lib/region";

export default async function StockDonationPage({
  params,
}: {
  params: Promise<{ locale: Locale; region: Region }>;
}) {
  const { locale, region } = await params;
  // Stock donations go through a US fund (USD) — not offered on the Egyptian site.
  if (region === "eg") redirect(`/${locale}/donate`);
  return <StockDonation locale={locale} />;
}
