import { Box, Typography } from "@mui/material";
import React from "react";

const Founder = ({ locale }: { locale: string }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "end",
        marginTop: { xs: "20px", md: "150px" },
        direction: "rtl",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          position: "relative",
          justifyContent: "end",
          backgroundColor: "secondary.main",
          paddingY: { xs: "40px", md: "50px" },
          paddingX: { xs: "32px", md: "180px" },
          paddingLeft: { xs: "32px", md: "450px" },
          borderRadius: { md: "1000px 0px 0px 1000px" },
          width: { xs: "100%", md: "100%" },
        }}
      >
        <Box
          sx={{
            left: { md: "-40px" },
            top: { md: "-90px" },
            position: { xs: "relative", md: "absolute" },
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: { md: "430px" },
              height: { md: "400px" },
            }}
          >
            <Box
              sx={{
                position: { xs: "relative", md: "absolute" },
                zIndex: "1",
                width: "100%",
              }}
              component={"img"}
              src="/images/founder.png"
            ></Box>
            <Box
              sx={{
                display: { xs: "none", md: "block" },
                position: "absolute",
                backgroundColor: "secondary.main",
                width: "100%",
                height: "90%",
                top: "-25px",
                left: "-20px",
                borderRadius: "8px",
              }}
            ></Box>
            <Box
              sx={{
                display: { xs: "none", md: "block" },
                position: "absolute",
                backgroundColor: "primary.main",
                width: "100%",
                height: "90%",
                bottom: "-20px",
                right: "-20px",
                borderRadius: "8px",
              }}
            ></Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "end",
            // width: { xs: "100%", md: "60%" },
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "24px", md: "50px" },
              fontWeight: "bold",
              marginBottom: { xs: "10px", md: "35px" },
              lineHeight: "32px",
              color: "white",
              width: "100%",
            }}
            variant="h2"
          >
            {locale === "en" ? "Our Founder" : "مؤسستنا"}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "16px", md: "24px" },
              lineHeight: { xs: "25px", md: "32px" },
              color: "white",
            }}
            variant="body1"
          >
            {locale === "en"
              ? `Rasha Mekky has over 25 years of experience in Child Development,
            Child Assessment, and Positive Discipline. Her journey began with
            the Kafala of her son Mostafa eight years ago, which inspired her to
            launch Yalla Kafala. Rasha also established Little Pharaohs daycare
            in the San Francisco Bay Area in 2015.`
              : `رشا مكي لديها أكثر من 25 عامًا من الخبرة في تطوير الطفل، تقييم الطفل، والانضباط الإيجابي. بدأت رحلتها مع الكفالة لابنها مصطفى قبل ثماني سنوات، مما ألهمها لإطلاق يلا كفالة. أسست رشا أيضًا حضانة Little Pharaohs في منطقة خليج سان فرانسيسكو في عام 2015. `}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Founder;
