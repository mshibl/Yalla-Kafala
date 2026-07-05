"use client";

import { Heart, Copy, Check, Smartphone, CreditCard, Landmark } from "lucide-react";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { givebutterDonationUrl } from "@/constants/links";
import React from "react";

const copy = {
  en: {
    title: "Support Yalla Kafala",
    subtitle:
      "Your generous donation helps connect children without parental care with loving families in Egypt.",
    button: "Donate Now",
    taxNote:
      "Yalla Kafala is a 501(c)(3) organization. All donations are tax-deductible.",
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
      "يلا كفالة منظمة 501(c)(3). جميع التبرعات معفاة من الضرائب.",
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
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-100",
  },
  {
    key: "fawry" as const,
    icon: CreditCard,
    account: "100053734485",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-100",
  },
  {
    key: "bank" as const,
    icon: Landmark,
    account: "100053734857",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-100",
  },
];

const titleKeys = {
  vodafone: "vodafoneTitle",
  fawry: "fawryTitle",
  bank: "bankTitle",
} as const;

function CopyButton({
  text,
  locale,
}: {
  text: string;
  locale: Locale;
}) {
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
      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-all hover:border-primary/40 hover:text-primary active:scale-95"
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white" dir={dir}>
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-4 pt-28 pb-12 md:pt-36 md:pb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl">
          {t.title}
        </h1>
        <p className="mx-auto mb-8 max-w-lg text-lg text-gray-600">
          {t.subtitle}
        </p>
      </section>

      {/* Donation Methods */}
      <section className="container mx-auto px-4 pb-20">
        <div className="mx-auto max-w-4xl space-y-10">
          {/* Online Donation (Givebutter) */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col items-center text-center md:flex-row md:text-start md:items-start md:gap-6">
              <div className="mb-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 md:mb-0">
                <Heart className="h-7 w-7 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {t.donateOnline}
                </h2>
                <p className="text-gray-600 mb-4">{t.donateOnlineDesc}</p>
                <a
                  href={givebutterDonationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="primary-button inline-flex items-center gap-2 px-6 py-3 text-base font-semibold"
                >
                  <Heart className="h-4 w-4" />
                  {t.button}
                </a>
                <p className="mt-3 text-xs text-gray-500">{t.taxNote}</p>
              </div>
            </div>
          </div>

          {/* Egypt Donation Methods */}
          <div id="egypt" className="scroll-mt-28">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-6 text-center md:text-start">
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {t.donateInEgypt}
                </h2>
                <p className="text-gray-600">{t.donateInEgyptDesc}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {egyptMethods.map((method) => (
                  <div
                    key={method.key}
                    className={`rounded-xl border ${method.borderColor} ${method.bgColor} p-5 transition-shadow hover:shadow-md`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm`}
                      >
                        <method.icon className={`h-5 w-5 ${method.color}`} />
                      </div>
                      <h3 className="font-semibold text-gray-900">
                        {t[titleKeys[method.key]]}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {t.accountNumber}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <code className="rounded-md bg-white px-3 py-1.5 text-sm font-mono font-semibold text-gray-800 shadow-sm" dir="ltr">
                          {method.account}
                        </code>
                        <CopyButton text={method.account} locale={locale} />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{t.bank}</p>
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
