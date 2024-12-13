import * as React from "react";
import Box from "@mui/material/Box";
import { useLocale, useTranslations } from "next-intl";
import { Button, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  APPLY_FOR_KAFALA,
  DONATE_PAGE,
  FAQS_PAGE,
  KAFALA_STEPS_PAGE,
  KAFALA_STORIES_PAGE,
  PAGE_PATHNAMES,
  WHAT_IS_KAFALA_PAGE,
  WHO_WE_ARE_PAGE,
  VISION_MISSION_AND_VALUES_PAGE,
  ACTIVITIES_AND_MILESTONES_PAGE,
  PARTNERSHIPS_PAGE,
  HOME_PAGE,
} from "@/src/constants/pages";
import Link from "next/link";
import DonateButton from "../NavbarDonateButton";

const MOBILE_LINKS_PAGES = [
  HOME_PAGE,
  DONATE_PAGE,
  APPLY_FOR_KAFALA,
  WHO_WE_ARE_PAGE,
  VISION_MISSION_AND_VALUES_PAGE,
  ACTIVITIES_AND_MILESTONES_PAGE,
  PARTNERSHIPS_PAGE,
  KAFALA_STEPS_PAGE,
  KAFALA_STORIES_PAGE,
  WHAT_IS_KAFALA_PAGE,
  FAQS_PAGE,
];

function MobileLinks({
  anchorPagesMenu,
  handleOpenPagesMenu,
  handleClosePagesMenu,
}: {
  anchorPagesMenu: HTMLElement | null;
  handleOpenPagesMenu: (e: React.MouseEvent<HTMLElement>) => void;
  handleClosePagesMenu: (e: React.MouseEvent<HTMLElement>) => void;
}) {
  const t = useTranslations("Navbar");
  const locale = useLocale();

  return (
    <Box sx={{ display: { xs: "flex", lg: "none" } }}>
      <Box display="flex" alignItems="center">
        <DonateButton
          sx={{
            height: "56px",
            borderRadius: "0",
            ml: locale === "ar" ? "10px" : "0",
            mr: locale === "ar" ? "0" : "10px",
          }}
        />
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="mobile-pages-menu"
          aria-haspopup="true"
          onClick={handleOpenPagesMenu}
        >
          <MenuIcon />
        </IconButton>
      </Box>
      <Menu
        id="mobile-pages-menu"
        anchorEl={anchorPagesMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={Boolean(anchorPagesMenu)}
        onClose={handleClosePagesMenu}
        sx={{
          display: { xs: "block", lg: "none" },
        }}
      >
        {MOBILE_LINKS_PAGES.map((pageName) => {
          let href = `/${locale}${PAGE_PATHNAMES[pageName]}`;
          if (pageName === "apply_for_kafala") {
            href = `${PAGE_PATHNAMES[pageName]}`;
          }
          return (
            <Link key={pageName} href={href} style={{ textDecoration: "none" }}>
              <MenuItem
                sx={{ minWidth: "200px" }}
                onClick={handleClosePagesMenu}
              >
                <Typography color="#000000" textAlign="center">
                  {t(`pages.${pageName}.name`)}
                </Typography>
              </MenuItem>
            </Link>
          );
        })}
      </Menu>
    </Box>
  );
}

export default MobileLinks;
