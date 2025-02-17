import ErrorBoundary from "@/src/components/ErrorBoundary";
import { useLocationData } from "@/src/utils/useLocationData";
import { Box, Typography } from "@mui/material";
import HeroImage from "@/src/components/aboutUs/WhoWeAre/heroImage";
import DonationForm from "@/src/components/DonationForm";
import EgyptDonationOptions from "@/src/components/EgyptDonationOptionsNew";
import React from "react";
import { Metadata } from "next";
import StripeDonationForm from "@/src/components/StripeDonationForm";
import DonationPageIntro from "@/src/components/DonationPageIntro";
import PhotosSlideShow from "@/src/components/PhotosSlideShow";
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
      {/* <HeroImage src="/images/donation_page_hero.png" /> */}
      {/* <DonationPageIntro locale={locale} /> */}
      <StripeDonationForm locale={locale} />
      {/* <EgyptDonationOptions locale={locale} /> */}
      {/* <Box>
        <PhotosSlideShow
          images={[
            "/images/476598188_1120799712754347_8529389894471728561_n.jpg",
            "/images/476642447_1120799336087718_5443804990686442859_n.jpg",
            "/images/476670895_1120799742754344_8442787079364097001_n.jpg",
            "/images/476895948_1120799396087712_3949764338558615426_n.jpg",
            "/images/476900129_1120799482754370_8369214657783236781_n.jpg",
            "/images/477023793_1120798942754424_1897357425914242591_n.jpg",
            "/images/477080899_1120799502754368_6018991150586689101_n.jpg",
            "/images/477341506_1120799566087695_4181902918588609679_n.jpg",
            "/images/477561230_1120799692754349_5058321338284411279_n.jpg",
          ]}
        />
      </Box> */}
    </ErrorBoundary>
  );
};

export default DonatePage;
