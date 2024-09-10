import { Box } from "@mui/material";
import React from "react";

const KafalaStepsQuote = ({ locale }: { locale: string }) => {
  const kafalaDefinition =
    locale === "en"
      ? "Kafala is the formal process of legal guardianship, providing care and support to orphaned children. It involves a series of steps aimed at ensuring the well-being and placement of children with caring families."
      : "الكفالة هي عملية رسمية لتولي الوصاية القانونية، تتضمن تقديم الرعاية والدعم للأطفال اليتامى. وتشمل سلسلة من الخطوات التي تهدف إلى ضمان رفاهية الأطفال ووضعهم في أسر كريمة.";
  return (
    <Box
      sx={{
        width: "100%",
        borderLeft: locale === "en" ? { lg: "8px solid #2194BC" } : "",
        borderRight: locale === "ar" ? { lg: "8px solid #2194BC" } : "",
        marginY: { xs: "25px", lg: "50px" },
        paddingX: { xs: "32px", lg: "50px" },
      }}
    >
      {kafalaDefinition}
    </Box>
  );
};

export default KafalaStepsQuote;
