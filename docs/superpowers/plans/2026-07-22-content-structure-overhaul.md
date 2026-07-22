# Content Structure Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve the "Getting Started" naming clash, turn the `::article-list`
fixture pages into a real cookbook, and fix a handful of stale/broken links
across the mSSG docs site.

**Architecture:** Pure content/structure pass — file moves and rewrites under
`content/`, one small constant-extraction in `src/app/not-found.tsx`, no changes
to content-resolution code.

**Tech Stack:** Next.js App Router, MDX (`@mdx-js/mdx`), gray-matter
frontmatter, bun.

**Design spec:**
`docs/superpowers/specs/2026-07-22-content-structure-overhaul-design.md`

## A note on code blocks in this plan

Several steps below ask you to replace the full contents of an `.mdx` file that
itself contains an example fenced code block in its body (e.g. a page about
`::article-list` that shows an `::article-list{...}` example). To keep this
plan's own Markdown unambiguous, those steps wrap the **target file's full
contents** in a 4-backtick fence, with any example inside it kept as a normal
3-backtick fence. When you copy the replacement content, copy everything between
the 4-backtick markers verbatim — including the inner 3-backtick example — as
the new file's contents; the outer 4-backtick markers themselves are not part of
the file.

## Global Constraints

- No changes to `src/lib/mdx.ts`, `ContentRenderer.tsx`, or any other
  content-resolution code.
- No new directive components or frontmatter fields.
- `docs/superpowers/plans/2026-05-30-rss-feed.md` is a historical record — do
  not touch it, even though it also contains a stale domain reference.
- The four rewritten cookbook articles use `publish-date: 2026-07-22` (today)
  and no `author` field (no other real doc page on the site has one).
- The `not-found.tsx` "Browse the docs" link stays an absolute URL to the
  upstream mSSG docs site — do not make it relative (a fork's own deployed site
  won't have `/guides/writing-content`). The fix is extracting the domain to a
  named constant, not changing the link's target.
- This repo has no test runner (`package.json` has no `test` script). "Testing"
  a task means: `bun run build` succeeds, `bun run lint` / `bun run prettier`
  are clean (a `PostToolUse` hook already runs both automatically after every
  edit — see `.claude/settings.json` — but each task below still re-runs them
  explicitly as its verification step), and, where a route changed, hitting the
  route with `curl` against `bun run start` to confirm the expected HTTP status.

---

### Task 1: Extract `MSSG_DOCS_URL` constant in the 404 page

**Files:**

- Modify: `src/app/not-found.tsx`

**Interfaces:** None (no other task depends on this one).

- [ ] **Step 1: Add the constant and use it**

In `src/app/not-found.tsx`, add a top-level constant after the imports and use
it in the "Browse the docs" link:

```tsx
import Link from 'next/link';

import { ArrowLeft, ExternalLink } from 'lucide-react';
import siteConfig from '~/site.config';

import { ResolveTrace } from '@/components/ResolveTrace';
import { Button } from '@/components/ui/button';

const MSSG_DOCS_URL = 'https://mssg.mohandong.com';

export default function NotFound() {
  return (
    <div className="max-w-190">
      <h1 className="mb-3.5 text-[46px] leading-[1.08] font-extrabold tracking-[-0.03em]">
        This page was never written.
      </h1>
      <p className="text-muted-foreground mb-7 max-w-155 text-[17px] leading-[1.6]">
        mSSG maps every URL straight to the{' '}
        <code className="bg-muted rounded px-[0.4em] py-[0.15em] font-mono text-[0.86em]">
          content/
        </code>{' '}
        tree on disk. No{' '}
        <code className="bg-muted rounded px-[0.4em] py-[0.15em] font-mono text-[0.86em]">
          .mdx
        </code>{' '}
        file backs this path, so there is nothing to render.
      </p>

      <ResolveTrace />

      <div className="mb-10 flex flex-wrap gap-2.5">
        <Button asChild size="lg">
          <Link href="/">
            <ArrowLeft className="size-3.75" />
            Back to overview
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href={`${MSSG_DOCS_URL}/guides/writing-content`}>
            Browse the docs
          </Link>
        </Button>
        {siteConfig.repository && (
          <Button asChild variant="ghost" size="lg">
            <a
              href={`${siteConfig.repository}/issues/new`}
              target="_blank"
              rel="noreferrer"
            >
              Report a missing page
              <ExternalLink className="size-4" />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
```

Only two things changed from the current file: the new `MSSG_DOCS_URL` constant,
and the `Link href` on the "Browse the docs" button now interpolates it instead
of hardcoding `https://mssg.powerium.io`.

- [ ] **Step 2: Verify**

Run: `bun run lint && bun run prettier` Expected: both exit 0 with no errors
(the `PostToolUse` hook already ran these after the edit — this just
double-checks).

Run: `bun run build` Expected: build succeeds (`✓ Compiled successfully`, all
pages generated).

- [ ] **Step 3: Commit**

```bash
git add src/app/not-found.tsx
git commit -m "$(cat <<'EOF'
fix: extract 404 page's upstream docs URL to a named constant

Also fixes the domain, which was still pointing at the pre-move
mssg.powerium.io instead of mssg.mohandong.com. The link intentionally
stays absolute — a fork's own deployed site won't have
/guides/writing-content, since forks replace content/ with their own
pages.
EOF
)"
```

---

### Task 2: Merge "Getting Started" into a top-level Setup page

**Files:**

- Create (via `git mv`): `content/getting-started.mdx` (from
  `content/guides/getting-started.mdx`)
- Modify: `content/_nav.mdx`
- Modify: `content/index.mdx`

**Interfaces:** None (no other task depends on this one; it doesn't touch the
article-list directory the cookbook tasks below operate in).

- [ ] **Step 1: Move the file**

```bash
git mv content/guides/getting-started.mdx content/getting-started.mdx
```

The file's content is unchanged — only its path moves, so its URL changes from
`/guides/getting-started` to `/getting-started`. Its frontmatter
`title: Getting Started` stays as-is (this is what renders as the page's
`<h1>`).

- [ ] **Step 2: Update `content/_nav.mdx`**

Add a second `::nav-item` to the "Getting Started" section, labeled "Setup" (the
sidebar label; the page's own `<h1>` still reads "Getting Started" — see the
design spec's "Final sidebar structure" section for why these intentionally
differ). Every line inside a `:::nav-section` block must end with two trailing
spaces (Prettier `proseWrap: always` would otherwise collapse them — see the
"Container directive formatting" convention already used by every other section
in this file).

Replace the full contents of `content/_nav.mdx` with:

```mdx
---
title: Navigation
---

:::nav-section{label="Getting Started"}  
::nav-item{href=/ title=Overview}  
::nav-item{href=/getting-started title=Setup}  
:::

:::nav-section{label="Guides"}  
::nav-dir{dir=guides}  
:::

:::nav-section{label="Reference"}  
::nav-dir{dir=reference}  
:::

:::nav-section{label="Directives" type=directive}  
::nav-dir{dir=directives}  
:::
```

- [ ] **Step 3: Repoint the homepage's link**

In `content/index.mdx`, change:

```mdx
Start from [Getting Started](/guides/getting-started).
```

to:

```mdx
Start from [Getting Started](/getting-started).
```

- [ ] **Step 4: Verify**

Run: `bun run lint && bun run prettier` Expected: both exit 0, no errors.

Run: `bun run build` Expected: build succeeds.

Run:

```bash
bun run start &
SERVER_PID=$!
sleep 3
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/getting-started
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/guides/getting-started
kill $SERVER_PID
```

Expected: first `curl` prints `200`, second prints `404` (the old URL no longer
resolves — confirms the move, not a duplicate).

- [ ] **Step 5: Commit**

```bash
git add content/getting-started.mdx content/_nav.mdx content/index.mdx
git commit -m "$(cat <<'EOF'
docs: move Getting Started guide to a top-level Setup page

Resolves the naming clash between the sidebar's "Getting Started"
section (which held only the homepage) and the separate "Getting
Started" guide filed under Guides. The guide now lives at
/getting-started and appears as "Setup" alongside "Overview" in the
Getting Started section.
EOF
)"
```

---

### Task 3: Rewrite the article-list cookbook — Building a Blog Index

**Files:**

- Create (via `git mv`): `content/directives/article-list/blog-index.mdx` (from
  `content/directives/article-list/introduction.mdx`)

**Interfaces:** None (each cookbook article in Tasks 3–6 is independent —
they're only tied together by living in the same directory and appearing
together in `::article-list{dir=directives/article-list recursive}`, which
doesn't require them to land in any particular order).

- [ ] **Step 1: Rename and rewrite**

```bash
git mv content/directives/article-list/introduction.mdx content/directives/article-list/blog-index.mdx
```

Replace the full contents of `content/directives/article-list/blog-index.mdx`
with the following (see "A note on code blocks in this plan" above — copy
everything inside the outer fence, including the inner `mdx` example):

````mdx
---
title: Building a Blog Index
description: Turn a folder of dated posts into an automatically sorted listing.
publish-date: 2026-07-22
tags: [cookbook]
---

Drop your posts into a directory — `content/blog/first-post.mdx`,
`content/blog/second-post.mdx` — and give each one a `publish-date`. With no
`index.mdx` in that directory, mSSG automatically renders `/blog` as a listing
sorted newest-first; no extra configuration needed (see
[Directory listings](/guides/writing-content#directory-listings)).

If you want to add copy above the list — a tagline, a featured post, anything —
create `content/blog/index.mdx` and embed the listing explicitly:

```mdx
---
title: Blog
description: Updates and write-ups.
---

Thoughts on building things, published roughly whenever.

::article-list{dir=blog}
```

Once `index.mdx` exists, the automatic listing stops — the embedded
`::article-list` is now the only thing rendering it, so you control exactly
where on the page it appears.
````

- [ ] **Step 2: Verify**

Run: `bun run lint && bun run prettier` Expected: both exit 0, no errors.

Run: `bun run build` Expected: build succeeds.

Run:

```bash
bun run start &
SERVER_PID=$!
sleep 3
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/directives/article-list/blog-index
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/directives/article-list/introduction
kill $SERVER_PID
```

Expected: first `curl` prints `200`, second prints `404`.

- [ ] **Step 3: Commit**

```bash
git add content/directives/article-list/blog-index.mdx
git commit -m "$(cat <<'EOF'
docs: rewrite article-list fixture as Building a Blog Index

Replaces the "Introduction" placeholder (a stub that only existed as
sample data for the live article-list demo) with a real, practical
cookbook entry on the most common article-list use case.
EOF
)"
```

---

### Task 4: Rewrite the article-list cookbook — Tagging and Dates

**Files:**

- Create (via `git mv`): `content/directives/article-list/tagging-and-dates.mdx`
  (from `content/directives/article-list/basics.mdx`)

**Interfaces:** None (independent of Tasks 3, 5, 6 — see Task 3's Interfaces
note).

- [ ] **Step 1: Rename and rewrite**

```bash
git mv content/directives/article-list/basics.mdx content/directives/article-list/tagging-and-dates.mdx
```

Replace the full contents of
`content/directives/article-list/tagging-and-dates.mdx` with the following (copy
everything inside the outer fence, including the two inner `yaml` examples):

````mdx
---
title: Tagging and Dates
description: How publish-date and tags shape a listing's order and appearance.
publish-date: 2026-07-22
tags: [cookbook, frontmatter]
---

`::article-list` sorts by `publish-date` descending — newest first. Articles
without a `publish-date` always sort last, regardless of how recently they were
edited. If ordering matters for a directory — a blog, a changelog — set
`publish-date` on every entry:

```yaml
---
title: Shipping the new search
publish-date: 2026-04-02
---
```

`tags` renders as badges in both the article header and each row of a listing.
Because list rows are compact, keep tags short and few — a word or two, at most
three or four — so a row doesn't wrap:

```yaml
---
title: Shipping the new search
tags: [changelog, search]
---
```

See the full field reference in [Frontmatter](/reference/frontmatter).
````

- [ ] **Step 2: Verify**

Run: `bun run lint && bun run prettier` Expected: both exit 0, no errors.

Run: `bun run build` Expected: build succeeds.

Run:

```bash
bun run start &
SERVER_PID=$!
sleep 3
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/directives/article-list/tagging-and-dates
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/directives/article-list/basics
kill $SERVER_PID
```

Expected: first `curl` prints `200`, second prints `404`.

- [ ] **Step 3: Commit**

```bash
git add content/directives/article-list/tagging-and-dates.mdx
git commit -m "$(cat <<'EOF'
docs: rewrite article-list fixture as Tagging and Dates

Replaces the "Basics" placeholder with a real cookbook entry on how
publish-date and tags affect listing order and appearance.
EOF
)"
```

---

### Task 5: Rewrite the article-list cookbook — Building a Changelog

**Files:**

- Create (via `git mv`):
  `content/directives/article-list/advanced/changelog.mdx` (from
  `content/directives/article-list/advanced/patterns.mdx`)

**Interfaces:** None (independent of Tasks 3, 4, 6 — see Task 3's Interfaces
note).

- [ ] **Step 1: Rename and rewrite**

```bash
git mv content/directives/article-list/advanced/patterns.mdx content/directives/article-list/advanced/changelog.mdx
```

Replace the full contents of
`content/directives/article-list/advanced/changelog.mdx` with the following
(copy everything inside the outer fence, including the inner `mdx` example):

````mdx
---
title: Building a Changelog
description: Show only the most recent entries with the limit attribute.
publish-date: 2026-07-22
tags: [cookbook]
---

A changelog is just a directory of dated entries — but you rarely want to render
the entire history in one place. Pair `dir` with `limit` to cap how many entries
show:

```mdx
::article-list{dir=changelog limit=5}
```

`limit` truncates the list after it's already sorted, so you always get the N
most recent entries — this is the same directory `::article-list{dir=changelog}`
would otherwise render in full. Drop the limited version on a homepage or
sidebar as a "recent changes" widget, and link to `/changelog` — the full,
unlimited listing — for the complete history.
````

- [ ] **Step 2: Verify**

Run: `bun run lint && bun run prettier` Expected: both exit 0, no errors.

Run: `bun run build` Expected: build succeeds.

Run:

```bash
bun run start &
SERVER_PID=$!
sleep 3
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/directives/article-list/advanced/changelog
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/directives/article-list/advanced/patterns
kill $SERVER_PID
```

Expected: first `curl` prints `200`, second prints `404`.

- [ ] **Step 3: Commit**

```bash
git add content/directives/article-list/advanced/changelog.mdx
git commit -m "$(cat <<'EOF'
docs: rewrite article-list fixture as Building a Changelog

Replaces the "Common Patterns" placeholder with a real cookbook entry
on using the limit attribute to build a "recent changes" widget.
EOF
)"
```

---

### Task 6: Rewrite the article-list cookbook — Nested Sections with Recursive Listings

**Files:**

- Create (via `git mv`):
  `content/directives/article-list/advanced/nested-listings.mdx` (from
  `content/directives/article-list/advanced/techniques.mdx`)

**Interfaces:** None (independent of Tasks 3, 4, 5 — see Task 3's Interfaces
note).

- [ ] **Step 1: Rename and rewrite**

```bash
git mv content/directives/article-list/advanced/techniques.mdx content/directives/article-list/advanced/nested-listings.mdx
```

Replace the full contents of
`content/directives/article-list/advanced/nested-listings.mdx` with the
following (copy everything inside the outer fence, including the inner unlabeled
example):

````mdx
---
title: Nested Sections with Recursive Listings
description:
  Why this article lives in a subdirectory, and what recursive changes.
publish-date: 2026-07-22
tags: [cookbook]
---

This article lives in `article-list/advanced/` — a subdirectory of the directory
the [article-list reference page](/directives/article-list)'s live examples
query. It's invisible to the plain `::article-list{dir=directives/article-list}`
example there, and only appears once `recursive` is added. That's not a
coincidence to describe — compare the two examples on that page, and you're
looking at the actual mechanism, not just a description of it.

Use this for real content the same way: group related pages into a subdirectory
—

```
content/guides/authentication/oauth.mdx
content/guides/authentication/sessions.mdx
```

— then decide per listing whether callers should see just the top level or reach
into every subdirectory. A subdirectory's own `index.mdx` is always treated as a
peer article at its own slug, regardless of `recursive` — the flag only controls
whether the directory's _other_ contents also get pulled in.
````

- [ ] **Step 2: Verify**

Run: `bun run lint && bun run prettier` Expected: both exit 0, no errors.

Run: `bun run build` Expected: build succeeds.

Run:

```bash
bun run start &
SERVER_PID=$!
sleep 3
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/directives/article-list/advanced/nested-listings
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/directives/article-list/advanced/techniques
kill $SERVER_PID
```

Expected: first `curl` prints `200`, second prints `404`.

- [ ] **Step 3: Commit**

```bash
git add content/directives/article-list/advanced/nested-listings.mdx
git commit -m "$(cat <<'EOF'
docs: rewrite article-list fixture as Nested Sections with Recursive Listings

Replaces the "Advanced Techniques" placeholder with a real cookbook
entry that explains, using itself as the example, why this page only
appears in the recursive article-list demo.
EOF
)"
```

---

### Task 7: Publish the container directive formatting rule for end users

**Files:**

- Modify: `content/reference/mdx-directives.mdx`

**Interfaces:** None. This fixes the broken anchor link already present in
`content/reference/sidebar.mdx` (`#container-directive-formatting-rules`) — no
change to `sidebar.mdx` is needed; it already links to this exact anchor, it
just didn't resolve to anything before this task.

- [ ] **Step 1: Add the new section**

In `content/reference/mdx-directives.mdx`, insert a new section after the "##
Directive syntax" section's attribute table and before "## How directives map to
components". The heading text must be exactly "Container directive formatting
rules" — `sidebar.mdx` already links to
`/reference/mdx-directives#container-directive-formatting-rules`, and that
anchor is generated from this exact heading text by rehype-slug.

Find this exact text in the file:

```mdx
| `attr=5` | `number` | `limit=5` → `limit={5}` |

## How directives map to components
```

Replace it with (copy everything inside the outer fence below, including the
inner `mdx` example, then keep the trailing "## How directives map to
components" heading — it stays in the file, just with the new section inserted
above it). **The two trailing spaces on the `:::callout{type=tip}` line and the
`body, keep...` line inside the inner example are load-bearing** — they are
themselves an instance of the rule this section documents. Preserve them exactly
when you paste this into `mdx-directives.mdx`:

````mdx
| `attr=5` | `number` | `limit=5` → `limit={5}` |

## Container directive formatting rules

Container directives (`:::name` … `:::`) span multiple lines. Prettier's
`proseWrap: always` setting treats Markdown prose as reflowable text and will
merge those lines back together unless every line inside the block ends with two
trailing spaces (a Markdown hard line break):

```mdx
:::callout{type=tip}  
Two trailing spaces after this opening line, and after the last line of the
body, keep Prettier from collapsing the block.  
:::
```

This applies to the opening line, every body line, and — because there's nothing
after it to force a break — the last body line before the closing `:::`. It also
applies to an empty body: put the two trailing spaces on the opening line itself
so Prettier doesn't pull the closing `:::` up onto it.

Keep the opening line at 78 characters or fewer (before the two trailing
spaces). Longer lines cause Prettier to wrap mid-attribute-string, which breaks
the directive parser.

## How directives map to components
````

- [ ] **Step 2: Verify**

Run: `bun run lint && bun run prettier` Expected: both exit 0, no errors
(Prettier must not collapse the new example block — if it does, the
two-trailing-space lines were stripped by the edit; re-add them).

Run: `bun run build` Expected: build succeeds.

Run:

```bash
bun run start &
SERVER_PID=$!
sleep 3
curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000/reference/mdx-directives"
curl -s http://localhost:3000/reference/mdx-directives | grep -o 'id="container-directive-formatting-rules"'
kill $SERVER_PID
```

Expected: the first line prints `200`; the second prints
`id="container-directive-formatting-rules"` exactly once, confirming the heading
anchor `sidebar.mdx` links to now actually exists on the page.

- [ ] **Step 3: Commit**

```bash
git add content/reference/mdx-directives.mdx
git commit -m "$(cat <<'EOF'
docs: publish the container directive formatting rule for end users

sidebar.mdx already linked to
/reference/mdx-directives#container-directive-formatting-rules, but
that anchor didn't exist anywhere in content — the ::: trailing-space
rule was only documented in CLAUDE.md, for contributors. This adds the
end-user-facing version so the link resolves.
EOF
)"
```

---

### Task 8: Fix remaining stale links and domain references

**Files:**

- Modify: `content/guides/writing-content.mdx`
- Modify: `content/guides/customization.mdx`
- Modify: `README.md`

**Interfaces:** None.

- [ ] **Step 1: Fix the broken MDX Components link**

In `content/guides/writing-content.mdx`, change:

```mdx
Any valid Markdown is also valid MDX. You can embed JSX components anywhere in
the body. The built-in components are documented in
[MDX Components](/reference/mdx-components).
```

to:

```mdx
Any valid Markdown is also valid MDX. You can embed JSX components anywhere in
the body. The built-in components are documented in
[MDX Directives](/reference/mdx-directives).
```

(Both the link text and the href were wrong — `/reference/mdx-components`
doesn't exist; the real page is `content/reference/mdx-directives.mdx`, titled
"MDX Directives".)

- [ ] **Step 2: Fix the stale robots.txt domain example**

In `content/guides/customization.mdx`, change:

```txt
Sitemap: https://mssg.powerium.io/sitemap.xml
```

to:

```txt
Sitemap: https://mssg.mohandong.com/sitemap.xml
```

(The real `public/robots.txt` already says `mssg.mohandong.com` — this brings
the doc's example back in sync with it.)

- [ ] **Step 3: Fix the stale domain in README.md**

In `README.md`, change:

```md
Visit [mssg.powerium.io](https://mssg.powerium.io) to get started.
```

to:

```md
Visit [mssg.mohandong.com](https://mssg.mohandong.com) to get started.
```

- [ ] **Step 4: Verify**

Run: `bun run lint && bun run prettier` Expected: both exit 0, no errors.

Run: `bun run build` Expected: build succeeds.

Run:

```bash
grep -rn "mssg.powerium.io" --include="*.ts" --include="*.tsx" --include="*.mdx" --include="*.md" . \
  | grep -v node_modules | grep -v docs/superpowers/plans/2026-05-30-rss-feed.md
grep -rn "mdx-components" content/
```

Expected: both commands print nothing.

- [ ] **Step 5: Commit**

```bash
git add content/guides/writing-content.mdx content/guides/customization.mdx README.md
git commit -m "$(cat <<'EOF'
docs: fix stale mssg.powerium.io references and a broken internal link

writing-content.mdx linked to a page that doesn't exist
(/reference/mdx-components instead of /reference/mdx-directives);
customization.mdx's robots.txt example and README.md still referenced
the pre-move domain.
EOF
)"
```

---

### Task 9: Full verification pass

**Files:** None modified — this task only verifies the cumulative result of
Tasks 1–8.

**Interfaces:** None.

- [ ] **Step 1: Confirm lint, prettier, and build are all clean**

Run: `bun run lint && bun run prettier:check && bun run build` Expected: all
three succeed with no errors or unformatted-file warnings.

- [ ] **Step 2: Confirm every new route resolves and every removed route 404s**

```bash
bun run start &
SERVER_PID=$!
sleep 3

echo "--- expect 200 ---"
for path in \
  "/getting-started" \
  "/directives/article-list/blog-index" \
  "/directives/article-list/tagging-and-dates" \
  "/directives/article-list/advanced/changelog" \
  "/directives/article-list/advanced/nested-listings" \
  "/reference/mdx-directives" \
  "/guides/writing-content" \
  "/guides/customization" \
  ; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$path")
  echo "$path -> $code"
done

echo "--- expect 404 ---"
for path in \
  "/guides/getting-started" \
  "/directives/article-list/introduction" \
  "/directives/article-list/basics" \
  "/directives/article-list/advanced/patterns" \
  "/directives/article-list/advanced/techniques" \
  ; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$path")
  echo "$path -> $code"
done

kill $SERVER_PID
```

Expected: every path in the first loop prints `200`; every path in the second
loop prints `404`.

- [ ] **Step 3: Confirm zero remaining stale references**

```bash
grep -rn "mssg.powerium.io" --include="*.ts" --include="*.tsx" --include="*.mdx" --include="*.md" . \
  | grep -v node_modules | grep -v docs/superpowers/plans/2026-05-30-rss-feed.md
grep -rn "mdx-components" content/
grep -rn "Example Author" content/
```

Expected: all three commands print nothing.

- [ ] **Step 4: No commit for this task**

This is a verification-only task. If any check fails, fix the offending task's
files, re-commit there (or as a small follow-up fix commit), and re-run this
task's checks.
