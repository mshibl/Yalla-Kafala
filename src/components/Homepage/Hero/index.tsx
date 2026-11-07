import { Suspense } from "react";
import Link from "next/link";
import { HeroCarousel } from "./carousel";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { translations } from "./translations";
import type { Locale } from "@/components/Providers/LocaleProvider";
import type { CarouselImage } from "@/lib/types";
import Image from "next/image";
import { isolateLatin } from "@/lib/bidi";
import { ShieldCheck } from "lucide-react";

/** The first slide: a child at play, smiling at the camera. */
const leadImage: CarouselImage = {
  id: "home-child-playing",
  uploadthingKey: "local-child-main",
  src: "/images/child-main.webp",
  altDescription: "A smiling child riding a toy car outdoors",
  order: -2,
};

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
    return <HeroCarousel carouselImages={[leadImage, fallbackImage]} />;
  }
  const homepageImage: CarouselImage = {
    id: "home-page-featured",
    uploadthingKey: "local-home-page",
    src: "/images/home-page.webp",
    altDescription: "A child playing in a welcoming home environment",
    order: -1,
  };
  return (
    <HeroCarousel
      carouselImages={[leadImage, homepageImage, ...carouselImages]}
    />
  );
};

const Hero = ({ locale }: { locale: Locale }) => {
  const t = translations.hero;
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/[0.06] via-[#FBF8FC] to-transparent pt-24 pb-14 md:pt-36 md:pb-24">
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

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
              <Link
                href={`/${locale}/kafala-steps`}
                className="primary-button min-h-12 font-semibold"
              >
                {t.journeyButton[locale]}
              </Link>
              <Link
                href={`/${locale}/what-is-kafala`}
                className="outline-button min-h-12 font-semibold"
              >
                {t.learnMoreButton[locale]}
              </Link>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <span className="shrink-0 rounded-lg bg-white p-1 shadow-sm ring-1 ring-gray-200">
                <Image
                  src="/GuideStarIcon_Platinum.svg"
                  alt=""
                  width={72}
                  height={72}
                />
              </span>
              <ul className="space-y-1 text-sm text-gray-800 md:text-[15px]">
                {t.trust.map((item) => (
                  <li
                    key={item.en}
                    className="flex items-center gap-2 sm:whitespace-nowrap"
                  >
                    <ShieldCheck
                      className="h-4 w-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    {item.href ? (
                      <a
                        href={
                          item.href.startsWith("/")
                            ? `/${locale}${item.href}`
                            : item.href
                        }
                        className="underline-offset-4 hover:text-primary hover:underline"
                      >
                        {locale === "ar" ? isolateLatin(item.ar) : item.en}
                      </a>
                    ) : locale === "ar" ? (
                      isolateLatin(item.ar)
                    ) : (
                      item.en
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative order-first w-full md:order-none md:w-1/2 md:shrink-0">
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
