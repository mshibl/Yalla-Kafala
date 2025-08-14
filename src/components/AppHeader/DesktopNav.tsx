import React from "react";
import Link from "next/link";
import { navigationLinks } from "@/components/AppFooter/constants";
import LanguageSwitcher from "./LanguageSwitcher";

interface DesktopNavProps {
  locale: "en" | "ar";
  onSwitchLanguage: () => void;
}

export const DesktopNav: React.FC<DesktopNavProps> = ({
  locale,
  onSwitchLanguage,
}) => {
  return (
    <nav className="hidden lg:flex items-center gap-6">
      {navigationLinks.map((item) =>
        item.group ? (
          <div className="relative group" key={item.group.en}>
            <span className="text-gray-700 hover:text-primary transition-colors duration-300 font-medium cursor-pointer">
              {item.group[locale]}
            </span>
            <div className="absolute left-0 mt-2 w-56 bg-white shadow-lg rounded-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              {item.links.map((link) => (
                <Link
                  key={link.href}
                  href={`/${locale}${link.href}`}
                  className="block px-4 py-2 text-gray-700 hover:bg-primary hover:text-white transition-colors duration-200"
                >
                  {link.text[locale]}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <Link
            key={item.href}
            href={`/${locale}${item.href}`}
            className="text-gray-700 hover:text-primary transition-colors duration-300 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
          >
            {item.text[locale]}
          </Link>
        ),
      )}

      {/* Language Switcher */}
      <div className="ml-4">
        <LanguageSwitcher locale={locale} onSwitchLanguage={onSwitchLanguage} />
      </div>
    </nav>
  );
};

export default DesktopNav;
