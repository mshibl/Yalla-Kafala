import Link from "next/link";
import React from "react";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { socials } from "./constants";

/** The X mark, which lucide doesn't carry. */
const XMark = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const icons: Record<
  string,
  React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>
> = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  x: XMark,
};

const labels: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  x: "X",
};

const SocialList = () => {
  return (
    <div className="flex gap-3">
      {socials.map((social) => {
        const Icon = icons[social.name];
        return (
          <Link
            key={social.name}
            href={social.url}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.08] text-[#E9E4F0] transition-colors duration-300 hover:bg-primary hover:text-white"
            aria-label={`Yalla Kafala on ${labels[social.name] ?? social.name}`}
          >
            {Icon ? <Icon className="h-[18px] w-[18px]" aria-hidden /> : null}
          </Link>
        );
      })}
    </div>
  );
};

export default SocialList;
