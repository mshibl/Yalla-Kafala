"use client";
import { Button, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useLocale } from "next-intl";
import Link from "next/link";
import React from "react";

const HelpChildrenAndFamilies = ({ locale }: { locale: string }) => {
  return (
    <Box
      sx={{
        display: { xs: "none", md: "block" },
        marginTop: "50px",
        paddingX: { xs: "32px", md: "58px" },
        paddingY: "58px",
      }}
    >
      <Typography
        textAlign={"center"}
        sx={{
          fontWeight: "bold",
          color: "secondary.main",
          fontSize: { xs: "24px", md: "50px" },
          marginBottom: { xs: "16px", md: "30px" },
        }}
        variant="h2"
      >
        {locale === "en"
          ? "Want to Help Children & Kafala families?"
          : "هل تريد مساعدة الأطفال وأسر الكفالة؟"}
      </Typography>
      <Typography
        sx={{
          color: "secondary.main",
          marginBottom: { xs: "16px", md: "30px" },
        }}
        variant="body1"
        textAlign={"center"}
      >
        {locale === "en"
          ? "Donate or join us in building better futures for these children"
          : "تبرع أو انضم إلينا في بناء مستقبل أفضل لهؤلاء الأطفال"}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ActionButton
          link="donate"
          text={locale === "en" ? "Donate" : "تبرع"}
        />
        <ActionButton
          link="volunteer"
          text={locale === "en" ? "Volunteer" : "تطوع معنا"}
        />
      </Box>
    </Box>
  );
};

const ActionButton = ({ link, text }: { link: string; text: string }) => {
  const locale = useLocale();

  return (
    <Link href={`/${locale}/${link}`}>
      <Button
        variant="contained"
        sx={{
          fontWeight: 600,
          backgroundColor: "#87226C",
          color: "#FFFFFF",
          fontSize: "40px",
          borderRadius: "100px",
          textTransform: "none",
          boxShadow: "none",
          marginX: "8px",
          minWidth: "350px",
        }}
      >
        {text}
      </Button>
    </Link>
  );
};

export default HelpChildrenAndFamilies;
