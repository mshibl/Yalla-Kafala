"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { Box, Button } from "@mui/material";
import Link from "next/link";

function ApplyForKafalaButton() {
  const locale = useLocale();

  return (
    <>
      <Box display="flex" alignItems="center">
        <Link
          target="blank"
          href={`https://www.moss.gov.eg/Sites/MOSA/ar-eg/Pages/AF-Request.aspx`}
        >
          <Button
            variant="outlined"
            sx={{
              fontWeight: 600,
              color: "#87226C",
              fontSize: "14px",
              borderRadius: "24px",
              textTransform: "none",
              boxShadow: "none",
            }}
          >
            {locale === "en" ? "Apply For Kafala" : "تقديم طلب الكفالة"}
          </Button>
        </Link>
      </Box>
    </>
  );
}
export default ApplyForKafalaButton;
