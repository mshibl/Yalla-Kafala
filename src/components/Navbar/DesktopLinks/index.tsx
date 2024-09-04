import * as React from "react";
import Box from "@mui/material/Box";
import { useLocale, useTranslations } from "next-intl";
import { Button, Menu, MenuItem, Typography } from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";
import NavbarDonateButton from "@/src/components/Navbar/NavbarDonateButton";
import Link from "next/link";
import {
  ABOUT_US_PAGE,
  ACTIVITIES_AND_MILESTONES_PAGE,
  FAQS_PAGE,
  PARTNERSHIPS_PAGE,
  KAFALA_STEPS_PAGE,
  KAFALA_STORIES_PAGE,
  PAGE_PATHNAMES,
  VISION_MISSION_AND_VALUES_PAGE,
  WHAT_IS_KAFALA_PAGE,
  WHO_WE_ARE_PAGE,
} from "@/src/constants/pages";
import ApplyForKafalaButton from "../ApplyForKafalaButton";

const DESKTOP_HIGHLIGHTED_PAGES = [
  KAFALA_STEPS_PAGE,
  KAFALA_STORIES_PAGE,
  WHAT_IS_KAFALA_PAGE,
  FAQS_PAGE,
  ABOUT_US_PAGE,
];

const ABOUT_US_MENU_PAGES = [
  WHO_WE_ARE_PAGE,
  VISION_MISSION_AND_VALUES_PAGE,
  ACTIVITIES_AND_MILESTONES_PAGE,
  PARTNERSHIPS_PAGE,
];

function DesktopLinks({
  activePage,
  handleOpenAboutUsMenu,
  handleCloseAboutUsMenu,
  anchorAboutUsMenu,
}: {
  activePage: string;
  handleOpenAboutUsMenu: (e: React.MouseEvent<HTMLElement>) => void;
  handleCloseAboutUsMenu: (e: React.MouseEvent<HTMLElement>) => void;
  anchorAboutUsMenu: HTMLElement | null;
}) {
  const t = useTranslations("Navbar");
  const locale = useLocale();

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: { xs: "none", lg: "flex" },
        justifyContent: "flex-end",
      }}
    >
      {DESKTOP_HIGHLIGHTED_PAGES.map((pageName) =>
        pageName === ABOUT_US_PAGE ? (
          <Button
            key={pageName}
            onClick={(e) => {
              handleOpenAboutUsMenu(e);
            }}
            sx={{
              my: 2,
              color: ABOUT_US_MENU_PAGES.includes(activePage)
                ? "#2194BC"
                : "#87226C",
              fontWeight: "bold",
              fontSize: "16px",
              textTransform: "none",
              marginLeft: "20px",
            }}
          >
            {locale === "en" ? "About Us" : "من نحن"}
            <ArrowDropDown />
          </Button>
        ) : (
          <Link
            key={pageName}
            href={`/${locale}${PAGE_PATHNAMES[pageName]}`}
            style={{ textDecoration: "none", marginLeft: "15px" }}
          >
            <Button
              sx={{
                my: 2,
                color: activePage === pageName ? "#2194BC" : "#87226C",
                fontWeight: "bold",
                fontSize: "16px",
                textTransform: "none",
              }}
            >
              {t(`pages.${pageName}.name`)}
            </Button>
          </Link>
        )
      )}

      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          marginLeft: "15px",
        }}
      >
        <NavbarDonateButton />
      </Box>
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          marginLeft: "15px",
        }}
      >
        <ApplyForKafalaButton />
      </Box>

      <Menu
        id="about-us-menu"
        sx={{ mt: "40px" }}
        anchorEl={anchorAboutUsMenu}
        keepMounted={true}
        open={Boolean(anchorAboutUsMenu)}
        onClose={handleCloseAboutUsMenu}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {ABOUT_US_MENU_PAGES.map((pageName) => (
          <Link
            href={`/${locale}${PAGE_PATHNAMES[pageName]}`}
            style={{ textDecoration: "none" }}
            key={pageName}
          >
            <MenuItem
              sx={{ minWidth: "150px" }}
              onClick={handleCloseAboutUsMenu}
            >
              <Typography
                color={activePage === pageName ? "#2194BC" : "#87226C"}
                fontWeight={"bold"}
                textAlign="center"
                fontSize="16px"
              >
                {t(`pages.${pageName}.name`)}
              </Typography>
            </MenuItem>
          </Link>
        ))}
      </Menu>
    </Box>
  );
}

export default DesktopLinks;
