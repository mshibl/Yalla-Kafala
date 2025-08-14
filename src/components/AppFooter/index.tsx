import Link from "next/link";
import Image from "next/image";
import { NewsletterForm } from "../NewsletterForm";
import ContactList from "./ContactList";
import QuickLinks from "./QuickLinks";
import SocialList from "./SocialList";
import type { Locale } from "../Providers/LocaleProvider";
import { translations } from "./translations";
import { MakeDifference } from "../Homepage/MakeDifference";
const Footer = ({ locale }: { locale: Locale }) => {
  return (
    <>
      {/* <MakeDifference locale={locale} /> */}
      <footer id="contact" className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="space-y-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-xl md:text-2xl font-serif font-bold text-primary"
              >
                <Image
                  src="/images/yk_logo.svg"
                  alt="Yallakafala Logo"
                  width={36}
                  height={36}
                />{" "}
                <span className="tracking-tight text-white">
                  {locale === "en" ? "Yallakafala" : "يلا كفالة"}
                </span>
              </Link>
              <p className="text-gray-400">
                {translations.socialsParagraph[locale]}
              </p>
              <SocialList />
              <Link href="https://www.guidestar.org/profile/85-3323627">
                <Image
                  src="/GuideStarIcon_Platinum.svg"
                  alt="GuideStar Platinum Level"
                  width={100}
                  height={100}
                />
              </Link>
            </div>
            <QuickLinks locale={locale} />
            <ContactList locale={locale} />
            <NewsletterForm
              title={translations.newsletterTitle[locale]}
              description={translations.newsletterDescription[locale]}
            />
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
            <p>
              {translations.rightsReserved[locale]} <br />
              &copy; {new Date().getFullYear()}{" "}
              {translations.copyrightName[locale]}.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
