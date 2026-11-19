import React from "react";
import { cn } from "@/lib/utils";

/**
 * The header every page without a hero photo uses: eyebrow, title and a
 * lede, aligned to the start like the Explore heroes (ExploreKafalaHero).
 */
export const PageHeader = ({
  eyebrow,
  title,
  lede,
  children,
  className,
  width = "max-w-6xl",
}: {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  lede?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  /** The width of the content below, so the header lines up with it. */
  width?: string;
}) => (
  <div className={cn("mx-auto text-start", width, className)}>
    <span className="eyebrow mb-4 block">{eyebrow}</span>
    <h1 className="max-w-[18ch] text-[2.125rem] font-semibold leading-[1.1] text-gray-900 md:text-5xl">
      {title}
    </h1>
    {lede && (
      <p className="mt-5 max-w-[640px] text-lg leading-relaxed text-gray-700 md:text-xl">
        {lede}
      </p>
    )}
    {children}
  </div>
);

export default PageHeader;
