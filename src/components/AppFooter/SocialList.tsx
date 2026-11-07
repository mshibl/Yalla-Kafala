import Link from "next/link";
import React from "react";
import Image from "next/image";
import { socials } from "./constants";

const SocialList = () => {
  return (
    <div className="flex gap-4">
      {socials.map((social) => (
        <Link
          key={social.name}
          href={social.url}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.08] transition-colors duration-300 hover:bg-primary"
          aria-label={`Follow us on ${social.name}`}
        >
          <Image
            src={`/${social.name}.svg`}
            width={18}
            height={18}
            alt=""
            className="brightness-0 invert"
          />
        </Link>
      ))}
    </div>
  );
};

export default SocialList;
