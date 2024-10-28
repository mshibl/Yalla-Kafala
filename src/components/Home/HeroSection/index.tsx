"use client";

import { Box, Typography } from "@mui/material";
import Image from "next/image";
import HeroDonateButton from "@/src/components/Home/HeroSection/HeroDonateButton";
import useEmblaCarousel from "embla-carousel-react";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "@/src/components/EmblaCarousel";
import OnGroundAccomplishments from "../../OnGroundAccomplishments";
import AccomplishmentCard from "../../OnGroundAccomplishments/OnGroundAccomplishmentCard";
import { useEffect } from "react";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";

const HeroSection = ({ locale }: { locale: "ar" | "en" }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      // infinite: true,
      loop: true,
      // duration: 1,
    },
    [Fade(), Autoplay({ playOnInit: true, delay: 3000 })]
  );

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  useEffect(() => {
    if (!emblaApi) return;
    setInterval(() => {
      emblaApi.scrollNext();
    }, 3000);
    // emblaApi?.scrollTo(0);
  }, [emblaApi]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="primary.main"
      flexDirection={{ xs: "column-reverse", md: "row" }}
      // overflow="hidden"
      // maxWidth="100vw"
      className="hero-section"
      position="relative"
    >
      <Box
        flex={1}
        bgcolor="primary.main"
        style={{
          backdropFilter: "blur(10px)",
        }}
        color="#ffffff"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        padding="30px"
        position="absolute"
        bottom="0"
        zIndex={1}
        // bgcolor="primary.main"
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
        <HeroDonateButton locale={locale} />
      </Box>
      <Box overflow="hidden" maxWidth="100vw">
        <Box
          className="embla"
          ref={emblaRef}
          overflow="hidden"
          style={{ direction: "ltr" }}
        >
          <Box className="embla__container" display="flex">
            <HeroSectionItem
              imgSrc="/images/yk-team-1.jpg"
              imgAlt="Hero Section 1"
            />

            <HeroSectionItem
              imgSrc="/images/kafala-bus.jpg"
              imgAlt="Hero Section 2"
            />

            <HeroSectionItem
              imgSrc="/images/garage-sale.jpg"
              imgAlt="Hero Section 3"
            />

            <HeroSectionItem
              imgSrc="/images/kafala-training.jpg"
              imgAlt="Hero Section 4"
            />

            <HeroSectionItem
              imgSrc="/images/positive-discipline-workshops-1.jpg"
              imgAlt="Hero Section 5"
            />

            <HeroSectionItem
              imgSrc="/images/positive-discipline-workshops-2.jpg"
              imgAlt="Hero Section 6"
            />

            <HeroSectionItem
              imgSrc="/images/introducing-art-therapy.jpg"
              imgAlt="Hero Section 7"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const HeroSectionItem = ({
  imgSrc,
  imgAlt,
}: {
  imgSrc: string;
  imgAlt: string;
}) => {
  return (
    <Box>
      <Box
        justifyContent="center"
        position="relative"
        display="flex"
        width="100vw"
        height="500px"
      >
        <Image
          src={imgSrc}
          alt={imgAlt}
          fill={true}
          sizes="100% 100%"
          style={{ objectFit: "cover" }}
        />
      </Box>
    </Box>
  );
};

export default HeroSection;
