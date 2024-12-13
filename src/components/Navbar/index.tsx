"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Logo from "../Logo";
import SwitchLanguageButton from "./SwitchLanguageButton";
import DesktopLinks from "./DesktopLinks";
import MobileLinks from "./MobileLinks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useResponsiveBreakpoint from "@/src/utils/mui-utils";
import SocialMediaListItem from "../AppFooter/newsletter/SocialMediaListItem";

function Navbar({ locale }: { locale: "ar" | "en" }) {
  const [anchorPagesMenu, setAnchorPagesMenu] =
    React.useState<null | HTMLElement>(null);

  const handleOpenPagesMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorPagesMenu(event.currentTarget);
  };

  const [anchorAboutUsMenu, setAnchorAboutUsMenu] =
    React.useState<null | HTMLElement>(null);

  const handleClosePagesMenu = () => {
    setAnchorPagesMenu(null);
  };

  const handleOpenAboutUsMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorAboutUsMenu(event.currentTarget);
  };

  const handleCloseAboutUsMenu = () => {
    setAnchorAboutUsMenu(null);
  };

  const pathname = usePathname();
  const activePage = pathname.split("/")[2];
  const isMD = useResponsiveBreakpoint("md");

  return (
    <AppBar
      sx={{
        top: 0,
        position: "sticky",
        zIndex: 1000,
        boxShadow: "none",
        // borderBottom: "1px solid #D1D1D1",
      }}
    >
      <Toolbar
        style={{
          maxHeight: "44px",
          minHeight: "44px",
        }}
        sx={{
          px: 0,
          backgroundColor: "#2194BC",
          display: "flex",
          justifyContent: "center",
          border: "none",
        }}
      >
        <Box
          sx={{
            maxWidth: "xl",
            width: "100%",
            pl: "8px",
            pr: "8px",
            mt: 0,
            mb: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            {["facebook", "instagram", "youtube", "twitter"].map(
              (item, index) => (
                <SocialMediaListItem
                  key={index}
                  name={item}
                  language={locale}
                />
              )
            )}
          </Box>
          <SwitchLanguageButton key="switch-language-button" />
        </Box>
      </Toolbar>
      <Toolbar
        sx={{
          px: 0,
          backgroundColor: "#FFFFFF",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: "xl",
            width: "100%",
            pl: "8px",
            pr: "8px",
            mt: 0,
            mb: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo */}
          <Box
            key="logo"
            sx={{
              flexGrow: 1,
            }}
          >
            <Link href="/">
              <Logo />
            </Link>
          </Box>

          {/* Desktop Links */}
          <DesktopLinks
            key="desktop-links"
            activePage={activePage}
            handleOpenAboutUsMenu={handleOpenAboutUsMenu}
            handleCloseAboutUsMenu={handleCloseAboutUsMenu}
            anchorAboutUsMenu={anchorAboutUsMenu}
          />

          {/* Mobile */}
          <MobileLinks
            key="mobile-links"
            anchorPagesMenu={anchorPagesMenu}
            handleOpenPagesMenu={handleOpenPagesMenu}
            handleClosePagesMenu={handleClosePagesMenu}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
export default Navbar;
