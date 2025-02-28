"use client";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import HeroDonateButton from "@/src/components/Home/HeroSection/HeroDonateButton";
import useResponsiveBreakpoint from "@/src/utils/mui-utils";
import LanternString from "../../Ramadan/Lanterns";

const HeroSection = ({ locale }: { locale: "ar" | "en" }) => {
  const isMobile = useResponsiveBreakpoint("sm", true);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="primary.main"
      flexDirection={{ xs: "column-reverse", md: "row" }}
    >
      <Box> 
        <LanternString />
      </Box>
      {/* <Box
        flex={1}
        bgcolor={isMobile ? "#FFFFFF" : "primary.main"}
        color={isMobile ? "primary.main" : "#ffffff"}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        padding="30px"
      >
        <Typography
          fontSize={{ xs: "30px", md: "40px" }}
          lineHeight={1.5}
          paddingBottom="20px"
        >
          {locale === "ar"
            ? "شاركنا فى بناء مستقبل أفضل لفاقدي الرعاية الأسرية والأسر الكافلة"
            : "Join us in building an even better future for orphans and Kafala families"}
        </Typography>
        <HeroDonateButton locale={locale} />
      </Box>
      <Box
        maxWidth="100%"
        position="relative"
        minWidth={{ xs: "100%", md: "initial" }}
        width={500}
        height={{
          xs: 350,
          sm: 500,
          md: 500,
        }}
      >
        <Image
          src="/images/hero-new.jpg"
          alt="Yalla Kafala hero image"
          style={{ objectFit: "cover" }}
          fill={true}
          sizes="100% 100%"
        />
      </Box> */}
    </Box>
  );
};

export default HeroSection;
