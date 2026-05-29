import type { Locale } from "@/components/Providers/LocaleProvider";
import DonatePage from "@/components/DonatePage";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === "ar";

  return {
    title: isArabic ? "تبرّع الآن | يلا كفالة" : "Donate | Yalla Kafala",
    description: isArabic
      ? "تبرعك يساعدنا في ربط الأيتام بعائلات محبة. ادعم يلا كفالة اليوم."
      : "Your donation helps connect orphans with loving families. Support Yalla Kafala today.",
  };
}

export default async function DonateRoute({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <DonatePage locale={locale} />;
}
