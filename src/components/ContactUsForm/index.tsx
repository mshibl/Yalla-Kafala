"use client";
import { useLocationData } from "@/src/utils/useLocationData";
import { Box, Typography } from "@mui/material";
import React from "react";
import ErrorBoundary from "../ErrorBoundary";
import ETapestryContactUsForm from "../ETapestryContactUsForm";

const ContactUsForm = ({ locale }: { locale: "ar" | "en" }) => {
  const { locationData, loading, error } = useLocationData();
  if (loading || error || !locationData) return <Box height="500px" />;

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
            {locale === "ar" ? "اتصل بنا" : "Contact Us"}
          </Typography>
        </Box>
        <ETapestryContactUsForm locale={locale} show={true} />
      </Box>
    </ErrorBoundary>
  );
};

export default ContactUsForm;
