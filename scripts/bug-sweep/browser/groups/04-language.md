**Who:** a visitor, logged out.

**Screens:**

- The language switch on Home and on many inner pages (`/kafala-steps`, `/kafala-blogs`, a blog, `/faqs`, `/donate`, `/resources`): English to Arabic and back must stay on the same page; reload after switching; open a page by its Arabic address directly
- The mobile menu at 360 px on three different pages: open, follow every link, close it; in Arabic it must open from the right side
- The footer on three pages in both languages: every link goes to the right place
- Old links: `/about-us`, `/adoption-steps`, `/kafala-stories`, and the same with `/en` and `/ar` in front
- A page that doesn't exist (`/no-such-page`, `/ar/no-such-page`, `/en/kafala-blogs/not-an-id`): a "not found" page (the framework's plain 404; a missing link back is a design finding, not a bug)
- Layout of every page you pass through at 360 px: no sideways scroll

**Look hard at:** a language switch that loses the page or the scroll position, mixed-direction text, mirrored icons that shouldn't mirror (and the other way round), the header covering content, the browser's Back button after switching language.
