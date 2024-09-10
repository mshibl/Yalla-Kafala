import Box from "@mui/material/Box";
import React from "react";
import { useLocale } from "next-intl";
import KafalaSteps from "@/src/components/KafalaSteps";

const KafalaGuidePage = () => {
  const locale = useLocale();

  return (
    <Box sx={{ width: "100%" }}>
      <KafalaSteps locale={locale} />
    </Box>
  );
};

export default KafalaGuidePage;
