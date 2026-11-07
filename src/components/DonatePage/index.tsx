"use client";

import {
  Heart,
  Copy,
  Check,
  CheckCircle2,
  Lock,
  Smartphone,
  CreditCard,
  Landmark,
} from "lucide-react";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { givebutterDonationUrl } from "@/constants/links";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import { isolateLatin } from "@/lib/bidi";

const copy = {
  en: {
    title: "Support Yalla Kafala",
    subtitle:
      "Your generous donation helps connect children without parental care with loving families in Egypt.",
    button: "Donate Now",
    taxNote:
      "For US donors: Yalla Kafala is a 501(c)(3) organization, so donations are tax-deductible.",
    eyebrow: "Donate",
    supportsTitle: "Your gift supports",
    supports: [
      "Training and support for kafala families",
      "Psychological and social support for mothers and families",
      "Beit Sagheer, our small family homes for children",
    ],
    secure: "Secure payment through Givebutter",
    transparency: "Candid Platinum Seal of Transparency, 2024.",
    reports: "Read our reports",
    donateOnline: "Donate Online",
    donateOnlineDesc:
      "Make a fast, secure donation via Givebutter using your credit card or bank account.",
    donateInEgypt: "Donate in Egypt",
    donateInEgyptDesc:
      "Support us locally through one of the following payment methods. All accounts are with CIB (Commercial International Bank).",
    vodafoneTitle: "Vodafone Cash",
    fawryTitle: "Fawry",
    bankTitle: "Bank Transfer (CIB)",
    accountNumber: "Account Number",
    bank: "Bank: CIB",
    copied: "Copied!",
    copyToClipboard: "Copy",
  },
  ar: {
    title: "ادعم يلا كفالة",
    subtitle:
      "تبرعك السخي يساعد في ربط الأطفال فاقدي الرعاية الوالدية بعائلات محبة في مصر.",
    button: "تبرّع الآن",
    taxNote:
      "للمتبرعين في الولايات المتحدة: يلا كفالة منظمة 501(c)(3)، والتبرعات معفاة من الضرائب.",
    eyebrow: "تبرّع",
    supportsTitle: "تبرعك يدعم",
    supports: [
      "تدريب ودعم الأسر الكافلة",
      "الدعم النفسي والاجتماعي للأمهات والأسر",
      "بيت صغير، بيوتنا الصغيرة للأطفال",
    ],
    secure: "دفع آمن عبر Givebutter",
    transparency: "ختم الشفافية البلاتيني من Candid لعام 2024.",
    reports: "اقرأ تقاريرنا",
    donateOnline: "تبرع إلكترونياً",
    donateOnlineDesc:
      "تبرع سريع وآمن عبر Givebutter باستخدام بطاقتك الائتمانية أو حسابك البنكي.",
    donateInEgypt: "تبرع في مصر",
    donateInEgyptDesc:
      "ادعمنا محلياً من خلال إحدى طرق الدفع التالية. جميع الحسابات في بنك CIB (البنك التجاري الدولي).",
    vodafoneTitle: "فودافون كاش",
    fawryTitle: "فوري",
    bankTitle: "تحويل بنكي (CIB)",
    accountNumber: "رقم الحساب",
    bank: "البنك: CIB",
    copied: "تم النسخ!",
    copyToClipboard: "نسخ",
  },
};

const egyptMethods = [
  {
    key: "vodafone" as const,
    icon: Smartphone,
    account: "100053734809",
  },
  {
    key: "fawry" as const,
    icon: CreditCard,
    account: "100053734485",
  },
  {
    key: "bank" as const,
    icon: Landmark,
    account: "100053734857",
  },
];

const titleKeys = {
  vodafone: "vodafoneTitle",
  fawry: "fawryTitle",
  bank: "bankTitle",
} as const;

function CopyButton({ text, locale }: { text: string; locale: Locale }) {
  const [copied, setCopied] = React.useState(false);
  const t = copy[locale];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 text-sm font-medium text-gray-600 transition-all hover:border-primary/40 hover:text-primary active:scale-95"
      type="button"
    >
      {copied ? (
        <>
          <Check className="h-3 w-3 text-emerald-500" />
          <span className="text-emerald-600">{t.copied}</span>
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          {t.copyToClipboard}
        </>
      )}
    </button>
  );
}

export default function DonatePage({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const dir = locale === "ar" ? "rtl" : "ltr";
  // Arabic: every Latin run set apart. English: keep "501(c)(3)" on one line.
  const bidi = (text: string): React.ReactNode =>
    locale === "ar"
      ? isolateLatin(text)
      : text.split("501(c)(3)").flatMap((part, index) =>
          index === 0
            ? [part]
            : [
                <span key={index} className="whitespace-nowrap">
                  501(c)(3)
                </span>,
                part,
              ],
        );

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-primary/[0.06] to-white"
      dir={dir}
    >
      {/* Hero */}
      <section className="px-6 pt-28 pb-10 md:pt-36 md:pb-14">
        <PageHeader
          width="max-w-4xl"
          eyebrow={t.eyebrow}
          title={t.title}
          lede={t.subtitle}
        />
      </section>

      {/* Donation Methods */}
      <section className="container mx-auto px-6 pb-20">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Online Donation (Givebutter) */}
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-primary/10">
            <div className="grid md:grid-cols-5">
              <div className="p-6 md:col-span-3 md:p-10">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Heart className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h2 className="mb-2 text-2xl font-semibold text-gray-900 md:text-3xl">
                  {t.donateOnline}
                </h2>
                <p className="mb-6 text-gray-700">{bidi(t.donateOnlineDesc)}</p>
                <a
                  href={givebutterDonationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="primary-button w-full gap-2 px-7 py-3.5 text-base font-semibold sm:w-auto"
                >
                  <Heart className="h-4 w-4" aria-hidden="true" />
                  {t.button}
                </a>
                <p className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <Lock
                    className="h-4 w-4 shrink-0 text-secondary-dark"
                    aria-hidden="true"
                  />
                  {bidi(t.secure)}
                </p>
                <p className="mt-1 text-sm text-gray-600">{bidi(t.taxNote)}</p>
              </div>
              <div className="bg-[#FBF8F4] p-6 md:col-span-2 md:p-10">
                <h3 className="mb-4 font-sans text-sm font-semibold uppercase tracking-wider text-gray-900">
                  {t.supportsTitle}
                </h3>
                <ul className="space-y-4">
                  {t.supports.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-gray-800"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex items-center gap-4 rounded-2xl bg-white p-4">
                  <Image
                    src="/GuideStarIcon_Platinum.svg"
                    alt="Candid Platinum Transparency 2024"
                    width={56}
                    height={56}
                    className="shrink-0 rounded-md"
                  />
                  <p className="text-sm leading-relaxed text-gray-700">
                    {t.transparency}{" "}
                    <Link
                      href={`/${locale}/resources`}
                      className="font-semibold text-primary underline-offset-4 hover:underline"
                    >
                      {t.reports}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Egypt Donation Methods */}
          <div id="egypt" className="scroll-mt-28">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-primary/10 md:p-10">
              <div className="mb-6 text-center md:text-start">
                <h2 className="mb-2 text-2xl font-semibold text-gray-900 md:text-3xl">
                  {t.donateInEgypt}
                </h2>
                <p className="text-gray-700">{bidi(t.donateInEgyptDesc)}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {egyptMethods.map((method) => (
                  <div
                    key={method.key}
                    className="rounded-2xl border border-[#EDE4EF] bg-white p-5"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <method.icon
                          className="h-5 w-5 text-primary"
                          aria-hidden="true"
                        />
                      </div>
                      <h3 className="font-sans text-base font-semibold text-gray-900">
                        {t[titleKeys[method.key]]}
                      </h3>
                    </div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-600">
                      {t.accountNumber}
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className="text-lg font-semibold tabular-nums tracking-wide text-gray-900"
                        dir="ltr"
                      >
                        {method.account}
                      </span>
                      <CopyButton text={method.account} locale={locale} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
