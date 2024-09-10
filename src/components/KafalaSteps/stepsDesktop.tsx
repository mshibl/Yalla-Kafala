import React from "react";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
import Image from "next/image";

export default function StepsDesktop({
  locale,
  steps,
}: {
  locale: string;
  steps: {
    image: string;
    title: string;
    description: string;
    details: string;
  }[];
}) {
  return (
    <Box
      sx={{
        display: { xs: "none", lg: "block" },
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: "24px", lg: "50px" },
          fontWeight: "bold",
          marginBottom: { xs: "10px", lg: "25px" },
          lineHeight: { sx: "32px", lg: "61px" },
          color: "secondary.main",
        }}
        variant="h2"
      >
        {locale === "en" ? "Kafala Steps" : "خطوات الكفالة"}
      </Typography>

      <Grid container>
        {steps.map((step, index) => {
          const borderRadiusValues = {
            topLeft: 0,
            topRight: 0,
            bottomRight: 0,
            bottomLeft: 0,
          };

          if (index === 0) {
            borderRadiusValues.bottomLeft = locale === "ar" ? 65 : 0;
            borderRadiusValues.bottomRight = locale === "en" ? 65 : 0;
          } else if (index === steps.length - 1) {
            borderRadiusValues.topRight = locale === "ar" ? 65 : 0;
            borderRadiusValues.topLeft = locale === "en" ? 65 : 0;
          } else if (index % 2 === 0) {
            borderRadiusValues.topLeft = locale === "ar" ? 65 : 0;
            borderRadiusValues.bottomLeft = locale === "ar" ? 65 : 0;
            borderRadiusValues.topRight = locale === "en" ? 65 : 0;
            borderRadiusValues.bottomRight = locale === "en" ? 65 : 0;
          } else {
            borderRadiusValues.topRight = locale === "ar" ? 65 : 0;
            borderRadiusValues.bottomRight = locale === "ar" ? 65 : 0;
            borderRadiusValues.topLeft = locale === "en" ? 65 : 0;
            borderRadiusValues.bottomLeft = locale === "en" ? 65 : 0;
          }
          return (
            <Grid item xs={12} key={index} sx={{ marginBottom: "20px" }}>
              <Card
                sx={{
                  minHeight: "350px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: `${borderRadiusValues.topLeft}px ${borderRadiusValues.topRight}px ${borderRadiusValues.bottomRight}px ${borderRadiusValues.bottomLeft}px`,
                  backgroundColor:
                    index % 2 === 0 ? "secondary.main" : "primary.main",
                  color: "white",
                  width: "80%",
                  marginLeft:
                    index % 2 === 0
                      ? locale === "en"
                        ? ""
                        : "auto"
                      : locale === "en"
                      ? "auto"
                      : "",
                  marginRight:
                    index % 2 === 0
                      ? locale === "en"
                        ? "auto"
                        : ""
                      : locale === "en"
                      ? ""
                      : "auto",
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: index % 2 === 0 ? "end" : "start",
                    height: "100%",
                    paddingX: "60px",
                    paddingY: "50px !important",
                  }}
                >
                  <Box
                    sx={{
                      width: "250px",
                      height: "250px",
                      minWidth: "250px",
                      minHeight: "250px",
                      backgroundColor: "white",
                      padding: "35px",
                      borderRadius: "8px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <Image
                        src={step.image}
                        alt={"Kafala Step"}
                        layout="fill"
                        objectFit="contain"
                      />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      marginX: "30px",
                    }}
                  >
                    <Typography
                      fontSize={"30px"}
                      fontWeight={"bold"}
                      variant="h5"
                      gutterBottom
                    >
                      {step.title}
                    </Typography>
                    <Typography
                      fontSize={"24px"}
                      fontWeight={"bold"}
                      variant="h5"
                      gutterBottom
                    >
                      {step.description}
                    </Typography>
                    <Typography fontSize={"24px"} variant="body2">
                      {step.details}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
