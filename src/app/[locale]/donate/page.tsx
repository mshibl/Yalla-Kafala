import Donate from "@/components/Homepage/Donate";
import type { Locale } from "@/components/Providers/LocaleProvider";

export default async function DonatePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <Donate />;
}
