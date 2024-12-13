import * as React from "react";
import Box from "@mui/material/Box";
import Image from "next/image";
import { useLocale } from "next-intl";
import { SxProps } from "@mui/material";

function Logo({ noText }: { noText?: boolean }) {
  const locale = useLocale();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        lineHeight: "18px",
      }}
    >
      <Box sx={{ position: "relative", width: 50, height: 50 }}>
        <Image
          priority={true}
          src="/images/yk_logo.svg"
          alt={locale === "en" ? "Yalla Kafala Logo" : "شعار يلا كفالة"}
          fill={true}
          style={{ objectFit: "contain" }}
          sizes="100% 100%"
        />
      </Box>
      {!noText && (
        <Box
          sx={{
            ml: locale === "en" ? 4 : 0,
            mr: locale === "en" ? 0 : 4,
            fontWeight: 500,
            color: "#000000",
            textDecoration: "none",
            flexGrow: 1,
            fontSize: "15px",
          }}
        >
          <Box>Yalla Kafala</Box>
          <Box>اكفل طفل في بيتك</Box>
        </Box>
      )}
    </Box>
  );
}
export default Logo;
