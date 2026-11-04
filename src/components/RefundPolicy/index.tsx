import { Mail, MapPin, Phone } from "lucide-react";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { officialContact, hasOfficialPhone } from "@/constants/contact";
import { LAST_UPDATED, translations } from "./translations";

export default function RefundPolicy({ locale }: { locale: Locale }) {
  const t = translations[locale];
  const dir = locale === "ar" ? "rtl" : "ltr";
  const formattedDate = new Date(LAST_UPDATED).toLocaleDateString(
    locale === "ar" ? "ar-EG" : "en-GB",
    { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" },
  );

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-primary/5 to-white"
      dir={dir}
    >
      <section className="px-4 pt-28 pb-8 md:pt-36 text-center">
        <h1 className="mb-3 text-4xl font-bold text-gray-900 sm:text-5xl">
          {t.title}
        </h1>
        <p className="text-sm text-gray-500">
          {t.lastUpdated}: {formattedDate}
        </p>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <div className="mx-auto max-w-3xl space-y-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
          <p className="text-gray-700 leading-relaxed">{t.intro}</p>

          {t.sections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900">
                {section.title}
              </h2>
              {section.body?.map((p) => (
                <p key={p} className="text-gray-700 leading-relaxed">
                  {p}
                </p>
              ))}
              {section.items && (
                <ul className="list-disc space-y-2 ps-6 text-gray-700">
                  {section.items.map((item) => (
                    <li key={item} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div id="contact" className="space-y-3 border-t border-gray-100 pt-8">
            <h2 className="text-xl font-bold text-gray-900">
              {t.contactTitle}
            </h2>
            <p className="text-gray-700">{t.contactIntro}</p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <Mail className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <span>
                  <span className="font-medium">{t.emailLabel}: </span>
                  <a
                    href={`mailto:${officialContact.email}`}
                    className="text-primary hover:underline"
                    dir="ltr"
                  >
                    {officialContact.email}
                  </a>
                </span>
              </li>
              {hasOfficialPhone && (
                <li className="flex items-start gap-3">
                  <Phone className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <span>
                    <span className="font-medium">{t.phoneLabel}: </span>
                    <a
                      href={`tel:${officialContact.phone}`}
                      className="text-primary hover:underline"
                      dir="ltr"
                    >
                      {officialContact.phone}
                    </a>
                  </span>
                </li>
              )}
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <span>
                  <span className="font-medium">{t.addressLabel}: </span>
                  <a
                    href={officialContact.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {officialContact.address[locale]}
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
