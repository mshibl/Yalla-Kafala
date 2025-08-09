"use client";

import React from "react";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { translations } from "./translations";
import { MapPin } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ActivityCard from "./ActivityCard";

interface OnGroundSectionProps {
  locale: Locale;
}

const OnGroundSection = ({ locale }: OnGroundSectionProps) => {
  const onGroundActivities = translations.onGround.map((item) => ({
    title: item.title[locale],
    description: item.description[locale],
    image: item.image,
    fullDescription: item.fullDescription[locale],
  }));

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-10">
            <MapPin className="text-primary w-8 h-8" />
            <h2 className="text-3xl font-serif font-bold text-gray-800">
              {translations.sections.onGround[locale]}
            </h2>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {onGroundActivities.map((activity, index) => (
                <CarouselItem
                  key={index}
                  className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <ActivityCard
                    title={activity.title}
                    description={activity.description}
                    image={activity.image}
                    fullDescription={activity.fullDescription}
                    readMoreLabel={translations.ui.readMore[locale]}
                    isRtl={locale === "ar"}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-8">
              <CarouselPrevious className="relative  translate-y-0 left-0 mr-2" />
              <CarouselNext className="relative  translate-y-0 right-0" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default OnGroundSection;
