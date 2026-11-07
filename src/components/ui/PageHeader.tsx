import React from "react";
import { cn } from "@/lib/utils";

/**
 * The header every page without a hero photo uses: eyebrow, title, a short
 * gold rule and a lede, centred. Pages with a photo use the same parts
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
    <h1 className="text-4xl font-semibold leading-[1.1] text-gray-900 md:text-5xl lg:text-6xl">
      {title}
    </h1>
    <div className="mx-auto my-6 h-1 w-16 rounded-full bg-accent" />
    {lede && (
      <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-700 md:text-xl">
        {lede}
      </p>
    )}
    {children}
  </div>
);

export default PageHeader;
