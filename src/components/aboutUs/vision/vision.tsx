import { Box, Typography } from "@mui/material";
import React from "react";

const Vision = ({ locale }: { locale: string }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          paddingX: { xs: "40px", md: "180px" },
          mb: 10,
        }}
      >
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "24px", md: "50px" },
            marginBottom: { xs: "10px", md: "35px" },
            marginTop: { xs: "28px", md: "100px" },
            lineHeight: "32px",
            color: "primary.main",
          }}
          variant="h2"
        >
          {locale === "en" ? "Vision" : "رؤيتنا"}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "16px", md: "24px" },
            lineHeight: { xs: "25px", md: "32px" },
          }}
          variant="body1"
        >
          {locale === "en"
            ? "Building the best possible future for orphans and kafala families."
            : "بناء أفضل مستقبل ممكن للأطفال فاقدي الرعاية الأسرية والأسر الكافلة."}
        </Typography>
      </Box>
      <Box
        component={"img"}
        sx={{
          paddingX: { xs: "24px", md: "24px" },
          display: "flex",
          justifyContent: "center",
          marginBottom: 10,
          width: "100%",
        }}
        alt="Vision"
        src="/images/mission_vision_image.webp"
      />
    </Box>
  );
};

export default Vision;
