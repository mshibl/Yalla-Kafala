"use client";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

import useResponsiveBreakpoint from "@/src/utils/mui-utils";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import { Box, Button, Fade, Dialog } from "@mui/material";
import React, { useState } from "react";
import DonationPageIntro from "../DonationPageIntro";
import Image from "next/image";

const formatAmount = (amount: number | null) => {
  if (amount === null) return "";
  return amount.toLocaleString("en-US");
};

const StripeDonationForm = ({ locale }: { locale: "ar" | "en" }) => {
  const [donationFrequency, setDonationFrequency] = useState<
    "once" | "monthly"
  >("once");
  const [donationAmount, setDonationAmount] = useState<number>(25);
  const [showCheckout, setShowCheckout] = useState(false);

  const predefinedAmounts = [10, 25, 50, 100, 200, 400, 800, 1000];

  const fetchClientSecret = async () => {
    const response = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        frequency: donationFrequency,
        amount: donationAmount,
      }),
    });
    const data = await response.json();
    return data.clientSecret;
  };

  useEffect(() => {
    if (showCheckout) {
      window.history.pushState(null, "", "");

      const handlePopState = () => {
        setShowCheckout(false);
      };

      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [showCheckout]);

  const isMD = useResponsiveBreakpoint("md");

  return (
    <Box>
      <Dialog
        open={showCheckout}
        keepMounted={false}
        maxWidth="md"
        fullScreen={!isMD}
        onClose={() => {
          window.history.back();
        }}
      >
        <Box sx={{ p: 2, mb: 50, minWidth: "412px", direction: "ltr" }}>
          <Button
            onClick={() => {
              window.history.back();
            }}
            sx={{ mb: 2, ml: "16px" }}
            size="large"
            startIcon={<ArrowBackIosIcon />}
          >
            {locale === "ar" ? "العودة" : "Back"}
          </Button>
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ fetchClientSecret }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </Box>
      </Dialog>

      <DonationPageIntro locale={locale} />
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            mt: "20px",
            mb: "20px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              border: "1px solid #2194BC",
              borderRadius: "30px",
              overflow: "hidden",
            }}
          >
            <Button
              sx={{
                fontSize: "18px",
                borderRadius: "30px",
                px: 20,
                backgroundColor:
                  donationFrequency === "once"
                    ? "secondary.main"
                    : "transparent",
                color: donationFrequency === "once" ? "white" : "primary.main",
                "&:hover": {
                  backgroundColor:
                    donationFrequency === "once"
                      ? "secondary.main"
                      : "transparent",
                },
              }}
              onClick={() => setDonationFrequency("once")}
            >
              {locale === "ar" ? "تبرع مرة واحدة" : "Give once"}
            </Button>
            <Button
              sx={{
                fontSize: "18px",
                borderRadius: "30px",
                px: 20,
                backgroundColor:
                  donationFrequency === "monthly"
                    ? "secondary.main"
                    : "transparent",
                color:
                  donationFrequency === "monthly" ? "white" : "primary.main",
                "&:hover": {
                  backgroundColor:
                    donationFrequency === "monthly"
                      ? "secondary.main"
                      : "transparent",
                },
              }}
              onClick={() => setDonationFrequency("monthly")}
              startIcon={
                <EventRepeatIcon
                  sx={{ marginLeft: locale === "ar" ? "10px" : "0px" }}
                />
              }
            >
              {locale === "ar" ? "تبرع شهري" : "Monthly"}
            </Button>
          </Box>
        </Box>

        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 4,
              mb: 8,
            }}
          >
            {predefinedAmounts.slice(0, 4).map((amount) => (
              <Button
                key={amount}
                variant={donationAmount === amount ? "contained" : "outlined"}
                onClick={() => setDonationAmount(amount)}
                style={{ width: "80px" }}
                color="secondary"
              >
                <Box
                  fontSize="18px"
                  color={donationAmount === amount ? "white" : "primary.main"}
                >
                  ${amount.toLocaleString("en-US")}
                </Box>
              </Button>
            ))}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 4,
              mb: 8,
            }}
          >
            {predefinedAmounts.slice(4).map((amount) => (
              <Button
                key={amount}
                variant={donationAmount === amount ? "contained" : "outlined"}
                onClick={() => setDonationAmount(amount)}
                style={{ width: "80px" }}
                color="secondary"
              >
                <Box
                  fontSize="18px"
                  color={donationAmount === amount ? "white" : "primary.main"}
                >
                  ${amount.toLocaleString("en-US")}
                </Box>
              </Button>
            ))}
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", my: "20px" }}>
        <Fade in={!!donationAmount} timeout={500}>
          <Button
            variant="contained"
            size="large"
            onClick={() => setShowCheckout(true)}
            sx={{
              minWidth: "200px",
              fontSize: "18px",
              py: 1.5,
            }}
          >
            {locale === "ar" ? "تبرع" : "Donate"}
          </Button>
        </Fade>
      </Box>
    </Box>
  );
};

export default StripeDonationForm;
