"use client";
import { useEffect } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { LocaleProvider, type Locale } from "./LocaleProvider";
import { COUNCIL_IDENTITY } from "@/lib/councilTestMode";

/** `setAdminAuth` exists on the client but is not in its public types. */
type AdminAuthClient = {
  setAdminAuth(key: string, identity: typeof COUNCIL_IDENTITY): void;
};

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/**
 * The providers in council test mode (src/lib/councilTestMode.ts): no Clerk and
 * no analytics. In /admin, once /api/council/login has set the cookie, the
 * Convex client acts as the fixed test admin of the throwaway local backend, so
 * the admin mutations pass their `getUserIdentity()` check.
 */
export const CouncilProviders = ({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) => {
  useEffect(() => {
    if (!window.location.pathname.startsWith("/admin")) return;
    void fetch("/api/council/session")
      .then((r) => (r.ok ? (r.json() as Promise<{ adminKey?: string }>) : null))
      .then((body) => {
        if (body?.adminKey)
          (convex as unknown as AdminAuthClient).setAdminAuth(
            body.adminKey,
            COUNCIL_IDENTITY,
          );
      })
      .catch(() => undefined);
  }, []);

  return (
    <ConvexProvider client={convex}>
      <LocaleProvider locale={locale}>{children}</LocaleProvider>
    </ConvexProvider>
  );
};
