import type { Category } from "../lib/designCouncil";

/**
 * The design council's checklist (scripts/lib/designCouncil.ts): yes/no
 * checks a reviewer answers from the screenshots alone, for our app and for
 * every reference app. A category's score is the share of its checks that
 * pass, so it moves when a check starts passing, not when a reviewer's mood
 * does. The app has no written style guide: the checks are the generic ones
 * for a content site that asks for donations, in English and Arabic (right to
 * left), plus its admin area.
 *
 * Change it between climbs, never during one: shares from different
 * checklists don't compare. An ID is stable: never reuse one for another
 * question.
 */
export type Check = {
  /** `<category>-<n>`; stable. */
  id: string;
  category: Category;
  /** A yes/no question: yes means the design is right. */
  question: string;
};

const checks = (category: Category, questions: string[]): Check[] =>
  questions.map((question, i) => ({
    id: `${category}-${i + 1}`,
    category,
    question,
  }));

export const CHECKLIST: Check[] = [
  ...checks("hierarchy", [
    "Does every screen have one clearly primary action, and is it the most prominent control?",
    "Is the screen's title or main subject the first thing the eye lands on?",
    "Is a secondary choice (a Learn more link beside Donate, Cancel beside Save) visibly weaker than the primary action beside it?",
    "Does the most important information of a card (title, date, status) stand out from its details?",
    "Is anything that isn't needed on this screen left out, or pushed behind a tap?",
    "Is a destructive action (delete, remove) set apart from the primary action so the two can't be mistaken?",
  ]),
  ...checks("typography", [
    "Are there no more than three text sizes on one screen?",
    "Do headings, body text and secondary text each look clearly different in size or weight?",
    "Is body text large enough to read comfortably (about 14 px on a phone, never smaller than 12 px)?",
    "Are lines of text a comfortable length, with no long paragraphs spanning a wide desktop screen?",
    "Is long reading text (articles, blogs, FAQ answers) set with comfortable line spacing and clear headings?",
    "Is text never cut off, squeezed or wrapped awkwardly in a button, chip or card?",
  ]),
  ...checks("color", [
    "Does body text meet 4.5:1 against its background?",
    "Does text on a coloured button, chip or pill meet 4.5:1 against its fill?",
    "Is a light accent colour used only for decoration, never for text?",
    "Do status colours (success, warning, destructive) each mean one thing, the same on every screen?",
    "Does the palette stay to the brand colour, its tint and neutrals, with no stray colour?",
    "Is the red of destructive actions clearly different from the brand colour?",
  ]),
  ...checks("spacing", [
    "Is the space around the screen's edge the same on every screen (about 16 px on a phone)?",
    "Is the space between blocks of the same kind equal, and larger between groups than inside a group?",
    "Are elements that sit in a row or a column aligned on a common edge?",
    "Do cards and sheets have comfortable padding, with no text touching an edge?",
    "Is the density right: neither crammed with things nor mostly empty space?",
    "On desktop, does content sit in a sensible column or grid, with no stretched controls or large empty areas?",
  ]),
  ...checks("consistency", [
    "Do the same kinds of buttons look the same on every screen?",
    "Do cards, chips and pills share one set of corner radii and borders?",
    "Does the page header (title, back, actions) sit in the same place on every screen?",
    "Is the same thing called the same word on every screen?",
    "Are dates and numbers written the same way everywhere?",
    "Do the phone and desktop versions of a screen feel like the same app?",
  ]),
  ...checks("components", [
    "Does every tappable control look tappable?",
    "Do icons come from one family, in one stroke weight and size?",
    "Does each icon's meaning match its use, and is it never the only label of an unclear action?",
    "Are form fields clearly labelled, with their hint or error beside them?",
    "Are chips, tabs and segmented controls clearly different in selected and unselected states?",
    "Do empty states (no stories, no search result) say one plain sentence and offer a single primary action when there is one?",
    "Is each control at least 44 px tall on a phone?",
  ]),
  ...checks("mobile", [
    "At 360 px, is nothing cut off or overflowing, and is there no sideways scrolling?",
    "At 360 px, is the primary action reachable without scrolling a long way, or fixed at the bottom?",
    "At 360 px, are tap targets at least 44 px tall with room between them?",
    "At 360 px, does text stay readable without zooming?",
    "At 360 px, do lists, cards and tables fit the width as stacked rows instead of shrunken columns?",
    "At 360 px, do the header and the menu leave room for the content?",
  ]),
  ...checks("rtl", [
    "In Arabic, is the whole layout mirrored: the start of every row is on the right?",
    "In Arabic, do back and forward arrows and chevrons point the right way?",
    "In Arabic, do icons that don't mean a direction (clock, check, phone) stay unmirrored?",
    "In Arabic, is the text aligned to the right, with spacing and padding on the right sides?",
    "In Arabic, is the type readable: Arabic letters joined, with taller lines than English and no spaced-out letters?",
    "In Arabic, do numbers, prices and times read correctly beside the Arabic text?",
  ]),
  ...checks("polish", [
    "Does the site feel like one made product with its own character, not a generic template?",
    "Are the images and avatars sharp, cropped well and in the same style?",
    "Are the corners, borders and shadows quiet and used the same way throughout?",
    "Is there no placeholder, lorem ipsum, debug text or untranslated key on any screen?",
    "Does the first screen make clear what the site is for in a few seconds?",
    "Would a visitor trust this organisation enough to ask for help or to donate?",
  ]),
];

/** The checks of one category, in order. */
export function checksFor(category: Category): Check[] {
  return CHECKLIST.filter((c) => c.category === category);
}
