"use client";
import { LocaleProvider, type Locale } from "./LocaleProvider";
import { PostHogProvider } from "./PostHogProvider";
import { RegionProvider } from "./RegionProvider";
import type { Region } from "@/lib/region";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { CouncilProviders } from "./CouncilProviders";
import { councilTestMode } from "@/lib/councilTestMode";
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const Providers = ({
  children,
  locale,
  region,
}: {
  children: React.ReactNode;
  locale: Locale;
  region: Region;
}) => {
  // The design council and the bug sweep: a local backend, no Clerk.
  if (councilTestMode()) {
    return <CouncilProviders locale={locale}>{children}</CouncilProviders>;
  }
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <LocaleProvider locale={locale}>
          <RegionProvider region={region}>
            <PostHogProvider>{children}</PostHogProvider>
          </RegionProvider>
        </LocaleProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};
