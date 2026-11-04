import WhatIsKafala from "@/components/ExploreKafala/WhatIsKafala";
import type { Locale } from "@/components/Providers/LocaleProvider";
export default async function WhatIsKafalaPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <WhatIsKafala locale={locale} />;
}
