import { Suspense } from "react";
import Link from "next/link";
import { HeroCarousel } from "./carousel";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { translations } from "./translations";
import type { Locale } from "@/components/Providers/LocaleProvider";
import type { CarouselImage } from "@/lib/types";
import { ShieldCheck } from "lucide-react";

const CarouselContent = async () => {
  const carouselImages = await fetchQuery(
    api.carouselImages.queries.getCarouselImages,
  );
  if (!carouselImages || carouselImages.length === 0) {
    const fallbackImage: CarouselImage = {
      id: "home-page-fallback",
      uploadthingKey: "local-home-page",
      src: "/images/home-page.webp",
      altDescription: "A child playing in a welcoming home environment",
      order: 0,
    };
    return <HeroCarousel carouselImages={[fallbackImage]} />;
  }
  const homepageImage: CarouselImage = {
    id: "home-page-featured",
    uploadthingKey: "local-home-page",
    src: "/images/home-page.webp",
    altDescription: "A child playing in a welcoming home environment",
    order: -1,
  };
  return <HeroCarousel carouselImages={[homepageImage, ...carouselImages]} />;
};

const Hero = ({ locale }: { locale: Locale }) => {
  const t = translations.hero;
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/[0.06] via-[#FBF8FC] to-transparent pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center">
          <div className="w-full max-w-xl space-y-6 md:w-1/2 md:shrink-0">
            <span className="eyebrow">{t.chipText[locale]}</span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] text-gray-900">
              {t.heading.part1[locale]}{" "}
              <span className="text-primary">{t.heading.part2[locale]}</span>
            </h1>

            <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
              {t.description[locale]}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href={`/${locale}/kafala-steps`}
                className="primary-button font-semibold"
              >
                {t.journeyButton[locale]}
              </Link>
              <Link
                href={`/${locale}/what-is-kafala`}
                className="outline-button font-semibold"
              >
                {t.learnMoreButton[locale]}
              </Link>
            </div>

            <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-4 text-sm text-gray-600">
              {t.trust.map((item) => (
                <li key={item.en} className="flex items-center gap-2">
                  <ShieldCheck
                    className="h-4 w-4 shrink-0 text-secondary-dark"
                    aria-hidden="true"
                  />
                  {item[locale]}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative w-full md:w-1/2 md:shrink-0">
            <Suspense
              fallback={
                <Skeleton className="w-full aspect-[4/5] rounded-2xl bg-gray-200" />
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
