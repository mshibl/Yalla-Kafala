"use client";
import { useEffect, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { CarouselImage } from "@/lib/types";
import Image from "next/image";
import { useLocale } from "@/components/Providers/LocaleProvider";
export const HeroCarousel = ({
  carouselImages,
}: {
  carouselImages: CarouselImage[];
}) => {
  const carouselApiRef = useRef<CarouselApi | null>(null);
  const locale = useLocale();

  // Set up autoplay for carousel
  useEffect(() => {
    const api = carouselApiRef.current;
    if (!api) return;

    // Start autoplay - change slide every 5 seconds
    const autoplayInterval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(autoplayInterval);
  }, [carouselApiRef.current]);

  return (
    <Carousel
      className="w-full"
      opts={{ loop: true, direction: locale === "ar" ? "rtl" : "ltr" }}
      setApi={(api) => {
        carouselApiRef.current = api;
      }}
    >
      <CarouselContent>
        {carouselImages.map((image, index) => (
          <CarouselItem key={index}>
            <div className="relative h-[340px] w-full md:h-[560px] rounded-3xl overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10"></div>
              <Image
                fill
                priority
                src={image.src}
                alt={image.altDescription}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="bg-gray-50 object-cover"
              />
              {((locale === "en" && image.captionEn) ||
                (locale !== "en" && image.captionAr)) && (
                <div className="absolute bottom-6 start-6 z-20 max-w-sm">
                  <p className="text-white font-medium text-sm md:text-base">
                    {locale === "en" ? image.captionEn : image.captionAr}
                  </p>
                </div>
              )}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};
