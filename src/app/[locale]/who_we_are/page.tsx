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
    alternates: {
      languages: {
        en: "/en/who-we-are",
        ar: "/ar/who-we-are",
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
      url: "https://yallakafala.org/who-we-are",
      siteName: "Yalla Kafala",
      images: [
        {
          url: "https://yallakafala.org/images/yk-team-1.jpg",
          width: 1200,
          height: 630,
          alt: isArabic ? "فريق يلا كفالة" : "Yalla Kafala Team",
        },
      ],
      locale: isArabic ? "ar_EG" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://yallakafala.org/images/yk-team-1.jpg"],
      creator: "@YallaKafala",
    },
    robots: {
      index: true,
      follow: true,
    },
    other: {
      "og:image:width": "1200",
      "og:image:height": "630",
      "og:image:secure_url": "https://yallakafala.org/images/yk-team-1.jpg",
      "og:locale": isArabic ? "ar_EG" : "en_US",
      "og:locale:alternate": isArabic ? "en_US" : "ar_EG",
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
