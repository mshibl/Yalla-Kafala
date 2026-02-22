import { Button } from "@/components/ui/button";
import { translations } from "./translations";
import Link from "next/link";
import DonateNowModal from "@/components/Donate/DonateNowModal";

const HeroSection = ({ locale }: { locale: string }) => (
  <section className="relative overflow-hidden pt-32 pb-16 md:py-32 bg-gradient-to-b from-primary/5 to-white">
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-secondary/5"></div>
    </div>
    <div className="container mx-auto px-6 relative z-10">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2 space-y-6">
          <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full font-medium">
            {locale === "ar"
              ? translations.hero.initiative.ar
              : translations.hero.initiative.en}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
            <span className="text-primary">
              {locale === "ar"
                ? translations.hero.title.ar
                : translations.hero.title.en}
            </span>{" "}
            <span className="">
              {locale === "ar"
                ? translations.hero.subtitle.ar
                : translations.hero.subtitle.en}
            </span>
          </h1>
          <p className="text-lg text-gray-600">
            {locale === "ar"
              ? translations.hero.description.ar
              : translations.hero.description.en}
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <DonateNowModal locale={locale === "ar" ? "ar" : "en"} asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white">
                {locale === "ar"
                  ? translations.hero.supportButton.ar
                  : translations.hero.supportButton.en}
              </Button>
            </DonateNowModal>
            <Link href="/what-is-kafala">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
              >
                {locale === "ar"
                  ? translations.hero.learnMoreButton.ar
                  : translations.hero.learnMoreButton.en}
              </Button>
            </Link>
          </div>
        </div>
        <div className="lg:w-1/2 relative">
          <div className="relative overflow-hidden rounded-2xl shadow-xl">
            <img
              src="/images/child-main.webp"
              alt={"Children in a nurturing home environment"}
              className="w-full h-[350px] md:h-[450px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8 text-white"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
