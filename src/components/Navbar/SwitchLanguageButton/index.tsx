import * as React from "react";
import Box from "@mui/material/Box";
import Image from "next/image";
import { useLocale } from "next-intl";
import { Button, IconButton, SxProps, Tooltip } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import LanguageIcon from "@mui/icons-material/Language";

function SwitchLanguageButton() {
  const locale = useLocale();
  const pathname = usePathname() || "/";
  const router = useRouter();

  const handleSwitchLanguage = () => {
    const newLocale = locale === "en" ? "ar" : "en";
    const updatedPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(updatedPathname);
  };

  return (
    <Box>
      <Tooltip
        title={locale === "en" ? "استخدم اللغة العربية" : "Switch to English"}
      >
        <Button
          onClick={handleSwitchLanguage}
          sx={{
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            textTransform: "none",
            direction: "ltr",
          }}
        >
          <LanguageIcon />
          <Box ml={2} fontWeight={400} fontSize="16px">
            {locale === "en" ? "العربية" : "English"}
          </Box>
        </Button>
      </Tooltip>
    </Box>
  );
}
export default SwitchLanguageButton;
