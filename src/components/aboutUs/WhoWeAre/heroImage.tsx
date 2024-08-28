import { Box } from "@mui/material";
import React from "react";

const HeroImage = ({ src }: { src: string }) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: { xs: "250px", md: "450px" },
        objectFit: "cover",
        objectPosition: "center",
      }}
      component={"img"}
      src={src}
    />
  );
};

export default HeroImage;
