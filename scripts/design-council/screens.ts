import type { Lookup, Screen } from "../lib/designCouncil";

/**
 * What the design council photographs (scripts/design-council.ts): the main
 * public pages and the admin area, on a local build with invented content
 * (scripts/council/seedData.ts). Phones first: most visitors read on a
 * phone. Keep it to a dozen or so screens per role: every reviewer looks at
 * every screenshot in one pass, and more pictures make each look shallower.
 *
 * The public pages are photographed in English at 360 and 1280 px, and the
 * main ones again in Arabic (right to left) at 360 px. The admin area has no
 * language prefix and is English only; it opens through the test-only login
 * (`as: "admin"`, docs/design-council.md).
 */

/** What the reviewers are told the app is. */
export const APP = `Yallakafala: a website about kafala, the Islamic way of caring for a child without parents: sponsoring a child and alternative family care. It is in English and Arabic (right to left). Visitors, many of them families thinking about kafala, read what kafala is, the steps, the organisation, its blogs, articles, FAQs and resources, and are asked to donate, volunteer or sign up to the newsletter, mostly from a phone. The staff sign in to an admin area to write blogs and articles, answer FAQs, and keep the board members, carousel and resources up to date, mostly from a laptop. The screenshots come from a local build with invented demo content, so photos and texts are placeholders.`;

const BOTH = [360, 1280];

/** The IDs of the demo's blogs are made by the database: look one up. */
export const LOOKUPS: Lookup[] = [
  { name: "blog", open: "/kafala-blogs", pattern: /\/kafala-blogs\/([^/?#]+)/ },
];

export const SCREENS: Screen[] = [
  {
    id: "home",
    title: "Home",
    as: null,
    path: "/",
    widths: BOTH,
    arabic: true,
  },
  {
    id: "what-is-kafala",
    title: "What is kafala",
    as: null,
    path: "/what-is-kafala",
    widths: BOTH,
    arabic: true,
  },
  {
    id: "kafala-steps",
    title: "The steps of kafala",
    as: null,
    path: "/kafala-steps",
    widths: [360],
    arabic: true,
  },
  {
    id: "who-we-are",
    title: "Who we are (the board)",
    as: null,
    path: "/who-we-are",
    widths: BOTH,
  },
  {
    id: "blogs",
    title: "Blog list",
    as: null,
    path: "/kafala-blogs",
    widths: BOTH,
    arabic: true,
  },
  {
    id: "blog",
    title: "A blog post",
    as: null,
    path: "/kafala-blogs/{blog}",
    widths: BOTH,
    arabic: true,
  },
  {
    id: "faqs",
    title: "FAQs",
    as: null,
    path: "/faqs",
    widths: [360],
    arabic: true,
  },
  {
    id: "resources",
    title: "Resources",
    as: null,
    path: "/resources",
    widths: [360],
  },
  {
    id: "donate",
    title: "Donate",
    as: null,
    path: "/donate",
    widths: BOTH,
    arabic: true,
  },
  {
    id: "admin-home",
    title: "Admin dashboard",
    as: "admin",
    path: "/admin",
    unprefixed: true,
    widths: [1280],
  },
  {
    id: "admin-blogs",
    title: "Admin: blogs",
    as: "admin",
    path: "/admin/blogs",
    unprefixed: true,
    widths: [1280],
  },
  {
    id: "admin-faqs",
    title: "Admin: FAQs",
    as: "admin",
    path: "/admin/faqs",
    unprefixed: true,
    widths: [1280],
  },
  {
    id: "admin-board",
    title: "Admin: board members",
    as: "admin",
    path: "/admin/board-members",
    unprefixed: true,
    widths: [1280],
  },
  {
    id: "admin-carousel",
    title: "Admin: carousel",
    as: "admin",
    path: "/admin/carousel",
    unprefixed: true,
    widths: [1280],
  },
  {
    id: "admin-resources",
    title: "Admin: resources",
    as: "admin",
    path: "/admin/resources",
    unprefixed: true,
    widths: [1280],
  },
];
