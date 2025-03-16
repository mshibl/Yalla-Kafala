"use client";
import { Box, Typography } from "@mui/material";
import useResponsiveBreakpoint from "@/src/utils/mui-utils";
import PhotosSlideShow from "../../PhotosSlideShow";
import SubmitDonationButton from "./HeroDonateButton/SubmitDonationButton";

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
      <Box
        flex={1}
        bgcolor="primary.main"
        color="#ffffff"
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
            : "Join us in building a better future for orphans and Kafala families"}
        </Typography>
        <SubmitDonationButton locale={locale} />
      </Box>

      <Box
        maxWidth="100%"
        position="relative"
        minWidth={{ xs: "100%", md: "initial" }}
        width={500}
        height={{
          xs: 400,
          sm: 500,
          md: 500,
        }}
      >
        <PhotosSlideShow
          height={{ xs: 400, sm: 500, md: 500 }}
          images={[
            "/images/hero-new.jpg",
            "/images/476598188_1120799712754347_8529389894471728561_n.jpg",
            "/images/476642447_1120799336087718_5443804990686442859_n.jpg",
            "/images/476670895_1120799742754344_8442787079364097001_n.jpg",
            "/images/476895948_1120799396087712_3949764338558615426_n.jpg",
            "/images/476900129_1120799482754370_8369214657783236781_n.jpg",
            "/images/477023793_1120798942754424_1897357425914242591_n.jpg",
            "/images/477080899_1120799502754368_6018991150586689101_n.jpg",
            "/images/477341506_1120799566087695_4181902918588609679_n.jpg",
            "/images/477561230_1120799692754349_5058321338284411279_n.jpg",
          ]}
        />
      </Box>
    </Box>
  );
};

export default HeroSection;
