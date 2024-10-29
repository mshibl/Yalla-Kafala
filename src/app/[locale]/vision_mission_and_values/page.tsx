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
    alternates: {
      languages: {
        en: `/en/vision-mission-values`,
        ar: `/ar/vision-mission-values`,
      },
    },
    keywords: isArabic
      ? [
          "كفالة",
          "تبني",
          "أيتام",
          "مصر",
          "رعاية الأطفال",
          "حماية الطفل",
          "منظمة غير حكومية",
          "دار أيتام",
          "رعاية بديلة",
          "حقوق الطفل",
          "دعم الأطفال",
          "الأسر البديلة",
          "الرعاية الاجتماعية",
          "تمكين الأطفال",
          "العمل الخيري",
          "التطوع في مصر",
          "مساعدة الأطفال المحتاجين",
          "برامج رعاية الأيتام",
          "الأسر الكافلة",
          "حماية الأطفال المعرضين للخطر",
          "التنمية الاجتماعية",
          "الدعم النفسي للأطفال",
          "الرعاية الصحية للأيتام",
          "التعليم للأطفال المحرومين",
          "مؤسسة خيرية للأطفال",
          "يلا كفالة",
          "خدمات الدعم للأيتام",
          "تحسين حياة الأطفال",
          "الحماية الاجتماعية للأطفال",
          "مبادرات رعاية الطفل",
        ]
      : [
          "kafala",
          "adoption",
          "orphans",
          "Egypt",
          "child welfare",
          "child protection",
          "NGO",
          "orphanage",
          "alternative care",
          "children's rights",
          "child support",
          "foster families",
          "social care",
          "child empowerment",
          "charity work",
          "volunteering in Egypt",
          "helping children in need",
          "orphan care programs",
          "sponsoring families",
          "protecting at-risk children",
          "social development",
          "psychological support for children",
          "healthcare for orphans",
          "education for underprivileged children",
          "children's charity foundation",
          "Yalla Kafala",
          "support services for orphans",
          "improving children's lives",
          "social protection for children",
          "child care initiatives",
          "Egyptian adoption",
          "guardianship in Egypt",
          "child advocacy",
          "family-based care",
          "child development programs",
          "community outreach",
          "child poverty alleviation",
          "child rights advocacy",
          "sustainable child care",
          "international adoption in Egypt",
        ],
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
          alt: title,
        },
      ],
      locale: isArabic ? "ar_EG" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://yallakafala.org/images/vision-mission.jpg"],
      creator: "@YallaKafala",
    },
    robots: {
      index: true,
      follow: true,
    },
    other: {
      "og:image:width": "1200",
      "og:image:height": "630",
      "og:image:secure_url":
        "https://yallakafala.org/images/vision-mission.jpg",
      "og:locale": isArabic ? "ar_EG" : "en_US",
      "og:locale:alternate": isArabic ? "en_US" : "ar_EG",
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
