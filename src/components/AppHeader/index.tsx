"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import type { Locale } from "@/components/Providers/LocaleProvider";
import Logo from "./Logo";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import DonateNowModal from "@/components/Donate/DonateNowModal";

const Navbar = ({ locale }: { locale: Locale }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSwitchLanguage = () => {
    const newLocale = locale === "en" ? "ar" : "en";
    const updatedPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(updatedPathname);
  };

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled && !mobileMenuOpen
          ? "bg-white/90 backdrop-blur-md py-3 shadow-md"
          : "bg-transparent py-6",
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Logo locale={locale} />

        <DesktopNav locale={locale} onSwitchLanguage={handleSwitchLanguage} />

        <div className="flex items-center gap-4 lg:hidden">
          <DonateNowModal
            locale={locale}
            className="inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-white shadow-sm"
          >
            {locale === "en" ? "Donate" : "تبرع"}
          </DonateNowModal>
          <MobileNav
            locale={locale}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            onSwitchLanguage={handleSwitchLanguage}
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
