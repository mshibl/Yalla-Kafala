import Image from "next/image";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { translations } from "./translations";

export const FounderSection = ({ locale }: { locale: Locale }) => {
  const founder = translations.founder;

  return (
    <section
      className="bg-gray-50 py-16"
      dir={locale === "ar" ? "rtl" : "ltr"}
      aria-labelledby="founder-heading"
    >
      <div className="container mx-auto px-6">
        <h2
          id="founder-heading"
          className="heading-lg mb-10 text-center text-gray-900"
        >
          {founder.title[locale]}
        </h2>
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col items-center gap-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-primary/10 md:flex-row md:p-10">
            <div className="flex w-full justify-center md:w-1/3">
              <div className="relative h-64 w-64 overflow-hidden rounded-full border-4 border-primary/20">
                <Image
                  src={founder.image}
                  alt={founder.name[locale]}
                  fill
                  sizes="256px"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <h3 className="mb-1 text-2xl font-semibold text-gray-900">
                {founder.name[locale]}
              </h3>
              <p className="mb-4 font-medium text-gray-600">
                {founder.role[locale]}
              </p>
              {founder.bio.map((paragraph, index) => (
                <p
                  key={index}
                  className="mb-4 text-base leading-relaxed text-gray-700 last:mb-0 md:text-lg"
                >
                  {paragraph[locale]}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
