import React from "react";
import { X, ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { navigationLinks } from "@/components/AppFooter/constants";
import LanguageSwitcher from "./LanguageSwitcher";
import type { Locale } from "../Providers/LocaleProvider";

interface MobileNavProps {
  locale: Locale;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onSwitchLanguage: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  locale,
  mobileMenuOpen,
  setMobileMenuOpen,
  onSwitchLanguage,
}) => {
  const [aboutUsOpen, setAboutUsOpen] = React.useState(false);
  const [exploreKafalaOpen, setExploreKafalaOpen] = React.useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden text-gray-700 z-50"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "fixed inset-0 bg-white/95 backdrop-blur-lg z-40 flex flex-col p-10 transition-all duration-300 ease-in-out lg:hidden",
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
      >
        <div className="flex flex-col items-center justify-center space-y-6 h-full">
          {/* Navigation Links (Mobile) */}
          {navigationLinks.map((item, idx) =>
            item.group ? (
              <div
                key={item.group.en}
                className={cn(
                  "w-full flex flex-col items-center",
                  "transform transition-all duration-300",
                  mobileMenuOpen
                    ? "translate-x-0 opacity-100"
                    : "translate-x-10 opacity-0",
                )}
                style={{
                  transitionDelay: mobileMenuOpen
                    ? `${50 + idx * 50}ms`
                    : "0ms",
                }}
              >
                <button
                  className="flex items-center gap-2 text-xl text-gray-800 font-medium hover:text-primary transition-all duration-300 focus:outline-none"
                  onClick={() => {
                    if (item.group.en === "Explore Kafala")
                      setExploreKafalaOpen((open) => !open);
                    if (item.group.en === "About Us")
                      setAboutUsOpen((open) => !open);
                  }}
                  aria-expanded={
                    item.group.en === "Explore Kafala"
                      ? exploreKafalaOpen
                      : aboutUsOpen
                  }
                  aria-controls={`${item.group.en.toLowerCase().replace(/\s/g, "-")}-mobile-links`}
                  type="button"
                >
                  <span className="font-semibold">{item.group[locale]}</span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 transition-transform duration-300",
                      (
                        item.group.en === "Explore Kafala"
                          ? exploreKafalaOpen
                          : aboutUsOpen
                      )
                        ? "rotate-180"
                        : "rotate-0",
                    )}
                    aria-hidden="true"
                  />
                </button>
                <div
                  id={`${item.group.en.toLowerCase().replace(/\s/g, "-")}-mobile-links`}
                  className={cn(
                    "flex flex-col items-center space-y-2 overflow-hidden transition-all duration-300",
                    (
                      item.group.en === "Explore Kafala"
                        ? exploreKafalaOpen
                        : aboutUsOpen
                    )
                      ? "max-h-60 mt-2 opacity-100"
                      : "max-h-0 opacity-0",
                  )}
                  aria-hidden={
                    !(item.group.en === "Explore Kafala"
                      ? exploreKafalaOpen
                      : aboutUsOpen)
                  }
                >
                  {item.links.map((link) => (
                    <Link
                      key={link.href}
                      href={`/${locale}${link.href}`}
                      className="text-base text-gray-700 hover:text-primary transition-colors"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        if (item.group.en === "Explore Kafala")
                          setExploreKafalaOpen(false);
                        if (item.group.en === "About Us") setAboutUsOpen(false);
                      }}
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
                className={cn(
                  "text-xl text-gray-800 font-medium hover:text-primary transition-all duration-300",
                  "transform transition-all duration-300",
                  mobileMenuOpen
                    ? "translate-x-0 opacity-100"
                    : "translate-x-10 opacity-0",
                )}
                style={{
                  transitionDelay: mobileMenuOpen
                    ? `${125 + idx * 25}ms`
                    : "0ms",
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.text[locale]}
              </Link>
            ),
          )}

          {/* Language Switcher for Mobile */}
          <div
            className={cn(
              "w-full flex flex-col items-center",
              "transform transition-all duration-300",
              mobileMenuOpen
                ? "translate-x-0 opacity-100"
                : "translate-x-10 opacity-0",
            )}
            style={{ transitionDelay: mobileMenuOpen ? "275ms" : "0ms" }}
          >
            <LanguageSwitcher
              locale={locale}
              isMobile={true}
              onSwitchLanguage={onSwitchLanguage}
            />
          </div>

          <Link
            target="_blank"
            href={`https://givebutter.com/c/YKgala2025`}
            className={cn(
              "primary-button mt-4",
              "transform transition-all duration-300",
              mobileMenuOpen
                ? "translate-x-0 opacity-100"
                : "translate-x-10 opacity-0",
            )}
            style={{ transitionDelay: mobileMenuOpen ? "300ms" : "0ms" }}
            onClick={() => setMobileMenuOpen(false)}
          >
            {locale === "en" ? "Donate Now" : "تبرع الآن"}
          </Link>
        </div>
      </div>
    </>
  );
};

export default MobileNav;
