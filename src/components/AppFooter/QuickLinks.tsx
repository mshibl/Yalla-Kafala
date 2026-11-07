import Link from "next/link";
import React from "react";
import { navigationLinks } from "./constants";
import type { Locale } from "../Providers/LocaleProvider";
import DonateNowModal from "@/components/Donate/DonateNowModal";
import { givebutterDonationUrl, volunteerFormUrl } from "@/constants/links";

const linkClass =
  "text-gray-300 hover:text-white transition-colors duration-300 inline-block";

const href = (locale: Locale, path: string) =>
  path.startsWith("http") ? path : `/${locale}${path}`;

/** The site's links as flat, titled lists: Explore Kafala, then About Us with the rest. */
const QuickLinks = ({ locale }: { locale: Locale }) => {
  const groups = navigationLinks.filter((item) => item.group);
  const singles = navigationLinks.filter(
    (item) => !item.group && item.href !== "/",
  );

  return (
    <>
      {groups.map((group, groupIndex) => (
        <div key={group.group!.en}>
          <h3 className="mb-4 font-sans text-sm font-semibold uppercase tracking-wider text-white">
            {group.group![locale]}
          </h3>
          <ul className="space-y-3">
            {group.links!.map((link) => (
              <li key={link.href}>
                <Link href={href(locale, link.href)} className={linkClass}>
                  {link.text[locale]}
                </Link>
              </li>
            ))}
            {groupIndex === groups.length - 1 && (
              <>
                {singles.map((item) => (
                  <li key={item.href}>
                    {item.href === givebutterDonationUrl ? (
                      <DonateNowModal locale={locale} className={linkClass}>
                        {item.text![locale]}
                      </DonateNowModal>
                    ) : (
                      <Link
                        href={href(locale, item.href!)}
                        className={linkClass}
                      >
                        {item.text![locale]}
                      </Link>
                    )}
                  </li>
                ))}
                <li>
                  <Link
                    href={volunteerFormUrl}
                    target="_blank"
                    className={linkClass}
                  >
                    {locale === "en" ? "Volunteer" : "التطوع"}
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      ))}
    </>
  );
};

export default QuickLinks;
