import ErrorBoundary from "@/src/components/ErrorBoundary";
import { useLocationData } from "@/src/utils/useLocationData";
import { Box, Typography } from "@mui/material";
import HeroImage from "@/src/components/aboutUs/WhoWeAre/heroImage";
import DonationForm from "@/src/components/DonationForm";
import EgyptDonationOptions from "@/src/components/EgyptDonationOptionsNew";
import React from "react";
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

  const url = `https://yallakafala.org/${locale}/donate`;
  const imageUrl = "https://yallakafala.org/images/donate.jpg";

  return {
    title,
    description,
    alternates: {
      languages: {
        en: "/en/donate",
        ar: "/ar/donate",
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
    viewport: {
      width: "device-width",
      initialScale: 1,
      maximumScale: 1,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Yalla Kafala",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: isArabic ? "تبرع الآن - يلا كفالة" : "Donate Now - Yalla Kafala",
        },
      ],
      locale: isArabic ? "ar_EG" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      creator: "@YallaKafala",
    },
    other: {
      "og:image:width": "1200",
      "og:image:height": "630",
      "og:site_name": "Yalla Kafala",
      "og:locale": isArabic ? "ar_EG" : "en_US",
      "og:locale:alternate": isArabic ? "en_US" : "ar_EG",
      "og:image:secure_url": imageUrl, // WhatsApp specific
      "fb:pages": "469771757195549", // Facebook Page ID
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

const DonatePage = ({
  params: { locale },
}: {
  params: { locale: "ar" | "en" };
}) => {
  return (
    <ErrorBoundary locale={locale}>
      <HeroImage src="/images/donation_page_hero.png" />
      <Box
        sx={{
          marginX: { xs: "10%", md: "25%" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "24px", md: "45px" },
            fontWeight: "bold",
            marginTop: { xs: "20px", md: "20px" },
            lineHeight: { xs: "32px", md: "61px" },
            color: "primary.main",
          }}
          variant="h2"
        >
          {locale === "en" ? "Transform Lives:" : "تغيير الحياة:"}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "24px", md: "45px" },
            fontWeight: "bold",
            marginBottom: { xs: "10px", md: "20px" },
            lineHeight: { xs: "32px", md: "61px" },
            color: "secondary.main",
          }}
          variant="h2"
        >
          {locale === "en" ? "Your Donations, Their Hope" : "تبرعاتكم، أملهم"}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "16px", md: "24px" },
            lineHeight: { xs: "25px", md: "32px" },
          }}
          variant="body1"
        >
          {locale === "en" ? (
            <>
              Every child deserves a chance to dream, to thrive, to be loved.
              Your donation has the power to make this come true. It&apos;s more
              than a gift; it&apos;s a lifeline. It&apos;s a chance to provide
              food, shelter, education, and hope. It&apos;s a chance to rewrite
              the story of a child&apos;s life.
            </>
          ) : (
            <>
              يلا كفالة هي منظمة غير حكومية رائدة تأسست في عام 2020، مكرسة
              لإعادة تشكيل رعاية الأطفال في مصر من خلال خيارات الرعاية البديلة
              والكفالة (الوصاية / التبني). <br /> <br /> إلهامًا من رحلة مؤسسنا
              رشا مكي الشخصية وكفالتها لابنها مصطفى، أطلقنا أول موقع ويب مخصص
              للكفالة في مصر وأسسنا يلا كفالة. <br /> <br /> بمقرات رئيسية في
              مصر وسان فرانسيسكو، نحن نسعى لتوفير بيئات منزلية مغذية للأيتام من
              خلال بدائل الرعاية الابتكارية وخدمات الدعم والدعوة.
            </>
          )}
        </Typography>
        <DonationForm locale={locale} />
      </Box>
      <EgyptDonationOptions locale={locale} />
    </ErrorBoundary>
  );
};

export default DonatePage;
