import React from "react";
import type { Locale } from "@/components/Providers/LocaleProvider";
import PartnerCard from "./PartnerCard";
import type { Partner } from "./types";
import { translations } from "./translations";

export const partners: Partner[] = [
  {
    nameEn: "Children's Future Foundation",
    nameAr: "مؤسسة مستقبل الأطفال",
    logo: "/placeholder.svg",
    descriptionEn:
      "A global organization dedicated to improving children's welfare through healthcare, education, and social services.",
    descriptionAr:
      "منظمة عالمية مكرسة لتحسين رفاهية الأطفال من خلال الرعاية الصحية والتعليم والخدمات الاجتماعية.",
  },
  {
    nameEn: "Bright Horizons Initiative",
    nameAr: "مبادرة الآفاق المشرقة",
    logo: "/placeholder.svg",
    descriptionEn:
      "Supporting orphaned children by providing resources, mentoring, and community integration programs.",
    descriptionAr:
      "تدعم الأطفال الأيتام من خلال توفير الموارد والإرشاد وبرامج الاندماج المجتمعي.",
  },
  {
    nameEn: "Sunshine Family Services",
    nameAr: "خدمات عائلة أشعة الشمس",
    logo: "/placeholder.svg",
    descriptionEn:
      "Specializing in connecting orphaned children with loving and supportive Kafala families.",
    descriptionAr: "متخصصة في ربط الأطفال الأيتام بعائلات كفالة محبة وداعمة.",
  },
  {
    nameEn: "Hope International",
    nameAr: "الأمل الدولية",
    logo: "/placeholder.svg",
    descriptionEn:
      "Working across borders to ensure every child has access to care, education, and a supportive family environment.",
    descriptionAr:
      "تعمل عبر الحدود لضمان حصول كل طفل على الرعاية والتعليم وبيئة أسرية داعمة.",
  },
  {
    nameEn: "Guardian Angels Network",
    nameAr: "شبكة ملائكة الحراسة",
    logo: "/placeholder.svg",
    descriptionEn:
      "A community of volunteers and professionals dedicated to supporting children in need and Kafala families.",
    descriptionAr:
      "مجتمع من المتطوعين والمتخصصين مكرس لدعم الأطفال المحتاجين وعائلات الكفالة.",
  },
  {
    nameEn: "Family First Alliance",
    nameAr: "تحالف الأسرة أولاً",
    logo: "/placeholder.svg",
    descriptionEn:
      "Advocating for policies that prioritize family-based care for orphaned and vulnerable children.",
    descriptionAr:
      "يدافع عن السياسات التي تعطي الأولوية للرعاية الأسرية للأطفال الأيتام والضعفاء.",
  },
];

const Partnerships = ({ locale }: { locale: Locale }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section - styled like WhoWeAre/HeroSection */}
        <section className="relative bg-gradient-to-b from-primary/5 to-white pt-24 pb-16 md:pt-32 md:pb-24">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-[20%] right-[5%] w-64 h-64 rounded-full bg-primary/5 animate-float"
              style={{ animationDelay: "0s" }}
            />
            <div
              className="absolute top-[40%] left-[10%] w-48 h-48 rounded-full bg-secondary/5 animate-float"
              style={{ animationDelay: "1s" }}
            />
            <div
              className="absolute bottom-[10%] right-[15%] w-40 h-40 rounded-full bg-primary/5 animate-float"
              style={{ animationDelay: "2s" }}
            />
          </div>

          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
              <h1 className="text-3xl md:text-5xl font-bold text-primary mb-6">
                {translations.hero.title[locale]}
              </h1>
              <p className="text-gray-700 text-lg mb-0">
                {translations.hero.description[locale]}
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
        </section>

        {/* Partners Grid Section */}
        <section className="py-12 md:py-16 ">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up [animation-delay:150ms]">
              {partners.map((partner, index) => (
                <PartnerCard key={index} partner={partner} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Partnerships;
