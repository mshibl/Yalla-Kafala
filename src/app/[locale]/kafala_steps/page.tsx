import Box from "@mui/material/Box";
import React from "react";
import { useLocale } from "next-intl";
import KafalaSteps from "@/src/components/KafalaSteps";
import { Metadata } from "next";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isArabic = locale === "ar";

  const title = isArabic ? "خطوات الكفالة" : "Kafala Steps";
  const description = isArabic
    ? "تعرف على خطوات الكفالة في مصر، من تقديم الطلب إلى استلام الطفل. يلا كفالة تقدم دليلاً شاملاً لتسهيل عملية الكفالة للأسرة المصرية."
    : "Learn about the steps of kafala in Egypt, from applying to welcoming a child into your family. Yalla Kafala offers a comprehensive guide to streamline the kafala process for Egyptian families.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://yallakafala.org/kafala-steps",
      siteName: "Yalla Kafala",
      images: [
        {
          url: "https://yallakafala.org/images/kafala-steps.jpg",
          width: 1200,
          height: 630,
        },
      ],
      locale,
      type: "website",
    },
  };
}

const KafalaGuidePage = () => {
  const locale = useLocale();

  return (
    <Box sx={{ width: "100%" }}>
      <KafalaSteps locale={locale} />
    </Box>
  );
};

export default KafalaGuidePage;
