"use client";
import Link from "next/link";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";
const LinksList = ({
  links,
  title,
}: {
  links: { href: string; text: string }[];
  title: string;
}) => {
  const [expand, setExpand] = useState(false);
  return (
    <>
      <h4
        className="font-semibold text-gray-300 mb-2 flex items-center cursor-pointer select-none"
        onClick={() => setExpand((prev) => !prev)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setExpand((prev) => !prev);
        }}
      >
        {title}
        <span className="ml-2">{expand ? <ChevronUp /> : <ChevronDown />}</span>
      </h4>
      {expand && (
        <ul className="ml-4 space-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-gray-400 hover:text-white transition-colors duration-300 inline-block"
              >
                {link.text}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default LinksList;
