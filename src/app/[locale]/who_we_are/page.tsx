import WhoWeAre from "@/src/components/aboutUs/WhoWeAre";
import { Metadata } from "next";
import React from "react";
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isArabic = locale === "ar";

  const title = isArabic ? "من نحن" : "Who We Are";
  const description = isArabic
    ? "يلا كفالة هي منظمة غير حكومية تعمل على تغيير رعاية الأطفال في مصر من خلال الكفالة. مع مكاتب في مصر وسان فرانسيسكو، نقدم بدائل رعاية مبتكرة، وخدمات دعم، ودعوة لحقوق الأيتام."
    : "Yalla Kafala is an NGO transforming child welfare in Egypt through Kafala (guardianship/adoption). With offices in Egypt and San Francisco, we offer innovative care alternatives, support services, and advocacy for orphans.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://yallakafala.org",
      siteName: "Yalla Kafala",
      images: [
        {
          url: "https://yallakafala.org/images/yk-team-1.jpg",
          width: 1200,
          height: 630,
        },
      ],
      locale,
      type: "website",
    },
  };
}

const WhoWeArePage = ({
  params: { locale },
}: {
  params: { locale: string };
}) => {
  return <WhoWeAre locale={locale} />;
};

export default WhoWeArePage;
