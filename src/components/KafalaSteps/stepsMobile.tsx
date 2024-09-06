import React from "react";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
import Image from "next/image";

export default function StepsMobile({
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
        display: { xs: "block", lg: "none" },
        paddingX: { xs: "32px" },
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: "24px", lg: "50px" },
          fontWeight: "bold",
          marginBottom: { xs: "10px", lg: "25px" },
          lineHeight: { sx: "32px", lg: "61px" },
          color: "primary.main",
        }}
        variant="h2"
      >
        {locale === "en" ? "Kafala Steps" : "خطوات الكفالة"}
      </Typography>

      <Grid container>
        {steps.map((step, index) => {
          return (
            <Grid item xs={12} key={index} sx={{ marginBottom: "20px" }}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "white",
                  border: "none",
                  boxShadow: "none",
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: "115px",
                      height: "115px",
                      minWidth: "115px",
                      minHeight: "115px",
                      backgroundColor: "white",
                      padding: "30px",
                      borderRadius: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      boxShadow:
                        "0px 4px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
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
                  <Typography
                    fontSize={"30px"}
                    fontWeight={"bold"}
                    variant="h5"
                    gutterBottom
                    textAlign={"center"}
                    color={"primary.main"}
                  >
                    {step.title}
                  </Typography>
                  <Typography
                    fontSize={"24px"}
                    fontWeight={"bold"}
                    variant="h5"
                    gutterBottom
                    textAlign={"center"}
                  >
                    {step.description}
                  </Typography>
                  <Typography
                    textAlign={"center"}
                    fontSize={"24px"}
                    variant="body2"
                  >
                    {step.details}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
