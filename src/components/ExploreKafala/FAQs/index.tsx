import type { Locale } from "@/components/Providers/LocaleProvider";
import FAQsHeader from "./FAQsHeader";
import FAQsAccordion from "./FAQsAccordion";
import { Mail } from "lucide-react";

const StillHaveQuestion = ({ locale }: { locale: Locale }) => (
  <div className="mx-auto mt-12 flex max-w-3xl flex-col items-center gap-4 rounded-3xl bg-primary px-6 py-8 text-center text-white sm:flex-row sm:justify-between sm:text-start md:px-10">
    <div>
      <h2 className="mb-1 text-2xl font-semibold text-white">
        {locale === "en" ? "Still have a question?" : "لديك سؤال آخر؟"}
      </h2>
      <p className="text-white/85">
        {locale === "en"
          ? "Write to us and our team will answer."
          : "راسلنا وسيجيبك فريقنا."}
      </p>
    </div>
    <a
      href="mailto:info@yallakafala.org"
      className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-primary transition-colors hover:bg-white/90"
    >
      <Mail className="h-4 w-4" aria-hidden="true" />
      info@yallakafala.org
    </a>
  </div>
);

const FAQs = ({ locale }: { locale: Locale }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow bg-gradient-to-b from-primary/[0.06] to-white pt-24 md:pt-32">
        <section className="py-10 md:py-14">
          <div className="container mx-auto px-6">
            <FAQsHeader locale={locale} />
            <FAQsAccordion locale={locale} />
            <StillHaveQuestion locale={locale} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default FAQs;
