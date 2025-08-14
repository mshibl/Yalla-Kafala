"use client";
import { LocaleProvider, type Locale } from "./LocaleProvider";
import { PostHogProvider } from "./PostHogProvider";
import { ConvexProvider, ConvexReactClient } from "convex/react";
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const Providers = ({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) => {
  return (
    <ConvexProvider client={convex}>
      <LocaleProvider locale={locale}>
        <PostHogProvider>{children}</PostHogProvider>
      </LocaleProvider>
    </ConvexProvider>
  );
};
