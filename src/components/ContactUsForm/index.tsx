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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: "40px",
          }}
        >
          <Typography variant="h4" color="primary.main" fontWeight={500}>
            {locale === "ar" ? "اتصل بنا" : "Contact Us"}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: "600px", mt: "40px" }}
          >
            {locale === "ar"
              ? "  تواصل معنا لأي استفسارات أو معلومات حول يلا كفالة عبر 'Info@yallakafala.org'. نحن هنا لمساعدتك!"
              : "Reach out to us for any inquiries or information about Yalla Kafala through this email 'Info@yallakafala.org' . We are here to help!"}
          </Typography>
        
        </Box>
        {/* <ETapestryContactUsForm locale={locale} show={true} /> */}
      </Box>
    </ErrorBoundary>
  );
};

export default ContactUsForm;
