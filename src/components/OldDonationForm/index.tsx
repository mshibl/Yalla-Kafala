"use client";

import useResponsiveBreakpoint from "@/src/utils/mui-utils";
import { useLocationData } from "@/src/utils/useLocationData";
import { Box, Typography, Button } from "@mui/material";
import React, { useState } from "react";
import EgyptDonationOptions from "../EgyptDonationOptions";
import ErrorBoundary from "../ErrorBoundary";
import PublicIcon from "@mui/icons-material/Public";
import StripeDonationForm from "../StripeDonationForm";
import Script from "next/script";

const OldDonationForm = ({ locale }: { locale: "ar" | "en" }) => {
  const isMD = useResponsiveBreakpoint("md");
  const { locationData, loading, error } = useLocationData();
  const [showUSPaymentForm, setShowUSPaymentForm] = useState(false);

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
        {country === "eg" && !showUSPaymentForm ? (
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
                  setShowUSPaymentForm(true);
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
          <div
            data-widget-src="https://secure.givelively.org/donate/yalla-kafala?ref=sd_widget"
            id="give-lively-widget"
            className="gl-branded-donation-widget"
          />

          //           <!-- Begin Give Lively Fundraising Widget -->
          // <script>gl=document.createElement('script');gl.src='https://secure.givelively.org/widgets/branded_donation/yalla-kafala.js';document.getElementsByTagName('head')[0].appendChild(gl);</script><div data-widget-src='https://secure.givelively.org/donate/yalla-kafala?ref=sd_widget' id="give-lively-widget" class="gl-branded-donation-widget"></div>
          // <!-- End Give Lively Fundraising Widget -->
          // <StripeDonationForm locale={locale} />
        )}
      </Box>
    </ErrorBoundary>
  );
};

export default OldDonationForm;
