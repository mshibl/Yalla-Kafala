import React from "react";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  locale: "en" | "ar";
}

export const Logo: React.FC<LogoProps> = ({ locale }) => {
  return (
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
      {locale === "en" ? (
        <span className="tracking-tight">Yallakafala</span>
      ) : (
        <span className="tracking-tight">يلا كفالة</span>
      )}
    </Link>
  );
};

export default Logo;
