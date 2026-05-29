"use client";

import { Heart } from "lucide-react";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { givebutterDonationUrl } from "@/constants/links";

const copy = {
  en: {
    title: "Support Yalla Kafala",
    subtitle:
      "Your generous donation helps connect orphans with loving families in Egypt.",
    button: "Donate Now",
    taxNote:
      "Yalla Kafala is a 501(c)(3) organization. All donations are tax-deductible.",
  },
  ar: {
    title: "ادعم يلا كفالة",
    subtitle: "تبرعك السخي يساعد في ربط الأيتام بعائلات محبة في مصر.",
    button: "تبرّع الآن",
    taxNote:
      "يلا كفالة منظمة 501(c)(3). جميع التبرعات معفاة من الضرائب.",
  },
};

export default function DonatePage({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl">
          {t.title}
        </h1>
        <p className="mx-auto mb-8 max-w-md text-lg text-gray-600">
          {t.subtitle}
        </p>
        <a
          href={givebutterDonationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="primary-button inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold"
        >
          <Heart className="h-5 w-5" />
          {t.button}
        </a>
        <p className="mt-6 text-sm text-gray-500">{t.taxNote}</p>
      </div>
    </section>
  );
}
