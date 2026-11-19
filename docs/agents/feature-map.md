# Feature map

What a person can do on Yallakafala, as the flows the bug sweep walks
(`pnpm bug-sweep`, `docs/bug-council.md`). Each `###` heading is one flow; the
`Route` line is the path after the language prefix (every public flow is walked
in English `/en/…` and in Arabic `/ar/…`; `/admin` has no prefix). The agent
gives each flow one result: `pass`, `fail`, `blocked` or `not reached`.

How the council copy of the site differs from the real one (see
`docs/design-council.md`, "The test-only login and the demo data"): it runs on a
throwaway local backend with invented rows, the admin area opens through a
test-only login instead of Clerk, and nothing reaches UploadThing, Facebook,
EmailOctopus or Google. Flows that need one of those are listed under "Not
covered" at the end, not as flows, so they don't count as failures.

Keep this file current: a new page or form is a new flow. The groups of the
sweep take their flows from the `##` heading (`scripts/lib/browserHunt.ts`
`GROUP_FLOWS`); a unit test fails when a flow fits no group.

## Public visitor: learn

### Home page

- **Route**: `/`
- The hero (headline, "Start your kafala journey" and "What is kafala?" buttons, the trust
  list with the GuideStar badge, the picture carousel), the impact numbers, the
  featured blogs (up to three cards and a "see all" link), the mission, the FAQ
  list and the Facebook posts all show content (the demo has 3 carousel
  pictures, 4 posts). The home page has no donate band and no "make a
  difference" cards any more.
- The header's links and the footer's links go to the pages below. On a laptop
  the header also has a "Start kafala" link to the steps.

### What is Kafala

- **Route**: `/what-is-kafala`
- The explanation page shows; its links to the steps and the donate page work.

### Kafala steps

- **Route**: `/kafala-steps`
- Every step is shown in order, with the list of required documents; the page
  reads correctly at 360 px. Its "meeting" button opens an email (checked, not
  followed) and its FAQs link works.

### Who we are

- **Route**: `/who-we-are`
- The team and the board members show, with pictures. The demo has published
  board members and advisors for Egypt and the USA, and one unpublished member
  that must not show.

### Vision and mission

- **Route**: `/vision-mission`

### Beit Sagheer

- **Route**: `/beit-sagheer`
- The sections show; "back to top" works.

### Activities and milestones

- **Route**: `/activities-and-milestones`

### Fatwa

- **Route**: `/fatwa`
- The page shows; its document link is present (the PDF itself is on another
  site and is not followed).

### YK Gala

- **Route**: `/yk-gala`

## Public visitor: stories

### Blog list

- **Route**: `/kafala-blogs`
- The published blogs show as cards (4 in the demo are published and 1 is a
  draft that must not show). Which blogs are featured is not marked here: it
  decides which ones the home page shows.

### Read a blog

- **Route**: `/kafala-blogs/{id}`
- Opened from a card: the title, picture and text show, in the page's language.

### Article list

- **Route**: `/kafala-articles`
- The published articles show as cards.

### Read an article

- **Route**: `/kafala-articles/{id}`

### FAQs

- **Route**: `/faqs`
- Only published questions show; each opens and closes. A search box filters
  them (and says how many match, or that none do); a long list starts with the
  first twelve and a "show all" button.

### Resources list

- **Route**: `/resources`
- The demo has two resources, as cards. Each card opens the resource's own
  link (a PDF under `/docs/`) in a new tab; there is no "copy link" button any
  more.

### Open a resource

- **Route**: `/resources/annual-report-2024-25`
- A resource's address does not show a page: it sends the visitor on to the
  resource's link (the PDF opens). An unknown slug shows the "not found" page.
  The demo's slugs are `annual-report-2024-25` and `dar-ifta-fatwa-source`.

## Public visitor: support

### Donate page

- **Route**: `/donate`
- The two ways to donate show (online, and in Egypt: the "jump to Egypt" link
  scrolls to its section); the online donate button opens the donation page of another site (the
  link is checked, not followed); the link to the resources page works.

### Donate now dialog

- **Route**: `/`
- The header's "Donate Now" button (on a phone, "Donate") opens a dialog with
  three options (card or bank, stock, in Egypt) and closes it. The hero has no
  donate button any more.

### Stock donation

- **Route**: `/stock-donation`

### Partnerships

- **Route**: `/partnerships`

### Newsletter sign-up

- **Route**: `/`
- The newsletter pop-over opens, rejects an empty or invalid email with a
  message, and accepts a valid one. In the council copy EmailOctopus is not
  reachable, so an error toast after a valid email is expected and is not a bug;
  a crash, a frozen button or no message at all is.

### Volunteer and brochure links

- **Route**: `/`
- The volunteer-form and brochure links in the footer and header are present
  with a real address (they leave the site and are not followed).

## Public visitor: language and layout

### Switch to Arabic and back

- **Route**: `/`
- The language switcher changes the page to Arabic (right to left) and back to
  English, staying on the same page.

### Arabic page keeps its place

- **Route**: `/kafala-steps`
- Switching language on an inner page opens the same page in the other
  language; the header, footer and cards line up right to left.

### Mobile menu

- **Route**: `/`
- At 360 px the menu button opens the navigation, every link works, and the
  menu closes after a choice. No horizontal scroll on any page.

### Footer links

- **Route**: `/`
- Quick links, contact details and social links are present and the quick
  links open the right pages.

### Old links redirect

- **Route**: `/about-us`
- `/about-us`, `/adoption-steps` and `/kafala-stories` end on the page that
  replaced them.

### Unknown page

- **Route**: `/no-such-page`
- A page that doesn't exist shows a "not found" page, not a blank or error
  screen. (The app has no page of its own for it: it is the framework's plain
  404. A missing link back is a design finding, not a failure.)

## Admin: stories and FAQs

### Admin sign-in

- **Route**: `/admin/login`
- A visitor who isn't signed in who opens `/admin/blogs` is sent to the login
  page. In the council copy the login page has one link, "Sign in as the test
  admin", which opens the dashboard.

### Dashboard

- **Route**: `/admin`
- The dashboard shows its welcome text and the side menu with every section.
  (The "Sync Facebook posts" button needs Facebook: see "Not covered".)

### Blog list

- **Route**: `/admin/blogs`
- Blogs and articles show with their published and featured state, including
  the draft.

### Edit a blog

- **Route**: `/admin/blogs`
- Open a blog, change its title and text (the rich-text editor), save: the
  public blog page shows the change. Don't replace the picture.

### Publish and feature a blog

- **Route**: `/admin/blogs`
- Switch a blog's published or featured state: the public list follows.

### Delete a blog

- **Route**: `/admin/blogs`
- Delete a blog after confirming: it leaves the admin and the public list.

### FAQ list

- **Route**: `/admin/faqs`
- All questions show, with their published and featured state, including the
  draft.

### Add an FAQ

- **Route**: `/admin/faqs`
- A new question with its English and Arabic text appears in the admin; when
  published it appears on the public FAQ page. An empty form is refused with a
  message.

### Edit an FAQ

- **Route**: `/admin/faqs`

### Delete an FAQ

- **Route**: `/admin/faqs`

### Sign out

- **Route**: `/admin`
- "Sign out" returns to the login page; `/admin/blogs` is closed again.

## Admin: site content

### Board member list

- **Route**: `/admin/board-members`
- Members and advisors show with their country and published state.

### Edit a board member

- **Route**: `/admin/board-members`
- Change a name or biography (English and Arabic) and save: the Who we are page
  shows the change. Don't replace the picture.

### Delete a board member

- **Route**: `/admin/board-members`

### Carousel list

- **Route**: `/admin/carousel`
- The three demo pictures show in their order with their captions.

### Edit a carousel caption

- **Route**: `/admin/carousel`
- Change a caption or the order and save: the home page carousel follows. Don't
  replace the picture.

### Resource list

- **Route**: `/admin/resources`
- The two demo resources show with their links.

### Edit a resource

- **Route**: `/admin/resources`
- Change a resource's name and save: the public Resources page follows. Don't
  replace the file.

## Not covered by the sweep

Known gaps of the council copy. Agents don't walk these, and the score doesn't
count them:

- Clerk sign-in, sign-up and the Clerk user menu (the test login replaces them).
- Every upload (the pictures and files of blogs, board members, the carousel
  and resources): UploadThing is not reachable, so the "add" forms that need a
  file can't be completed.
- "Sync Facebook posts" on the dashboard and the live Facebook feed.
- A successful newsletter sign-up (EmailOctopus), the donation sites, the
  volunteer form, the social pages and the Google Maps and Meet links.
- Sending anything by email, and the sitemap and robots files.
