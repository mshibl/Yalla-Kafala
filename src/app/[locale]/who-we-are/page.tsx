import type { Locale } from "@/components/Providers/LocaleProvider";
import WhoWeAre from "@/components/WhoWeAre";

export default async function WhoWeArePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <WhoWeAre locale={locale} />;
}
