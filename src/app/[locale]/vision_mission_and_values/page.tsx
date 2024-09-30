import MissionVisionAndValues from "@/src/components/aboutUs/vision";
import { Metadata } from "next";
import React from "react";
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isArabic = locale === "ar";

  const title = isArabic
    ? "رؤيتنا، رسالتنا، وقيمنا"
    : "Vision, Mission, and Values";
  const description = isArabic
    ? "في يلا كفالة، نسعى لبناء أفضل مستقبل ممكن للأيتام والأسر الكافلة. رسالتنا هي تطوير جودة الرعاية المقدمة للأيتام من خلال التعليم، الدعم، وتطوير الموارد. قيمنا تشمل الشفافية، الرحمة، والمسؤولية المجتمعية."
    : "At Yalla Kafala, we aim to build the best possible future for orphans and kafala families. Our mission is to enhance the quality of care through education, support, and resource development. Our values include transparency, compassion, and social responsibility.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://yallakafala.org/vision-mission-values",
      siteName: "Yalla Kafala",
      images: [
        {
          url: "https://yallakafala.org/images/vision-mission.jpg",
          width: 1200,
          height: 630,
        },
      ],
      locale,
      type: "website",
    },
  };
}

const VisionMissionAndValuesPage = ({
  params: { locale },
}: {
  params: { locale: string };
}) => {
  return <MissionVisionAndValues locale={locale} />;
};

export default VisionMissionAndValuesPage;
