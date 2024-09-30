import React from "react";
import { Box, Typography } from "@mui/material";
import IntroParagraphs from "./introParagraphs";
import FirstHadith from "./firstHadith";
import SecondHadith from "./secondHadith";
import Footnotes from "./footnotes";
import References from "./references";
import Banner from "./banner";
import { Metadata } from "next";
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isArabic = locale === "ar";

  const title = isArabic ? "ما هي الكفالة؟" : "What is Kafala?";
  const description = isArabic
    ? "الكفالة هي نظام رعاية إسلامي للأطفال، مشابه للتبني ولكنه لا يشمل تغيير الاسم أو حقوق الوراثة. يلا كفالة تهدف إلى تسهيل وتوضيح هذه العملية للأسرة المصرية، وتقديم الدعم والمشورة القانونية."
    : "Kafala is an Islamic guardianship system, similar to adoption but without changing the child's name or inheritance rights. Yalla Kafala aims to streamline and clarify this process for Egyptian families, offering legal support and guidance.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://yallakafala.org/what-is-kafala",
      siteName: "Yalla Kafala",
      images: [
        {
          url: "https://yallakafala.org/images/kafala-process.jpg",
          width: 1200,
          height: 630,
        },
      ],
      locale,
      type: "website",
    },
  };
}

const WhatIsKafalaPage = () => {
  return (
    <>
      <Banner />
      <Box
        sx={{
          maxWidth: "940px",
          margin: "auto",
          paddingY: { xs: "40px", md: "60px" },
          paddingX: "20px",
        }}
      >
        <IntroParagraphs />
        <FirstHadith />
        <SecondHadith />
        <Footnotes />
        <References />
      </Box>
    </>
  );
};

export default WhatIsKafalaPage;
