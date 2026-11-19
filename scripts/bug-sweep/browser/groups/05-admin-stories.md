**Who:** the admin. Open `{{BASE_URL}}/api/council/login` first. Before that, try `/admin/blogs` logged out: it must send you to the login page. The admin area is English.

**Screens:**

- Dashboard `/admin`: the welcome text and the side menu; every menu link works (the "Sync Facebook posts" button needs Facebook, leave it)
- Blogs and articles `/admin/blogs`: the list with published and featured state, including the draft; open a blog and edit its title and text in the rich-text editor (bold, headings, lists, links); save; then check the public page `/en/kafala-blogs/<id>` shows the change. Don't replace the picture (uploads are not covered)
- Switch a blog's published and featured state, then check the public list follows
- Delete a blog (with the confirmation), then check it is gone from the public list
- FAQs: the list, add one (English and Arabic texts), edit one, delete one; check each change on the public `/faqs` page
- Sign out, then open `/admin` again: you must be sent to the login page

**Look hard at:** a save that appears to work but doesn't show on the public page, a delete without confirmation, empty or very long fields, Arabic text in the Arabic fields and the editor's direction, double-clicking save, pressing Back after saving, the tables at 360 px.
