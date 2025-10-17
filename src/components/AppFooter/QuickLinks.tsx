import Link from "next/link";
import React from "react";
import LinksList from "./LinksList";
import { navigationLinks } from "./constants";
import type { Locale } from "../Providers/LocaleProvider";
import { translations } from "./translations";
const QuickLinks = ({ locale }: { locale: Locale }) => {
  return (
    <div>
      <h3 className="text-lg font-bold mb-4">
        {translations.quickLinks[locale]}
      </h3>
      <ul className="space-y-3">
        {navigationLinks.map((item, idx) =>
          item.group ? (
            <li key={`${item.group}-${idx}`}>
              <LinksList
                title={item.group[locale]}
                links={item.links.map((link) => ({
                  href: `/${locale}${link.href}`,
                  text: link.text[locale],
                }))}
              />
            </li>
          ) : (
            <li key={`${item.href}-${idx}`}>
              <Link
                target={`${item.href.includes("http") ? "_blank" : ""}`}
                href={`${item.href.includes("http") ? item.href : `/${locale}${item.href}`}`}
                className="text-gray-400 hover:text-white transition-colors duration-300 inline-block"
              >
                {item.text[locale]}
              </Link>
            </li>
          ),
        )}
      </ul>
    </div>
  );
};

export default QuickLinks;
