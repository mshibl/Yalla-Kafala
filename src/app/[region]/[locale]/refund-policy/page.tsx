import type { Metadata } from "next";
import type { Locale } from "@/components/Providers/LocaleProvider";
import RefundPolicy from "@/components/RefundPolicy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === "ar";

  return {
    title: isArabic
      ? "سياسة الاسترداد | يلا كفالة"
      : "Refund Policy | Yalla Kafala",
    description: isArabic
      ? "شروط وأحكام والمدد الزمنية لاسترداد المدفوعات الإلكترونية لدى يلا كفالة."
      : "Terms, conditions and processing timelines for refunds of online payments to Yalla Kafala.",
  };
}

export default async function RefundPolicyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <RefundPolicy locale={locale} />;
}
