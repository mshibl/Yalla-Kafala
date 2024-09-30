"use client";
import useResponsiveBreakpoint from "@/src/utils/mui-utils";
import { useLocationData } from "@/src/utils/useLocationData";
import { Box, Typography, Button } from "@mui/material";
import React, { useState } from "react";
import EgyptDonationOptions from "../EgyptDonationOptions";
import ErrorBoundary from "../ErrorBoundary";
import ETapestryDonationForm from "../ETapestryDonationForm";
import PublicIcon from "@mui/icons-material/Public";

const OldDonationForm = ({ locale }: { locale: "ar" | "en" }) => {
  const isMD = useResponsiveBreakpoint("md");
  const { locationData, loading, error } = useLocationData();
  const [showEtapestry, setShowEtapestry] = useState(false);

  if (loading || error || !locationData) return <Box height="500px" />;

  const country = locationData?.country.toLowerCase();

  return (
    <ErrorBoundary locale={locale}>
      <Box mb="100px" px={{ xs: "16px", md: "100px" }}>
        <Box
          sx={{
            textAlign: { xs: "center", md: "center" },
            py: "40px",
          }}
        >
          <Typography variant="h4" color="primary.main" fontWeight={500}>
            {locale === "ar" ? "التبرع" : "Donation"}
          </Typography>
        </Box>
        {country === "eg" && !showEtapestry ? (
          <Box>
            <Box mb="20px" mx={isMD ? 0 : "22px"}>
              <Button
                variant="outlined"
                startIcon={
                  <Box
                    component="span"
                    display="flex"
                    alignItems="center"
                    ml={locale === "en" ? 0 : "12px"}
                  >
                    <PublicIcon />
                  </Box>
                }
                onClick={() => {
                  setShowEtapestry(true);
                }}
              >
                {locale === "en"
                  ? "Donate from outside of Egypt"
                  : "تبرع من خارج مصر"}
              </Button>
            </Box>
            <EgyptDonationOptions locale={locale} />
          </Box>
        ) : (
          <ETapestryDonationForm locale={locale} show={true} />
        )}
      </Box>
    </ErrorBoundary>
  );
};

export default OldDonationForm;
