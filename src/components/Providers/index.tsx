"use client";
import { LocaleProvider, type Locale } from "./LocaleProvider";
import { PostHogProvider } from "./PostHogProvider";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { CouncilProviders } from "./CouncilProviders";
import { councilTestMode } from "@/lib/councilTestMode";
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const Providers = ({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) => {
  // The design council and the bug sweep: a local backend, no Clerk.
  if (councilTestMode()) {
    return <CouncilProviders locale={locale}>{children}</CouncilProviders>;
  }
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <LocaleProvider locale={locale}>
          <PostHogProvider>{children}</PostHogProvider>
        </LocaleProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};
