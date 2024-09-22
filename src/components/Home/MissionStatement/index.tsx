import { Box, Typography } from "@mui/material";

const MissionStatement = ({ locale }: { locale: "ar" | "en" }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      py="20px"
    >
      <Typography
        variant="h5"
        textAlign="center"
        padding="20px"
        fontWeight={600}
      >
        {locale === "ar" ? "رسالتنا" : "Our Mission"}
      </Typography>
      <Typography fontSize="1.4rem" textAlign="center" padding="20px" pt={0}>
        {locale === "ar"
          ? "تقديم الرعاية الجيدة للأيتام من خلال الدعوة والتثقيف و تطوير الموارد للعائلات الكافلة"
          : "Advance quality care for orphans by advocating, educating, and developing resources for Kafala families"}
      </Typography>
    </Box>
  );
};

export default MissionStatement;
