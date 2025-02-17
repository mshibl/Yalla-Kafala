"use client";

import { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

import useResponsiveBreakpoint from "@/src/utils/mui-utils";
import { useLocationData } from "@/src/utils/useLocationData";
import { Box, Typography, Button } from "@mui/material";
import React, { useState } from "react";
import EgyptDonationOptions from "../EgyptDonationOptions";
import ErrorBoundary from "../ErrorBoundary";
import ETapestryDonationForm from "../ETapestryDonationForm";
import PublicIcon from "@mui/icons-material/Public";
import PhotosSlideShow from "../PhotosSlideShow";

const OldDonationForm = ({ locale }: { locale: "ar" | "en" }) => {
  const [donationFrequency, setDonationFrequency] = useState<
    "once" | "monthly"
  >("once");
  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return fetch("/api/checkout_sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        frequency: donationFrequency,
      }),
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, [donationFrequency]);

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

          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Box
              sx={{
                display: "flex",
                border: "1px solid",
                borderColor: "primary.main",
                borderRadius: "50px",
                overflow: "hidden",
              }}
            >
              <Button
                sx={{
                  borderRadius: "50px",
                  px: 4,
                  backgroundColor:
                    donationFrequency === "once"
                      ? "primary.main"
                      : "transparent",
                  color:
                    donationFrequency === "once" ? "white" : "primary.main",
                  "&:hover": {
                    backgroundColor:
                      donationFrequency === "once"
                        ? "primary.dark"
                        : "transparent",
                  },
                }}
                onClick={() => setDonationFrequency("once")}
              >
                {locale === "ar" ? "تبرع مرة واحدة" : "Give once"}
              </Button>
              <Button
                sx={{
                  borderRadius: "50px",
                  px: 4,
                  backgroundColor:
                    donationFrequency === "monthly"
                      ? "primary.main"
                      : "transparent",
                  color:
                    donationFrequency === "monthly" ? "white" : "primary.main",
                  "&:hover": {
                    backgroundColor:
                      donationFrequency === "monthly"
                        ? "primary.dark"
                        : "transparent",
                  },
                }}
                onClick={() => setDonationFrequency("monthly")}
              >
                {locale === "ar" ? "تبرع شهري" : "Monthly"}
              </Button>
            </Box>
          </Box>
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
          // <ETapestryDonationForm locale={locale} show={true} />
          <Box>
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ fetchClientSecret }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
            <Box>
              <PhotosSlideShow
                images={[
                  "/images/476598188_1120799712754347_8529389894471728561_n.jpg",
                  "/images/476642447_1120799336087718_5443804990686442859_n.jpg",
                  "/images/476670895_1120799742754344_8442787079364097001_n.jpg",
                  "/images/476895948_1120799396087712_3949764338558615426_n.jpg",
                  "/images/476900129_1120799482754370_8369214657783236781_n.jpg",
                  "/images/477023793_1120798942754424_1897357425914242591_n.jpg",
                  "/images/477080899_1120799502754368_6018991150586689101_n.jpg",
                  "/images/477341506_1120799566087695_4181902918588609679_n.jpg",
                  "/images/477561230_1120799692754349_5058321338284411279_n.jpg",
                ]}
              />
            </Box>
          </Box>
        )}
      </Box>
    </ErrorBoundary>
  );
};

export default OldDonationForm;
