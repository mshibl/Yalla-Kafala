import { type NextRequest, NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { clerkMiddleware } from "@clerk/nextjs/server";
import { volunteerFormUrl, brochurePdfUrl } from "@/constants/links";
import {
  DEFAULT_REGION,
  REGION_COOKIE,
  REGION_QUERY_PARAM,
  ROOT_DOMAIN,
  isApexHost,
  isRegion,
  regionFromCountry,
  regionFromHost,
  regionOrigin,
  type Region,
} from "@/lib/region";

// Define the locales we support
const locales = ["en", "ar"];
const defaultLocale = "en";

function getLocale(request: NextRequest) {
  const acceptLanguageHeader = request.headers.get("accept-language");
  if (!acceptLanguageHeader) return defaultLocale;

  const headers = { "accept-language": acceptLanguageHeader };
  const languages = new Negotiator({ headers }).languages();

  return match(languages, locales, defaultLocale);
}

const REGION_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * Which site version (eg = EGP-only, us = international) this request is for.
 * - eg./us.yallakafala.org: fixed by the host (never flips with IP/VPN).
 * - Previews / localhost: `?region=` query param, then the cookie, then DEFAULT_REGION.
 */
function resolveRegion(request: NextRequest, host: string): Region {
  const fromHost = regionFromHost(host);
  if (fromHost) return fromHost;
  const fromQuery = request.nextUrl.searchParams.get(REGION_QUERY_PARAM);
  if (isRegion(fromQuery)) return fromQuery;
  const fromCookie = request.cookies.get(REGION_COOKIE)?.value;
  if (isRegion(fromCookie)) return fromCookie;
  return DEFAULT_REGION;
}

/** Remember the last version used, so yallakafala.org sends people back to it. */
function rememberRegion(
  response: NextResponse,
  request: NextRequest,
  host: string,
  region: Region,
) {
  if (request.cookies.get(REGION_COOKIE)?.value === region) return response;
  response.cookies.set(REGION_COOKIE, region, {
    path: "/",
    maxAge: REGION_COOKIE_MAX_AGE,
    sameSite: "lax",
    // Share across eg./us. and the apex in production; host-only elsewhere.
    ...(regionFromHost(host)
      ? { domain: `.${ROOT_DOMAIN}`, secure: true }
      : {}),
  });
  return response;
}

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;
  const host = (request.headers.get("host") ?? "").split(":")[0] ?? "";

  // yallakafala.org -> eg. or us. (saved choice first, then visitor country).
  // 307 (temporary) so browsers don't cache it and a changed choice still applies.
  if (isApexHost(host) && !pathname.startsWith("/__clerk")) {
    const saved = request.cookies.get(REGION_COOKIE)?.value;
    const region = isRegion(saved)
      ? saved
      : regionFromCountry(request.headers.get("x-vercel-ip-country"));
    const target = new URL(
      `${pathname}${request.nextUrl.search}`,
      regionOrigin(region),
    );
    return NextResponse.redirect(target, 307);
  }

  const region = resolveRegion(request, host);

  // The internal /eg/... and /us/... trees are never public URLs.
  const internalRegionPrefix = pathname.match(/^\/(eg|us)(\/.*)?$/);
  if (internalRegionPrefix) {
    const newUrl = new URL(request.url);
    newUrl.pathname = internalRegionPrefix[2] ?? "/";
    return NextResponse.redirect(newUrl);
  }

  const legacyRedirects: Record<string, string> = {
    "/about_us": "/who-we-are",
    "/about-us": "/who-we-are",
    "/adoption_steps": "/kafala-steps",
    "/adoption-steps": "/kafala-steps",
    "/adoption_stories": "/kafala-blogs",
    "/adoption-stories": "/kafala-blogs",
    "/contact_us": "/",
    "/contact-us": "/",
    "/kafala-stories": "/kafala-blogs",
    "/yk-gala": "/",
  };

  for (const locale of locales) {
    legacyRedirects[`/${locale}/about_us`] = `/${locale}/who-we-are`;
    legacyRedirects[`/${locale}/about-us`] = `/${locale}/who-we-are`;
    legacyRedirects[`/${locale}/adoption_steps`] = `/${locale}/kafala-steps`;
    legacyRedirects[`/${locale}/adoption-steps`] = `/${locale}/kafala-steps`;
    legacyRedirects[`/${locale}/adoption_stories`] = `/${locale}/kafala-blogs`;
    legacyRedirects[`/${locale}/adoption-stories`] = `/${locale}/kafala-blogs`;
    legacyRedirects[`/${locale}/contact_us`] = `/${locale}`;
    legacyRedirects[`/${locale}/contact-us`] = `/${locale}`;
    legacyRedirects[`/${locale}/kafala-stories`] = `/${locale}/kafala-blogs`;
    legacyRedirects[`/${locale}/yk-gala`] = `/${locale}`;
  }

  const legacyDestination = legacyRedirects[pathname];
  if (legacyDestination) {
    return NextResponse.redirect(new URL(legacyDestination, request.url), 308);
  }

  // 1) Redirect brochure page to the PDF
  const isBrochurePath =
    pathname === "/adoption-process/brochure" ||
    locales.some(
      (locale) => pathname === `/${locale}/adoption-process/brochure`,
    );

  if (isBrochurePath) {
    return NextResponse.redirect(brochurePdfUrl);
  }

  // Handle URLs with underscores by converting them to dashes
  if (pathname.includes("_")) {
    const normalizedPathname = pathname.replace(/_/g, "-");
    const newUrl = new URL(request.url);
    newUrl.pathname = normalizedPathname;
    return NextResponse.redirect(newUrl);
  }

  const isVolunteerPath =
    pathname === "/volunteer" ||
    locales.some(
      (locale) =>
        pathname === `/${locale}/volunteer` ||
        pathname.startsWith(`/${locale}/volunteer/`),
    );

  if (isVolunteerPath) {
    return NextResponse.redirect(volunteerFormUrl);
  }

  if (pathname.startsWith("/admin/login")) {
    const { userId } = await auth();
    if (userId) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  // Root metadata routes from `app/sitemap.ts` / `app/robots.ts` — not under `/[locale]/`.
  if (pathname === "/sitemap.xml" || pathname === "/robots.txt") {
    return NextResponse.next();
  }

  // Legacy path rename: the public route used to be `kafala-stories` and was renamed to
  // `kafala-blogs`. Search Console, Google Tag coverage, and old inbound links may still use the
  // former URL. Permanent redirects send users and crawlers to the real page (where analytics
  // tags run) without listing obsolete URLs in the sitemap.
  const kafalaStoriesWithLocale = /^\/(en|ar)\/kafala-stories(\/.*)?$/;
  const legacyWithLocale = pathname.match(kafalaStoriesWithLocale);
  if (legacyWithLocale) {
    const [, locale, suffix] = legacyWithLocale;
    const newUrl = new URL(request.url);
    newUrl.pathname = `/${locale}/kafala-blogs${suffix ?? ""}`;
    return NextResponse.redirect(newUrl, 308);
  }

  const kafalaStoriesNoLocale = /^\/kafala-stories(\/.*)?$/;
  if (kafalaStoriesNoLocale.test(pathname)) {
    const suffix = pathname.slice("/kafala-stories".length);
    const locale = getLocale(request);
    const newUrl = new URL(request.url);
    newUrl.pathname = `/${locale}/kafala-blogs${suffix}`;
    return NextResponse.redirect(newUrl, 308);
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) {
    // Serve the region's pre-rendered tree (src/app/[region]/[locale]) without changing the URL.
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = `/${region}${pathname}`;
    return rememberRegion(
      NextResponse.rewrite(rewriteUrl),
      request,
      host,
      region,
    );
  }

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return rememberRegion(
    NextResponse.redirect(request.nextUrl),
    request,
    host,
    region,
  );
});

export const config = {
  matcher: [
    "/((?!_next|api|docs|robots\\.txt|sitemap\\.xml|favicon\\.ico|.*\\.(?:html|png|jpg|jpeg|gif|webp|svg|pdf|txt|xml|ico)).*)",
    "/__clerk/:path*",
  ],
};
