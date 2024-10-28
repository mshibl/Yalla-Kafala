import { Box } from "@mui/material";
import Image from "next/image";

const MilestoneItem = ({
  imgSrc,
  englishImgAlt,
  arabicImgAlt,
  align,
  locale,
  milestoneYear,
  englishMilestoneText,
  arabicMilestoneText,
  index,
  isMD,
}: {
  imgSrc: string;
  englishImgAlt: string;
  arabicImgAlt: string;
  align: "left" | "right";
  locale: string;
  milestoneYear: string;
  englishMilestoneText: string;
  arabicMilestoneText: string;
  index: number;
  isMD: boolean;
}) => {
  return (
    <Box
      id="milestone-box"
      position="absolute"
      top={`${index * 200}px`}
      left={align === "right" ? "50%" : "auto"}
      right={align === "right" ? "auto" : "50%"}
      height="240px"
      display="flex"
      justifyContent={
        align === "right"
          ? locale === "en"
            ? "flex-start"
            : "flex-end"
          : locale === "en"
          ? "flex-end"
          : "flex-start"
      }
    >
      <Box
        position="relative"
        display="flex"
        justifyContent="center"
        width="230px"
        height="240px"
        maxWidth="50vw"
      >
        <Image
          src={imgSrc}
          alt={locale === "en" ? englishImgAlt : arabicImgAlt}
          fill={true}
          sizes="100% 100%"
          style={{
            objectFit: "contain",
            padding: "30px",
          }}
        />
      </Box>

      <Box
        id="dot"
        position="absolute"
        left={align === "right" ? "0%" : "100%"}
        top="100%"
        width="28px"
        height="28px"
        bgcolor="#87226C"
        borderRadius="50%"
        zIndex="1"
        style={{
          transform: "translate(-28%, 0%)",
        }}
      />

      <Box
        fontSize={40}
        fontWeight={700}
        color="#87226C"
        position="absolute"
        top="90%"
        lineHeight={1}
        paddingX="30px"
        textAlign={align === "right" ? "left" : "right"}
        maxWidth="50vw"
      >
        {milestoneYear}
        <Box
          fontSize={isMD ? "20px" : "18px"}
          color="#2194BC"
          fontWeight="normal"
          lineHeight={1.3}
        >
          {locale === "en" ? englishMilestoneText : arabicMilestoneText}
        </Box>
      </Box>
    </Box>
  );
};

export default MilestoneItem;
