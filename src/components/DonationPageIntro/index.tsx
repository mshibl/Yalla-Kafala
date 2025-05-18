import { Box, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

const DonationPageIntro = ({ locale }: { locale: "ar" | "en" }) => {
  return (
    <Box
      sx={{
        marginX: { xs: "20px", md: "25%" },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Box width="100%" display="flex" justifyContent="center" mb="20px">
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: { xs: "250px", md: "450px" },
          }}
        >
          <Image
            src="/images/yk_cover.png"
            alt="yk_cover"
            style={{ objectFit: "cover" }}
            fill={true}
          />
        </Box>
      </Box>
      <Typography
        variant="body1"
        sx={{
          fontSize: { xs: "18px", md: "20px" },
          lineHeight: "32px",
          color: "primary.main",
        }}
      >
        {locale === "en" ? (
          <>
            Every child deserves a chance to dream, to thrive, to be loved. Your
            donation has the power to make this come true. It&apos;s more than a
            gift; it&apos;s a lifeline. It&apos;s a chance to provide food,
            shelter, education, and hope.{" "}
            <span style={{ fontWeight: "bold" }}>
              It&apos;s a chance to rewrite the story of a child&apos;s life.
            </span>
          </>
        ) : (
          <>
            كل طفل يستحق الفرصة ليحلم وينمو ويكون محبوب. يمكن أن يكون تبرعك
            القوة التي تجعل هذا الحلم يتحقق. هو أكثر من هدية؛ هو خط النجاة. هو
            فرصة لتقديم الطعام والمسكن والتعليم والأمل. هو فرصة لكتابة قصة حياة
            طفل.
          </>
        )}
      </Typography>
    </Box>
  );
};

export default DonationPageIntro;
