# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Purpose

The `main` branch of `powersagitar/mssg` is the **documentation + tutorial
site** for the mSSG project itself — explaining how to fork, configure, and use
it. mSSG is a minimal, file-based static site generator built on Next.js, MDX,
and shadcn/ui — no database, no CMS.

## Commands

Uses **bun** as the package manager.

```sh
bun dev                 # Dev server with Turbopack
bun run build            # Production build
bun start                # Start production server
bun run lint             # ESLint
bun run prettier         # Format in-place
bun run prettier:check   # Check formatting (CI)
```

A `PostToolUse` hook (`.claude/settings.json`) runs `bun run lint` then
`bun run prettier` automatically after every Edit/Write/NotebookEdit, and blocks
with the error output if either fails — no need to run them manually.

**Periodically (not every change, but every so often)**, sweep `src/` and
`content/` for Tailwind arbitrary-value classes (`*-[...]`) that exactly match a
named token in `node_modules/tailwindcss/theme.css` (e.g. `text-[12px]` →
`text-xs`) and replace them with the canonical utility class. Only replace when
the arbitrary value is an exact match — leave values with no canonical
equivalent as-is.

There is no test suite.

## Architecture

### Content model

All content lives in `content/`; the `@/` alias maps to `src/`. All pages are
pre-rendered at build time from MDX files — no runtime data fetching.
`src/app/[[...slug]]/page.tsx` is the single catch-all route; it calls
`resolveContent(slugParts)` in `src/lib/mdx.ts`, which resolves a URL path
against the filesystem in this order:

1. `content/<path>.mdx` → render that file.
2. `content/<path>/index.mdx` → render that file.
3. `content/<path>/` with immediate `.mdx` files (no `index.mdx`) →
   non-recursive article listing.
4. `content/<path>/` with no immediate `.mdx` files → recursive listing of the
   full subtree. 404 if no non-draft articles are found either way.
5. Otherwise → 404 (`dynamicParams = false`, so unknown paths always 404).

The root path `/` maps to `content/index.mdx`.

Files/directories starting with `_` are excluded from every content pipeline
(e.g. `content/_nav.mdx`) via a shared `isExcluded(name)` helper in
`src/lib/mdx.ts`, used by `resolveContent`, `getArticlesInDir`, and
`getAllStaticPaths`. Use this prefix for anything under `content/` you don't
want published.

`getArticlesInDir(dirSegments, recursive)` never collects `index.mdx` as a file
— instead each subdirectory with an `index.mdx` is surfaced as a peer article at
its own slug (subdirectory peers are included regardless of `recursive`; only
descending further into their contents is gated by it).

`getAllStaticPaths()` drives `generateStaticParams` (must append `{ slug: [] }`
for root, not `{}` — an empty object breaks all prerendering on Next.js 15) and
`src/app/sitemap.ts`.

**Frontmatter schema** (parsed by `gray-matter`; all multi-word keys are
kebab-case, never camelCase):

```yaml
---
title: string # required
description: string # required
publish-date: string # optional, ISO date; shown in header and listing cards
last-edited: string # optional, ISO date; shown only if later than publish-date,
#                       else falls back to filesystem mtime
author: string # optional
tags: string[] # optional
draft: boolean # optional; omits the file from listings and static paths
---
```

### Rendering pipeline

`src/components/ContentRenderer.tsx` is the server component behind every route:
for files it compiles MDX via `@mdx-js/mdx`'s `compile()`/`run()` using shared
options from `src/lib/mdx-options.ts`, then renders the article header (title,
description, author, publish-date, tags) plus
`<Content components={mdxComponents} />`. For directories it renders a grid of
`ArticleListItem`s. It also exports `generateContentMetadata`, used from
`generateMetadata`.

`src/lib/mdx-options.ts` plugins (spread into every `compile()` call):
remark-gfm, remark-math, remark-directive, remark-frontmatter,
`remarkDirectiveComponents`; rehype-raw, rehype-slug, rehype-autolink-headings,
rehype-pretty-code (shiki, github-light/github-dark), rehype-katex,
rehype-external-links. `rehype-format` is intentionally omitted — it inserts
whitespace text nodes inside `<table>` that break React hydration.

`src/lib/remark-directive-components.ts` converts `::directive{attrs}` AST nodes
into JSX elements the MDX component map can render, converting kebab-case →
PascalCase and coercing attributes (empty → `{true}`, numeric string →
`{number}`, else string). It also guards against remark-directive v4 misparsing
digit-starting tokens like the `:3000` in `localhost:3000`.

Last-edited dates are threaded from `ContentRenderer` to the sidebar via React
context (`src/components/LastEditedContext.tsx`, provided in `layout.tsx`,
consumed by `Sidebar.tsx`) since the sidebar has no direct access to page
frontmatter.

`src/app/not-found.tsx` renders `ResolveTrace`
(`src/components/ResolveTrace.tsx`), a decorative client component that
re-derives and displays the same file/index/directory probe order
`resolveContent` uses, for the 404 page.

### Navigation

`src/lib/nav.ts` (`server-only`) parses `content/_nav.mdx` line-by-line for
`:::nav-section{...}` blocks containing `::nav-item{href title}` (a fixed link)
or `::nav-dir{dir}` (populated via `getArticlesInDir`). `type=directive` on
`:::nav-section` renders items with a `::` prefix. `src/components/Sidebar.tsx`
(client) receives the resulting `NavSection[]` as a prop and renders theme
toggle, GitHub link, and a mobile off-canvas `Drawer` with `Tabs` (Navigation /
Contents). `src/components/mdx/TableOfContents.tsx` (client,
`IntersectionObserver`) is rendered persistently in the layout's right rail — no
directive needed for it to appear.

### RSS and sitemap

`src/app/rss.xml/route.tsx` (`force-static`) reads `siteConfig.rss`
(`'none' | 'all' | string[]`), resolves content the same way as pages
(`getAllStaticPaths`/`resolveContent`/`getArticlesInDir`), compiles each MDX
file with `mdx-options.ts`, and renders to HTML with `renderToStaticMarkup` via
the `src/lib/rss-render.ts` shim (needed because Next.js/Turbopack blocks direct
`react-dom/server` imports from `app/` files). It uses inline stub components
(`rssComponents`) for custom MDX directives — **keep these in sync with
`src/components/mdx/index.tsx`**. `src/app/sitemap.ts` enumerates
`getAllStaticPaths()` and sets `lastModified` via `getLastModified`.

### MDX directives

`src/components/mdx/index.tsx` exports `mdxComponents`, keyed by the PascalCase
component name; the kebab-case `::directive-name{attrs}` form is derived
automatically by the remark plugin above — adding a directive only requires
creating the component and exporting it here.

| Directive             | Component             | Props                                                     | Purpose                                        |
| --------------------- | --------------------- | --------------------------------------------------------- | ---------------------------------------------- |
| `::article-list`      | `<ArticleList />`     | `dir`, `recursive?`, `limit?`                             | Sorted article list from a content directory   |
| `::article-list-item` | `<ArticleListItem />` | `article`, `urlPrefix`                                    | Single list-style article row                  |
| `::table-of-contents` | `<TableOfContents />` | —                                                         | Extra inline instance (already auto-rendered)  |
| `::spacer`            | `<Spacer />`          | `size?: 'xs'\|'sm'\|'md'\|'lg'\|'xl'\|'2xl'`              | Vertical whitespace                            |
| `::progress-bar`      | `<ProgressBar />`     | `value?`, `start?`, `end?`, `label?`                      | Static or time-derived progress bar            |
| `:::timeline`         | `<Timeline />`        | —                                                         | Vertical timeline container                    |
| `:::timeline-item`    | `<TimelineItem />`    | `title`, `badges?` (pipe-separated)                       | Timeline entry; children render as description |
| `:::callout`          | `<Callout />`         | `type?: 'note'\|'tip'\|'important'\|'warning'\|'caution'` | GitHub-style callout box                       |

`:::nav-section`, `::nav-item`, `::nav-dir` are **not** in `mdxComponents` —
they're a separate mini-syntax parsed only from `content/_nav.mdx` by
`src/lib/nav.ts` (documented in `content/reference/sidebar.mdx`).

#### Container directive formatting (`:::`)

Prettier (`proseWrap: always`) treats `:::name{attrs} … :::` as prose and will
merge lines unless hard line breaks are used — end every line inside a container
directive block with two trailing spaces:

```mdx
:::timeline-item{title="..." badges="..."}  
Description text here.  
:::
```

The opening line (before the trailing spaces) must stay ≤ 78 chars, or Prettier
will wrap mid-attribute-string and break the directive parser.

### Styling

Tailwind CSS v4 with CSS custom property tokens (no `tailwind.config.*`); tokens
live in `src/app/globals.css`. Dark mode via the `.dark` class (`next-themes`).
Fonts are platform-native system stacks (no web fonts), defined as
`--font-sans`/`--font-mono` CSS variables. `.prose` is a custom utility (not
`@tailwindcss/typography`).

**Glassmorphism** — floating elements above content (e.g. the mobile menu
trigger) use `bg-background/70` + `backdrop-blur-md` + `border-border/60`.
Elements where the surface _is_ the content (drawers, cards, the sidebar) use
opaque `bg-background` and must not blur.

**Prose overflow** — `pre`/`table` use `overflow-x-auto` (`table` also needs
`display: block`, since `overflow-x` has no effect on `display: table`);
`img`/`iframe` use `max-w-full`.

### shadcn/ui

`components.json` is pre-configured (style: `new-york`, Tailwind v4). Installed
primitives in `src/components/ui/`: `Button` (Sidebar nav links), `Badge`
(article tags), `Drawer` + `Tabs` (Sidebar mobile off-canvas nav). Prefer an
existing/added shadcn primitive (`bunx shadcn add <component>`) over bespoke
markup.

## Pre-commit hooks

Husky runs `lint-staged` on every commit (Prettier on staged files); config in
`package.json`.

## Code conventions

- **Import order** enforced by Prettier: React/Next.js → third-party → `@/`
  internal → relative.
- `src/lib/mdx.ts`, `src/lib/mdx-options.ts`, `src/lib/nav.ts`, and
  `src/lib/remark-directive-components.ts` import `'server-only'` — keep all
  filesystem access in these modules; importing them from a client component is
  a build error.
- **Prefer `type` over `interface`** for all TypeScript definitions.
- **Remove unused code** — delete files, imports, components, and dependencies
  that are no longer used rather than leaving dead code behind.
- **Keep in sync when directives/components change**: `rssComponents` in
  `src/app/rss.xml/route.tsx`; the directive table above; the corresponding page
  in `content/directives/`; and the table in
  `content/reference/mdx-directives.mdx`.
- **Keep this file current** — update it when components, plugins, or
  architectural decisions change.
