import React from "react";
import { Box, Container } from "@mui/material";
import TextSection from "./textSection";
import ListSection from "./listSection";
import { useTranslations } from "next-intl";
import { Metadata } from "next";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isArabic = locale === "ar";

  const title = isArabic ? "من نحن" : "About Us";
  const description = isArabic
    ? "يلا كفالة هي منظمة غير حكومية تعمل على تغيير رعاية الأطفال في مصر من خلال الكفالة. مع مكاتب في مصر وسان فرانسيسكو، نقدم بدائل رعاية مبتكرة، وخدمات دعم، ودعوة لحقوق الأيتام."
    : "Yalla Kafala is an NGO transforming child welfare in Egypt through Kafala (guardianship/adoption). With offices in Egypt and San Francisco, we offer innovative care alternatives, support services, and advocacy for orphans.";

  const url = `https://yallakafala.org/${locale}`;
  const imageUrl = "https://yallakafala.org/images/yk-team-1.jpg";

  return {
    title,
    description,
    alternates: {
      languages: {
        en: "/en",
        ar: "/ar",
      },
    },
    keywords: isArabic
      ? ["كفالة", "رعاية الأطفال", "أيتام", "مصر", "منظمة غير حكومية"]
      : ["Kafala", "child welfare", "orphans", "Egypt", "NGO"],
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

const AboutUsPage: React.FC = () => {
  const t = useTranslations("AboutUs");

  const achievementsKeys = ["one", "two", "three"];
  const workshopsKeys = ["one", "two", "three"];
  const activitiesKeys = ["one", "two", "three", "four", "five", "six"];
  const rolesKeys = ["one", "two", "three", "four", "five", "six", "seven"];

  let achievements: string[] = [];
  let workshops: string[] = [];
  let activities: string[] = [];
  let roles: string[] = [];

  achievementsKeys.forEach((key) => {
    achievements.push(t(`achievements.achievementsList.${key}`));
  });
  workshopsKeys.forEach((key) => {
    workshops.push(t(`workshops.workshopsList.${key}`));
  });
  activitiesKeys.forEach((key) => {
    activities.push(t(`activities.activitiesList.${key}`));
  });
  rolesKeys.forEach((key) => {
    roles.push(t(`roles.rolesList.${key}`));
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          maxWidth: "1080px",
          margin: "auto",
          paddingY: { xs: "40px", md: "60px" },
          paddingX: "20px",
        }}
      >
        <TextSection title={t("vision.title")} content={t("vision.content")} />
        <TextSection
          title={t("message.title")}
          content={t("message.content")}
        />
        <ListSection title={t(`achievements.title`)} content={achievements} />
        <ListSection title={t(`workshops.title`)} content={workshops} />
        <ListSection title={t(`activities.title`)} content={activities} />
        <ListSection title={t(`roles.title`)} content={roles} />
        <TextSection title={t("rasha.title")} content={t("rasha.content")} />
      </Box>
    </Container>
  );
};

export default AboutUsPage;
