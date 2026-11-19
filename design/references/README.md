# Reference sites for the design council

The design council (`pnpm design-council`) answers its checklist for our screenshots side by side with screenshots of other sites. A reviewer that sees our site alone answers too generously; next to strong sites, the answers become honest, and "close to these" becomes the goal.

A reference site is compared with ours on the **overall share** of passing checks only (the council is done only when no reviewer puts ours more than 10 points under the best reference site's overall share). Not on each category: the pictures here don't cover every screen of ours, and none of them shows our admin area, so a category-by-category comparison would measure what we photographed, not how good the design is. Don't expect a reference site to pass the checks that only our admin screens or Arabic pages can show; a check a reference can't show is answered `na`.

Put each site's screenshots in a folder of its own here, named after the site:

```
design/references/
  unicef/
    home-360.png
    story-360.png
    donate-1280.png
  sos-childrens-villages/
    home-1280.png
```

- Take them yourself, from the site, at phone width (360–390 px) and laptop width (1280 px), on the screens that match ours: the home page, an explanation page (what we do, how it works), a blog or story page, a list of articles or FAQs, and the donation page.
- Three to six screenshots per site, two or three sites. More pictures make each review shallower.
- Good candidates: the sites of well-known child-welfare and sponsorship charities (UNICEF, SOS Children's Villages, Save the Children), a charity site from the Arabic-speaking world with an Arabic version if you can find one (then add an `-ar` screenshot so the right-to-left checks have something to answer), and one content site known for its design, whatever its field.

Everything here except this file is git-ignored: other organisations' screenshots stay on your machine. The folder is read from the checkout you run the council in.
