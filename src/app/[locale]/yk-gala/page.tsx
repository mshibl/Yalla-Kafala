import type { Locale } from "@/components/Providers/LocaleProvider";
import YallaKafalaGala from "@/components/YKGala";

export default async function YKGalaPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <YallaKafalaGala locale={locale} />;
}
