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
          className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors duration-300"
          aria-label={`Follow us on ${social.name}`}
        >
          <Image
            src={`/${social.name}.svg`}
            width={16}
            height={16}
            alt={social.name}
          />
        </Link>
      ))}
    </div>
  );
};

export default SocialList;
