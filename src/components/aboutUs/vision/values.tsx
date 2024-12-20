import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { ValueCard } from "./valueCard";

const Values = ({ locale }: { locale: string }) => {
  return (
    <Box
      sx={{
        marginTop: "50px",
        paddingX: { xs: "32px", md: "58px" },
        paddingY: "58px",
        backgroundColor: "secondary.main",
      }}
    >
      <Typography
        sx={{
          fontWeight: "bold",
          color: "#FFFFFF",
          fontSize: { xs: "24px", md: "50px" },
          marginBottom: { xs: "16px", md: "48px" },
        }}
        variant="h2"
      >
        {locale === "en" ? "Our Values" : "قيمنا"}
      </Typography>
      <Grid spacing={7} container>
        <ValueCard
          title={locale === "en" ? "Inclusion" : "الجميع سواء"}
          description={
            locale === "en"
              ? "We condemn all forms of discrimination. Everyone deserves equal access to opportunities and resources."
              : `
        ندين كافة أشكال التمييز. يحق للجميع الحصول على فرص وموارد متساوية.
`
          }
          image="/images/inclusion.svg"
        />
        <ValueCard
          title={locale === "en" ? "Community" : "الأسرة أولًا"}
          description={
            locale === "en"
              ? "Family comes first. We empower and provide high-quality services to our teams, partners, orphans, and kafala families."
              : ` نضع الأسرة على قمة أولوياتنا. نُمكن فرقنا وشركائنا والأطفال فاقدي الرعاية الأسرية والأسر الكافلة ونقدم خدمات عالية الجودة لهم. `
          }
          image="/images/community.svg"
        />
        <ValueCard
          title={locale === "en" ? "Collaboration" : "التعاون"}
          description={
            locale === "en"
              ? "Everyone adds value to our journey. We act as liaisons between our staff and stakeholders to ensure a better future for our beneficiaries."
              : ` كل فرد يضيف قيمة لرحلتنا. نعمل كحلقة وصل بين موظفينا وأصحاب المصلحة لضمان مستقبل أفضل لمستفيدينا.`
          }
          image="/images/collaboration.svg"
        />
        <ValueCard
          title={locale === "en" ? "Compassion" : "التعاطف"}
          description={
            locale === "en"
              ? "We reach our beneficiaries with empathy, kindness, understanding, and respect, providing solutions for their challenges."
              : ` نتواصل مع مستفيدينا من خلال التعاطف واللطف والتفاهم والاحترام، ونقدم حلولًا لتحدياتهم.`
          }
          image="/images/compassion.svg"
        />
      </Grid>
    </Box>
  );
};

export default Values;
