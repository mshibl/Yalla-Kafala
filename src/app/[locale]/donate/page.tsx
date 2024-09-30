import OldDonationForm from "@/src/components/OldDonationForm";
import { Metadata } from "next";
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isArabic = locale === "ar";

  const title = isArabic ? "تبرع الآن" : "Donate Now";
  const description = isArabic
    ? "ساعد في تغيير حياة الأيتام في مصر من خلال دعم يلا كفالة. تبرعك يمكن أن يوفر لهم الرعاية، التعليم، والدعم الذي يحتاجونه."
    : "Help transform the lives of orphans in Egypt by supporting Yalla Kafala. Your donation can provide them with care, education, and the support they need.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://yallakafala.org/donate",
      siteName: "Yalla Kafala",
      images: [
        {
          url: "https://yallakafala.org/images/donate.jpg",
          width: 1200,
          height: 630,
        },
      ],
      locale,
      type: "website",
    },
  };
}

const DonatePage = ({
  params: { locale },
}: {
  params: { locale: "ar" | "en" };
}) => {
  return <OldDonationForm locale={locale} />;
};

export default DonatePage;
