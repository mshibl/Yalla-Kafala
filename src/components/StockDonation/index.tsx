import {
  CheckCircle2,
  CircleHelp,
  Landmark,
  Mail,
  TrendingUp,
} from "lucide-react";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { amcfDonationUrl } from "@/constants/links";
import { translations } from "./translations";

export default function StockDonation({ locale }: { locale: Locale }) {
  return (
    <section className="pt-28 pb-14 md:pt-36 md:pb-20 bg-gradient-to-b from-primary/5 via-white to-secondary/5">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            <TrendingUp className="h-4 w-4" />
            {translations.badge[locale]}
          </span>
          <h1 className="mt-4 text-3xl font-bold text-gray-900 md:text-5xl">
            {translations.title[locale]}
          </h1>
          <p className="mt-4 text-base leading-7 text-gray-700 md:text-lg">
            {translations.intro[locale]}
          </p>

          <div className="mt-8 rounded-2xl border border-primary/15 bg-white p-5 shadow-sm md:p-7">
            <h2 className="text-xl font-bold text-gray-900">
              {translations.powerTitle[locale]}
            </h2>
            <p className="mt-3 text-gray-700">{translations.powerText[locale]}</p>
            <h3 className="mt-5 text-lg font-semibold text-gray-900">
              {translations.whyTitle[locale]}
            </h3>
            <ul className="mt-3 space-y-3">
              {translations.whyItems[locale].map((item) => (
                <li key={item} className="flex items-start gap-2 text-gray-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 rounded-lg bg-secondary/10 p-4 text-sm font-medium text-gray-800">
              {translations.quote[locale]}
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-7">
            <h2 className="text-xl font-bold text-gray-900">
              {translations.processTitle[locale]}
            </h2>
            <ol className="mt-4 space-y-3">
              {translations.steps[locale].map((step, idx) => (
                <li key={step} className="flex items-start gap-3 text-gray-700">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>

            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-2 text-amber-900">
                <CircleHelp className="mt-0.5 h-4 w-4 shrink-0" />
                <p className="font-semibold">{translations.notes[locale]}</p>
              </div>
              <p className="mt-2 text-sm text-amber-900">
                <strong>{translations.dafLabel[locale]}:</strong> END0023
              </p>
              <p className="mt-1 text-sm text-amber-900">
                <strong>{translations.purposeLabel[locale]}:</strong>{" "}
                {translations.purposeValue[locale]}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-7">
            <h2 className="text-xl font-bold text-gray-900">
              {translations.amcfTitle[locale]}
            </h2>
            <p className="mt-3 text-gray-700">{translations.amcfText[locale]}</p>
          </div>

          <div className="mt-8 rounded-2xl border border-secondary/20 bg-secondary/5 p-5 md:p-7">
            <h2 className="text-xl font-bold text-gray-900">
              {translations.zakatTitle[locale]}
            </h2>
            <ul className="mt-4 space-y-3">
              {translations.zakatItems[locale].map((item) => (
                <li key={item} className="flex items-start gap-2 text-gray-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={amcfDonationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
              <Landmark className="h-4 w-4" />
              {translations.primaryCta[locale]}
            </a>
            <a
              href="mailto:nonprofitengage@amuslimcf.org"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50"
            >
              <Mail className="h-4 w-4" />
              {translations.secondaryCta[locale]}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
