import Link from "next/link";
import React from "react";
import { contactItems } from "./constants";
import type { Locale } from "../Providers/LocaleProvider";
import { translations } from "./translations";

export const ContactList = ({ locale }: { locale: Locale }) => {
  return (
    <div>
      <h3 className="text-lg font-bold mb-4">
        {translations.contactUs[locale]}
      </h3>
      <ul className="space-y-4">
        {contactItems.map((item) => (
          <li className="flex items-start gap-3" key={item.href}>
            <item.icon className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <Link
              href={item.href}
              className="text-gray-400 hover:text-white transition-colors duration-300 inline-block"
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
