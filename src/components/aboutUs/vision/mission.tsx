import { Box, Typography } from "@mui/material";
import React from "react";

const Mission = ({ locale }: { locale: string }) => {
  return (
    <Box
      sx={{
        paddingX: { xs: "40px", md: "180px" },
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: "24px", md: "50px" },
          fontWeight: "bold",
          marginBottom: { xs: "10px", md: "35px" },
          marginTop: { xs: "28px", md: "100px" },
          lineHeight: "32px",
          color: "primary.main",
        }}
        variant="h2"
      >
        {locale === "en" ? "Mission" : "مهمتنا"}
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
            Advancing for equal right, educating for awareness, and delivering
            the highest standard of care for every child and kafala family
          </>
        ) : (
          <>
            نتقدم نحو المساواة في الحقوق، ونُثقف لزيادة الوعي، ونُقدّم أعلى
            معايير الرعاية لكل طفل ولكل أسرة كفالة.
          </>
        )}
      </Typography>
    </Box>
  );
};

export default Mission;
