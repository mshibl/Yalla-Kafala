import Link from "next/link";
import React from "react";
import { getContactItems } from "./constants";
import type { Region } from "@/lib/region";
import { volunteerFormUrl } from "@/constants/links";
import type { Locale } from "../Providers/LocaleProvider";
import { translations } from "./translations";

export const ContactList = ({
  locale,
  region,
}: {
  locale: Locale;
  region: Region;
}) => {
  return (
    <div>
      <h3 className="mb-4 font-sans text-sm font-semibold uppercase tracking-wider text-white">
        {translations.contactUs[locale]}
      </h3>
      <ul className="space-y-4">
        {getContactItems(region)
          .filter((item) => item.href !== volunteerFormUrl)
          .map((item) => (
            <li className="flex items-start gap-3" key={item.href}>
              <item.icon className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <Link
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors duration-300 inline-block"
                {...("ltr" in item && item.ltr ? { dir: "ltr" } : {})}
              >
                {item.text[locale]}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ContactList;
