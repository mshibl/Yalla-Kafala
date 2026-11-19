import { join } from "node:path";
import { chromium, type Page } from "playwright";
import {
  type Lookup,
  type Screen,
  type Shot,
  shotPath,
  shotsFor,
} from "./designCouncil";

/**
 * The design council's camera (scripts/design-council.ts): signs in through
 * the test-only login (GET /api/council/login, council test mode only) where
 * a screen needs the admin, and photographs every screen. Uses Playwright as
 * a library, not the test runner: no specs, no assertions. The browser is the
 * owner's one-time install (`pnpm exec playwright install chromium`), or a
 * Chromium named by PLAYWRIGHT_CHROMIUM_EXECUTABLE.
 */

/** Phones at 2× so small text stays legible to the reviewers. */
const scaleFor = (width: number) => (width < 768 ? 2 : 1);
/** A screen taller than this is cut: the reviewers judge the top of it. */
const MAX_HEIGHT = 2400;

/** How tall the page is, counting what inner scroll areas hide. */
function contentHeight(): number {
  let height = document.documentElement.scrollHeight;
  for (const el of document.querySelectorAll<HTMLElement>("body *")) {
    if (el.scrollHeight <= el.clientHeight + 1) continue;
    if (!/auto|scroll/.test(getComputedStyle(el).overflowY)) continue;
    const box = el.getBoundingClientRect();
    const below = window.innerHeight - box.bottom;
    height = Math.max(
      height,
      box.top + window.scrollY + el.scrollHeight + Math.max(0, below),
    );
  }
  return Math.ceil(height);
}

/**
 * Opens `url` and waits for the network to go quiet. A page that keeps a
 * request open (a stream, a poll) never does: after 20 s it is taken once
 * loaded, which is what a visitor sees.
 */
async function settle(page: Page, url: string) {
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 20_000 });
  } catch (error) {
    if (!String(error).includes("Timeout")) throw error;
    await page.goto(url, { waitUntil: "load", timeout: 60_000 });
    await page.waitForTimeout(3000);
  }
}

export type CaptureResult = {
  shots: Shot[];
  /** Screens or lookups that failed, with why. */
  failures: string[];
};

export async function capture(opts: {
  baseUrl: string;
  screens: Screen[];
  lookups: Lookup[];
  outDir: string;
  log: (message: string) => void;
}): Promise<CaptureResult> {
  // A machine whose browser doesn't match the project's Playwright points at
  // its own Chromium (e.g. /opt/pw-browsers/chromium in a cloud session).
  const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
  const browser = await chromium.launch(
    executablePath ? { executablePath } : undefined,
  );
  const failures: string[] = [];

  /** A page at `width`, signed in as the test admin (or not). */
  async function open(as: "admin" | null, width: number, locale: "en" | "ar") {
    const context = await browser.newContext({
      viewport: { width, height: width < 768 ? 800 : 900 },
      deviceScaleFactor: scaleFor(width),
      locale: locale === "ar" ? "ar-EG" : "en-US",
      colorScheme: "light",
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    if (as === "admin") {
      // The login answers with a redirect and sets the cookie on the context.
      const r = await page.request.get(`${opts.baseUrl}/api/council/login`, {
        maxRedirects: 0,
      });
      if (r.status() !== 303)
        throw new Error(
          `The test-only login answered ${r.status()}, not 303: is the app built in council test mode?`,
        );
    }
    return { context, page };
  }

  const found: Record<string, string> = {};
  for (const lookup of opts.lookups) {
    const { context, page } = await open(null, 1280, "en");
    try {
      await page.goto(
        `${opts.baseUrl}/en${lookup.open === "/" ? "" : lookup.open}`,
        { waitUntil: "networkidle", timeout: 60_000 },
      );
      const hrefs = await page.evaluate(() =>
        [...document.querySelectorAll("a[href]")].map(
          (a) => a.getAttribute("href") ?? "",
        ),
      );
      const value = hrefs.map((h) => lookup.pattern.exec(h)?.[1]).find(Boolean);
      if (value) found[lookup.name] = value;
      else
        failures.push(
          `lookup ${lookup.name}: no link on ${lookup.open} matches ${lookup.pattern}`,
        );
    } catch (error) {
      failures.push(`lookup ${lookup.name}: ${String(error)}`);
    } finally {
      await context.close();
    }
  }

  const shots: Shot[] = [];
  for (const shot of shotsFor(opts.screens)) {
    let path: string;
    try {
      path = shotPath(
        shot.screen.path,
        shot.locale,
        found,
        shot.screen.unprefixed,
      );
    } catch (error) {
      failures.push(`${shot.file}: ${String(error)}`);
      continue;
    }
    let opened: Awaited<ReturnType<typeof open>>;
    try {
      opened = await open(shot.screen.as, shot.width, shot.locale);
    } catch (error) {
      failures.push(`${shot.file}: ${String(error)}`);
      continue;
    }
    const { context, page } = opened;
    try {
      await settle(page, `${opts.baseUrl}${path}`);
      await page.evaluate(() => document.fonts.ready.then(() => undefined));
      // Live queries settle and entry animations end.
      await page.waitForTimeout(800);
      // The viewport grows to the content instead of a full-page shot: a
      // full-page shot leaves fixed bars at the first screen's bottom, over
      // the content, and stops 100vh shells and inner scroll areas there.
      const base = shot.width < 768 ? 800 : 900;
      for (let i = 0; i < 2; i++) {
        const height = Math.min(
          MAX_HEIGHT,
          Math.max(base, await page.evaluate(contentHeight)),
        );
        await page.setViewportSize({ width: shot.width, height });
        await page.waitForTimeout(300);
      }
      await page.screenshot({
        path: join(opts.outDir, shot.file),
        fullPage: false,
      });
      shots.push(shot);
      opts.log(
        `  ${shot.file} ← ${path}${shot.screen.as ? ` as ${shot.screen.as}` : ""}`,
      );
    } catch (error) {
      failures.push(`${shot.file}: ${String(error)}`);
    } finally {
      await context.close();
    }
  }
  await browser.close();
  return { shots, failures };
}
