"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { Box, Button, SxProps } from "@mui/material";
import Link from "next/link";
import AppTheme from "@/src/utils/AppTheme";

function DonateButton({ sx }: { sx?: SxProps<typeof AppTheme> }) {
  const locale = useLocale();

  return (
    <>
      <Box display="flex" alignItems="center">
        <Link href={`/${locale}/donate`}>
          <Button
            variant="contained"
            sx={{
              fontWeight: 600,
              backgroundColor: "#87226C",
              color: "#FFFFFF",
              fontSize: "14px",
              borderRadius: "24px",
              textTransform: "none",
              height: "100%",
              boxShadow: "none",
              ...sx,
            }}
          >
            {locale === "en" ? "Donate" : "تبرع الآن"}
          </Button>
        </Link>
      </Box>
    </>
  );
}
export default DonateButton;
