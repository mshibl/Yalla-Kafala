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
