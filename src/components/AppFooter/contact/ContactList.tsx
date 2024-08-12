"use client";

import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import EmailUs from "./EmailUs";
import Address from "./Address";
import { useLocale } from "next-intl";
import Link from "next/link";
import { useLocationData } from "@/src/utils/useLocationData";
import Volunteer from "./Volunteer";

const ContactList = () => {
  const locale = useLocale();
  const { locationData, loading, error } = useLocationData();

  if (loading) return null;
  if (!locationData) return null;

  const egyptAddress = (
    <Typography variant="body2">
      {locale === "ar"
        ? "٢٤ شارع اللاسلكي الصغير، المعادي الجديدة، القاهرة، مصر"
        : "24 Al Lasilki Al Sagheer Street, New Maadi, Cairo, Egypt."}
      <br />
      <Link
        style={{ textDecoration: "underline" }}
        href="https://maps.app.goo.gl/d24Rt7cnGfYYkSyq8?g_st=ic"
      >
        {locale === "ar" ? "العنوان على الخريطة" : "Address on Map"}
      </Link>
    </Typography>
  );

  const usAddress = (
    <Typography
      variant="body2"
      sx={{ direction: "ltr", textAlign: locale === "ar" ? "right" : "left" }}
    >
      15 Onondaga Ave
      <br />
      San Francisco, California
      <br />
      T: (415) 246-5007
    </Typography>
  );

  const country = locationData.country.toLowerCase();

  let EgyptAddressTitle = locale === "ar" ? "العنوان" : "Address";
  EgyptAddressTitle +=
    country !== "eg" ? (locale === "ar" ? " فى مصر" : " in Egypt") : "";

  const USAddressTitle =
    locale === "ar" ? "العنوان فى امريكا" : "Address in USA";

  return (
    <Grid
      sx={{ mb: { xs: 30, md: 0 } }}
      container
      direction={"column"}
      item
      xs={12}
      md={4}
    >
      <Grid item sx={{ pb: 6 }}>
        <Typography variant="h6" fontWeight={700}>
          {locale === "ar" ? "تواصل معنا" : "Contact Us"}
        </Typography>
      </Grid>
      <Box sx={{ pb: "20px" }}>
        <EmailUs locale={locale} />
        <Volunteer locale={locale} />
      </Box>
      <Address title={EgyptAddressTitle} content={egyptAddress} />
      {country !== "eg" && (
        <Address content={usAddress} title={USAddressTitle} />
      )}
    </Grid>
  );
};

export default ContactList;
