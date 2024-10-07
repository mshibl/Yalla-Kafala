import React from "react";
import { Box, Typography } from "@mui/material";
import IntroParagraphs from "./introParagraphs";
import FirstHadith from "./firstHadith";
import SecondHadith from "./secondHadith";
import Footnotes from "./footnotes";
import References from "./references";
import Banner from "./banner";
import { Metadata } from "next";
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isArabic = locale === "ar";

  const title = isArabic ? "ما هي الكفالة؟" : "What is Kafala?";
  const description = isArabic
    ? "الكفالة هي نظام رعاية إسلامي للأطفال، مشابه للتبني ولكنه لا يشمل تغيير الاسم أو حقوق الوراثة. يلا كفالة تهدف إلى تسهيل وتوضيح هذه العملية للأسرة المصرية، وتقديم الدعم والمشورة القانونية."
    : "Kafala is an Islamic guardianship system, similar to adoption but without changing the child's name or inheritance rights. Yalla Kafala aims to streamline and clarify this process for Egyptian families, offering legal support and guidance.";

  return {
    title,
    description,
    alternates: {
      languages: {
        en: "/en/what-is-kafala",
        ar: "/ar/what-is-kafala",
      },
    },
    openGraph: {
      title,
      description,
      url: "https://yallakafala.org/what-is-kafala",
      siteName: "Yalla Kafala",
      images: [
        {
          url: "https://yallakafala.org/images/kafala-process.jpg",
          width: 1200,
          height: 630,
          alt: isArabic ? "عملية الكفالة" : "Kafala Process",
        },
      ],
      locale: isArabic ? "ar_EG" : "en_US",
      type: "article",
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
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://yallakafala.org/images/kafala-process.jpg"],
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
        "https://yallakafala.org/images/kafala-process.jpg",
      "og:locale": isArabic ? "ar_EG" : "en_US",
      "og:locale:alternate": isArabic ? "en_US" : "ar_EG",
    },
  };
}

const WhatIsKafalaPage = () => {
  return (
    <>
      <Banner />
      <Box
        sx={{
          maxWidth: "940px",
          margin: "auto",
          paddingY: { xs: "40px", md: "60px" },
          paddingX: "20px",
        }}
      >
        <IntroParagraphs />
        <FirstHadith />
        <SecondHadith />
        <Footnotes />
        <References />
      </Box>
    </>
  );
};

export default WhatIsKafalaPage;
