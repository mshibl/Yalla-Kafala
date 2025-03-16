"use client";

import React, { useState } from "react";
import SubmitDonationButton from "./SubmitDonationButton";
import { Box } from "@mui/material";
import DonationDialog from "../../../DonationDialog";

// TODO: Deprecate this component
const HeroDonateButton = ({ locale }: { locale: "ar" | "en" }) => {
  const [donationFormOpen, setDonationFormOpen] = useState(false);

  const openDonationForm = () => {
    setDonationFormOpen(true);
  };

  return (
    <Box
      width="100%"
      flexDirection="column"
      display={{ xs: "none", md: "flex" }}
    >
      {/* <SubmitDonationButton handleSubmit={openDonationForm} locale={locale} /> */}
      <DonationDialog
        locale={locale}
        donationFormOpen={donationFormOpen}
        setDonationFormOpen={setDonationFormOpen}
      />
    </Box>
  );
};

export default HeroDonateButton;
