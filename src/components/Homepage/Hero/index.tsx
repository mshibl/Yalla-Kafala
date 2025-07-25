import { Suspense } from "react";
import { HeroCarousel } from "./carousel";
import { fetchCarouselImages } from "@/server/actions/carouselImages/fetchCarouselImages";
import { Skeleton } from "@/components/ui/skeleton";
import { translations } from "./translations";
import type { Locale } from "@/components/Providers/LocaleProvider";

const CarouselContent = async () => {
  const carouselImages = await fetchCarouselImages();
  if (!carouselImages.success || !carouselImages.data) {
    return <div>Error fetching carousel images</div>;
  }
  return <HeroCarousel carouselImages={carouselImages.data} />;
};

const Hero = ({ locale }: { locale: Locale }) => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>

      {/* Animated Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[20%] right-[5%] w-64 h-64 rounded-full bg-primary/5 animate-float"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="absolute top-[40%] left-[10%] w-48 h-48 rounded-full bg-secondary/5 animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-[10%] right-[15%] w-40 h-40 rounded-full bg-primary/5 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 max-w-xl">
            <div
              className="chip purple-gradient text-white animate-fade-in opacity-0 translate-y-10"
              style={{ transitionDelay: "200ms" }}
            >
              {translations.hero.chipText[locale]}
            </div>

            <h1
              className="heading-lg text-gray-900 animate-fade-in opacity-0 translate-y-10"
              style={{ transitionDelay: "300ms" }}
            >
              {translations.hero.heading.part1[locale]}{" "}
              <span className="text-primary">
                {translations.hero.heading.part2[locale]}
              </span>
            </h1>

            <p
              className="text-gray-600 text-lg animate-fade-in opacity-0 translate-y-10"
              style={{ transitionDelay: "400ms" }}
            >
              {translations.hero.description[locale]}
            </p>

            <div
              className="flex flex-wrap gap-4 pt-4 animate-fade-in opacity-0 translate-y-10"
              style={{ transitionDelay: "500ms" }}
            >
              <a href="#donate" className="primary-button">
                {translations.hero.donateButton[locale]}
              </a>
              <a href="/vision-mission" className="outline-button">
                {translations.hero.learnMoreButton[locale]}
              </a>
            </div>
          </div>

          <div
            className="relative animate-fade-in opacity-0 translate-y-10"
            style={{ transitionDelay: "600ms" }}
          >
            <Suspense
              fallback={
                <Skeleton className="w-full aspect-[4/3] rounded-xl bg-gray-200" />
              }
            >
              <CarouselContent />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
