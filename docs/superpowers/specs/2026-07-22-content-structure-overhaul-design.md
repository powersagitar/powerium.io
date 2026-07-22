# Content structure overhaul — design

## Problem

The docs site's content structure has grown a few rough edges that make it
harder for end users (people forking mSSG and reading the docs) to navigate and
trust:

1. The sidebar has a "Getting Started" section containing only the homepage
   ("Overview"), while the actual step-by-step setup walkthrough is a separate
   page titled "Getting Started" filed under "Guides" — two different things
   sharing one name in two different places.
2. The `::article-list` directive's reference page uses four placeholder fixture
   articles (`introduction.mdx`, `basics.mdx`, `advanced/patterns.mdx`,
   `advanced/techniques.mdx`) purely as sample data for its live examples. These
   are real, individually navigable pages, so a user who clicks through the live
   demo lands on stub text like "This is a placeholder article."
3. A few links and domain references are stale or broken:
   - `writing-content.mdx` links to `/reference/mdx-components`, which doesn't
     exist (`mdx-directives.mdx` is the real page).
   - `sidebar.mdx` links to an anchor
     (`/reference/mdx-directives#container-directive-formatting-rules`) that
     doesn't exist anywhere in content — the `:::` trailing-space formatting
     rule is only documented in `CLAUDE.md` for contributors, never published
     for end users.
   - `customization.mdx`'s `robots.txt` example, `src/app/not-found.tsx`, and
     `README.md` all still reference the old `mssg.powerium.io` domain (the site
     moved to `mssg.mohandong.com`). `not-found.tsx`'s reference is
     intentionally an absolute URL to the upstream docs (see below) — only the
     domain itself is stale, not the fact that it's hardcoded.

## Goals

- Resolve the "Getting Started" naming clash.
- Turn the article-list fixture pages into genuinely useful content, so clicking
  through the live demo never dead-ends into a stub.
- Fix the broken/stale links above.
- Light editorial pass over existing guide/reference pages for clarity where
  it's obviously warranted, without changing their scope.

## Non-goals

- No changes to the underlying content-resolution code (`src/lib/mdx.ts`,
  `ContentRenderer.tsx`, etc.) — this is a content/structure pass only.
- No new directive components or frontmatter fields.
- `docs/superpowers/plans/2026-05-30-rss-feed.md` is a historical record and is
  not touched, even though it also contains a stale domain reference.

## Final sidebar structure

```
Getting Started
  • Overview            (content/index.mdx — unchanged)
  • Setup               (content/getting-started.mdx — moved from guides/)

Guides
  • Writing Content
  • Customization

Reference
  • Configuration
  • Frontmatter
  • MDX Directives
  • Sidebar

Directives
  • :: article-list       (index page)
      - Building a Blog Index
      - Tagging and Dates
      - advanced/
          - Building a Changelog
          - Nested Sections with Recursive Listings
  • :: callout
  • :: progress-bar
  • :: spacer
  • :: table-of-contents
  • :: timeline
```

The "Getting Started" nav section becomes a two-item section via explicit
`::nav-item` entries in `content/_nav.mdx` (not `::nav-dir`, since its two items
— the root page and a top-level file — aren't a single directory's contents).
The page's own `<h1>` stays "Getting Started"; only the sidebar label reads
"Setup", avoiding a "Getting Started → Getting Started" visual duplication.

## File moves/renames

| Current path                                              | New path                                                       | Reason                                                 |
| --------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------ |
| `content/guides/getting-started.mdx`                      | `content/getting-started.mdx`                                  | Top-level "Setup" page, URL becomes `/getting-started` |
| `content/directives/article-list/introduction.mdx`        | `content/directives/article-list/blog-index.mdx`               | New topic                                              |
| `content/directives/article-list/basics.mdx`              | `content/directives/article-list/tagging-and-dates.mdx`        | New topic                                              |
| `content/directives/article-list/advanced/patterns.mdx`   | `content/directives/article-list/advanced/changelog.mdx`       | New topic                                              |
| `content/directives/article-list/advanced/techniques.mdx` | `content/directives/article-list/advanced/nested-listings.mdx` | New topic                                              |

`content/index.mdx`'s "Start from [Getting Started](/guides/getting-started)"
link is repointed to `/getting-started`. `content/_nav.mdx` is rewritten to
match the structure above.

No other content file currently links to the old article-list fixture paths by
URL (verified by grep), so these renames are safe.

## article-list cookbook rewrite

All four fixture pages keep the same `title`/`description`/`tags` frontmatter
shape but get real content. The placeholder `author: Example Author` field is
dropped from all four (no other real doc page on the site has an author byline).
Each gets `publish-date: 2026-07-22` (today, the date of this rewrite) — the
honest date, since this is when the content was actually written.

One tradeoff worth naming: with all four sharing one date, the live sort-order
demo on the `article-list` reference page no longer visually proves descending
order, and the resulting fallback order is not the intended reading order — see
**Backlog** below for the precise breakdown and the real fix. Not worth
fabricating backdated history to paper over it. The `tagging-and-dates.mdx`
article's prose still explains the sort rule in words, so the mechanism is
documented even though the sample data doesn't visibly demonstrate it.

- **`blog-index.mdx`** — "Building a Blog Index" (`tags: [cookbook]`). How a
  directory of dated posts auto-renders as a listing with no configuration, and
  when to add an `index.mdx` if you want intro copy above the list (with a
  worked example).
- **`tagging-and-dates.mdx`** — "Tagging and Dates"
  (`tags: [cookbook, frontmatter]`). How `publish-date` drives sort order
  (undated always sorts last) and practical guidance on keeping `tags` short
  since list rows are compact. Links to the full field reference.
- **`advanced/changelog.mdx`** — "Building a Changelog" (`tags: [cookbook]`).
  Using `limit` to show only the N most recent entries as a "recent changes"
  widget, contrasted with linking to the full unlimited listing.
- **`advanced/nested-listings.mdx`** — "Nested Sections with Recursive Listings"
  (`tags: [cookbook]`). Explains that this article lives in `advanced/` and is
  therefore invisible to the non-recursive example above it on the reference
  page — the reader is looking at the actual mechanism, not just a description
  of it — then generalizes to grouping real content into subdirectories.

Each page keeps a short code example. These stay short, practical entries
(roughly 100–200 words of body prose each), not essays.

## Other doc-quality fixes

- `writing-content.mdx`: fix the `/reference/mdx-components` link to
  `/reference/mdx-directives`.
- `mdx-directives.mdx`: add a "Container directive formatting" section
  (mirroring the `:::` trailing-space rule from `CLAUDE.md`, written for end
  users) with the anchor `sidebar.mdx` already links to, so that link resolves.
- `customization.mdx`: fix the `robots.txt` example's `Sitemap:` URL to
  `mssg.mohandong.com`.
- `src/app/not-found.tsx`: this link must stay an absolute URL to the _mssg
  project's own_ docs site, not a relative path — a fork's deployed site won't
  have `/guides/writing-content` (forks replace `content/` with their own
  pages), so the 404 page's "Browse the docs" link is intentionally pointing
  back at the upstream docs, wherever this component ends up (including inside a
  fork that hasn't touched `not-found.tsx`). Fix is narrower than initially
  scoped: extract the domain to a single named constant at the top of
  `not-found.tsx` (e.g. `const MSSG_DOCS_URL = 'https://mssg.mohandong.com'`)
  rather than embedding the magic string in JSX, and update it to the current
  domain. Not added to `SiteConfig` / `site.config.ts` — that file is explicitly
  what forks edit for their own site, and this constant means something
  different (the upstream project's URL, not the fork's own).
- `README.md`: fix `mssg.powerium.io` → `mssg.mohandong.com`.
- General light editorial pass over existing guide/reference pages during
  implementation — fixing anything else stale, redundant, or unclear encountered
  along the way, without changing their scope or structure beyond what's
  specified above.

## Backlog: restore a meaningful article-list order

Not part of this pass (no code/frontmatter-schema changes — see Non-goals), but
tracked here so it isn't lost: `getArticlesInDir`'s sort (`src/lib/mdx.ts`) only
orders by `publish-date` (descending, undated last), then falls back to
`slug.localeCompare` for ties. With all four cookbook articles sharing today's
date, they tie and fall back to alphabetical order on the full slug (which, for
nested files, includes the `advanced/` prefix — e.g. the slug is
`advanced/changelog`, not just `changelog`). That means the live recursive
example (`::article-list{dir=directives/article-list recursive}`) currently
renders them as:

```
advanced/changelog
advanced/nested-listings
blog-index
tagging-and-dates
```

— because `"advanced/..."` sorts alphabetically before `"blog-index"` and
`"tagging-and-dates"`. This is the **exact inverse** of the intended reading
order below (the two "advanced" pages render first, not last). It's incidental
sort fallout, not designed, and will keep silently reshuffling on any rename.
The non-recursive example (`dir=directives/article-list`, no `recursive`) isn't
affected — it only ever shows the two top-level files, and `blog-index` <
`tagging-and-dates` already matches the intended order there by coincidence.

**Intended reading order** (pedagogical progression, matches the sidebar tree in
"Final sidebar structure" above):

1. `blog-index.mdx` — "Building a Blog Index" (foundational: the basic
   directory-listing case)
2. `tagging-and-dates.mdx` — "Tagging and Dates" (how frontmatter drives
   sorting/rendering — a natural follow-up to #1)
3. `advanced/changelog.mdx` — "Building a Changelog" (advanced: `limit`)
4. `advanced/nested-listings.mdx` — "Nested Sections with Recursive Listings"
   (advanced: `recursive` — conceptually the most involved, fits last)

**Follow-up work**: add an explicit ordering mechanism (e.g. an optional
`order: number` frontmatter field that `getArticlesInDir`'s sort prefers over
`publish-date`/slug when present) so this exact order can be restored
deterministically, rather than relying on `publish-date` staggering or
slug/filename naming tricks. Once that lands, set `order: 1..4` on these four
files per the list above.

## Verification

- `bun run build` succeeds and generates the expected static paths (one fewer
  than before is _not_ expected — same file count, just renamed/moved).
- `bun run lint` / `bun run prettier` clean (already enforced by hooks).
- Manually click through the sidebar in dev mode to confirm every link resolves
  (no 404s), especially the renamed article-list cookbook pages and the two
  previously-broken links.
- Grep for `mssg.powerium.io` and `mdx-components` across the repo to confirm
  zero remaining stale references (outside the historical
  `2026-05-30-rss-feed.md` plan doc).
