import type { Screen } from "../lib/designCouncil.ts";

/**
 * What the design council photographs (scripts/design-council.ts): the main
 * public pages, at a phone's width and a laptop's, the most visited ones in
 * Arabic too. Each page is scrolled through (so lazy images and reveals
 * load) and photographed whole, cut at a few screens' height. Keep it to a
 * dozen or so pages: every reviewer looks at every screenshot in one pass.
 */

/** What the reviewers are told the site is. */
export const SITE = `yallakafala.org: the site of Yalla Kafala, an Egyptian non-profit that promotes kafala (the Islamic, legal way to give an orphaned child a permanent family home) and supports families through it. In English and Arabic (right to left). Its visitors are would-be kafala parents looking for guidance and trust, current families, partners and donors. It explains what kafala is and its steps, answers religious and legal questions, shares articles and stories, and asks for donations. The screenshots are of the live site, each page scrolled through and photographed whole.`;

/**
 * Set in every page's local storage before it loads, as for a returning
 * visitor: the newsletter popup on the homepage
 * (src/components/Homepage/NewsletterPopover) skips anyone who has
 * subscribed, so it doesn't cover the page the reviewers are judging.
 */
export const STORAGE: Record<string, string> = {
  "newsletter-subscribed": "true",
};

const BOTH = [390, 1440];

export const SCREENS: Screen[] = [
  { id: "home", title: "Home", path: "/", widths: BOTH, arabic: true },
  {
    id: "what-is-kafala",
    title: "What is kafala",
    path: "/what-is-kafala",
    widths: BOTH,
    arabic: true,
  },
  {
    id: "kafala-steps",
    title: "Kafala steps",
    path: "/kafala-steps",
    widths: BOTH,
    arabic: true,
  },
  { id: "faqs", title: "FAQs", path: "/faqs", widths: [390] },
  {
    id: "who-we-are",
    title: "Who we are",
    path: "/who-we-are",
    widths: [1440],
  },
  {
    id: "articles",
    title: "Kafala articles",
    path: "/kafala-articles",
    widths: [1440],
  },
  { id: "resources", title: "Resources", path: "/resources", widths: [390] },
  {
    id: "donate",
    title: "Donate",
    path: "/donate",
    widths: BOTH,
    arabic: true,
  },
];
