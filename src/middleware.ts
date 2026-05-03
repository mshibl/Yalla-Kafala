import { type NextRequest, NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { getSessionCookie } from "better-auth/cookies";
import { volunteerFormUrl, brochurePdfUrl } from "@/constants/links";

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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
    const sessionCookie = getSessionCookie(request);
    if (sessionCookie) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const sessionCookie = getSessionCookie(request);
    if (!sessionCookie) {
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

  if (pathnameHasLocale) return NextResponse.next();

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    "/((?!_next|api|docs|robots\\.txt|sitemap\\.xml|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|pdf|txt|xml|ico)).*)",
  ],
};
