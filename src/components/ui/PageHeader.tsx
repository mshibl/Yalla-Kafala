import React from "react";
import { cn } from "@/lib/utils";

/**
 * The header every page without a hero photo uses: eyebrow, title and a
 * lede, centred. Pages with a photo use the same parts
 * (ExploreKafalaHero), aligned to the start.
 */
export const PageHeader = ({
  eyebrow,
  title,
  lede,
  children,
  className,
}: {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  lede?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("mx-auto max-w-3xl text-center", className)}>
    <span className="eyebrow mb-4">{eyebrow}</span>
    <h1 className="text-[2.125rem] font-semibold leading-[1.1] text-gray-900 md:text-5xl">
      {title}
    </h1>
    {lede && (
      <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-700 md:text-xl">
        {lede}
      </p>
    )}
    {children}
  </div>
);

export default PageHeader;
