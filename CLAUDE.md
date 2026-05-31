# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Purpose

The `main` branch of `powersagitar/mssg` is the **documentation + tutorial
site** for the mSSG project itself — explaining how to fork, configure, and use
it.

## Commands

Uses **bun** as the package manager.

```sh
bun dev              # Dev server with Turbopack
bun run build        # Production build
bun start            # Start production server
bun run lint         # ESLint
bun run prettier     # Format in-place
bun run prettier:check  # Check formatting (CI)
```

## Architecture

### Static Site Generation

All pages are pre-rendered at build time from MDX files via
`generateStaticParams` — no database, no runtime data fetching. `next start`
works normally.

### Content Model

All content lives in `content/`. URL paths map directly to the filesystem:

- If `content/<path>.mdx` exists → render that file.
- If `content/<path>/index.mdx` exists → render that file.
- If `content/<path>/` is a directory (no `index.mdx`) and has immediate `.mdx`
  files → render a non-recursive article listing.
- If `content/<path>/` is a directory (no `index.mdx`, no immediate `.mdx`
  files) → render a recursive listing of the full subtree. Returns 404 if no
  non-draft articles are found either way.
- Otherwise → 404.

Files and directories whose names start with `_` are excluded from all content
pipelines (`resolveContent`, `getArticlesInDir`, `getAllStaticPaths`). They have
no public URL and never appear in listings. Use the `_` prefix for
infrastructure files that live in `content/` but are not content pages (e.g.
`content/_nav.mdx`).

The root path `/` maps to `content/index.mdx`.

**Frontmatter schema** (unified, parsed by `gray-matter`):

```yaml
---
title: string # required
description: string # required
publish-date: string # optional, ISO date (e.g. 2025-01-01); shown in article header and listing cards
last-edited: string # optional, ISO date (e.g. 2025-01-01); shown in article header only when later than publish-date; falls back to filesystem mtime if omitted
author: string # optional; shown in article header if present
tags: string[] # optional; shown in article header if present
draft: boolean # optional; omits the file from directory listings
---
```

**Frontmatter field naming convention:** all multi-word field names use
kebab-case (e.g. `publish-date`, `last-edited`). Never use camelCase in
frontmatter keys.

### Directory Layout

Source code lives in `src/`; content lives at the project root. The `@/` alias
maps to `src/`.

```
src/
├── app/                  # Next.js App Router
│   ├── [[...slug]]/      # Single catch-all route for all content paths
│   ├── rss.xml/          # RSS 2.0 feed route
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ContentRenderer.tsx  # Shared file/directory rendering logic
│   ├── Sidebar.tsx          # Persistent left nav sidebar (client component)
│   ├── mdx/              # MDX component map + individual components
│   └── ui/               # shadcn/ui primitives (card, button, badge, …)
└── lib/                  # Utilities (mdx.ts, nav.ts, mdx-options.ts, remark-directive-components.ts, rss-render.ts, site.ts)
content/                  # Documentation + tutorial content for the project itself
├── _nav.mdx              # Sidebar nav definition — uses :::nav-section / ::nav-item / ::nav-dir directives
├── index.mdx             # Landing page at /
├── guides/               # Tutorial-style articles (getting-started, writing-content, customization)
├── reference/            # Reference docs (configuration, frontmatter, mdx-directives)
└── directives/           # One page per directive: synopsis + reference + examples
site.config.ts            # Site-specific values (name, url, description) — edit when forking
```

### Data Flow

1. `site.config.ts` (project root) — Site-specific values (`name`,
   `description`, `url`). Edit this file when forking. Imports `SiteConfig` from
   `src/lib/site.ts`. Imported via the `~/` alias (maps to project root).
2. `src/lib/site.ts` — Defines the `SiteConfig` interface only; no values.
3. `src/lib/mdx.ts` — All file system reads. Key functions:
   - `resolveContent(slugParts)` — resolves a path to `file`, `directory`, or
     `not-found`. Checks `<path>.mdx` first, then `<path>/index.mdx`, then
     checks the directory for immediate `.mdx` files (non-recursive,
     `recursive: false`) or, if none exist, scans the subtree recursively
     (`recursive: true`). The `recursive` flag is carried on the `directory`
     result and consumed by `ContentRenderer`.
   - `getArticlesInDir(dirSegments, recursive)` — returns sorted, non-draft
     articles in a directory. `index.mdx` files are never collected as files;
     instead, each subdirectory is checked for an `index.mdx` and, if found,
     that subdirectory is surfaced as a peer article at its own slug.
     `recursive` controls only whether the contents inside subdirectories are
     also collected — subdirectory `index.mdx` peers are always included.
   - `getAllStaticPaths()` — enumerates all routes for `generateStaticParams`.
     Non-root `index.mdx` files are not emitted as `/slug/index`; the directory
     path `/slug` is emitted instead. Directory paths are emitted for any
     directory that contains MDX files anywhere in its subtree (not just
     immediate children), so intermediate directories without direct `.mdx`
     files also get pre-rendered routes.
   - `normalizeFrontmatter(data)` — coerces gray-matter `Date` objects (parsed
     from bare YAML dates) back to `YYYY-MM-DD` strings.
   - `readMdxSource(filePath)` — reads raw MDX source.
   - `getLastModified(fsPath)` — returns filesystem mtime as ISO date string
     (`YYYY-MM-DD`); works for both files and directories.
4. `src/lib/mdx-options.ts` — Shared MDX compiler options (remark/rehype
   plugins). Spread into every `compile()` call alongside
   `outputFormat: 'function-body'`. Typed as
   `Omit<CompileOptions, 'outputFormat'>` from `@mdx-js/mdx`. Remark plugins:
   `remark-gfm`, `remark-math`, `remark-directive`, `remark-frontmatter`,
   `remarkDirectiveComponents`. Rehype plugins: `rehype-raw`, `rehype-slug`,
   `rehype-autolink-headings`, `rehype-pretty-code` (shiki, themes:
   `github-light`/`github-dark`), `rehype-katex`, `rehype-external-links`.
   **Note:** `rehype-format` is intentionally omitted — it inserts whitespace
   text nodes inside `<table>` elements which causes React hydration errors.
5. `src/lib/remark-directive-components.ts` — Remark plugin (runs after
   `remark-directive`) that converts directive AST nodes into
   `mdxJsxFlowElement` / `mdxJsxTextElement` nodes so the MDX component map can
   render them as React components. Directive names are converted from
   kebab-case to PascalCase (e.g. `article-list` → `ArticleList`). Attribute
   coercion: empty value → `{true}` (boolean flag), numeric string → `{number}`,
   otherwise string. Guards against remark-directive v4 creating nodes for
   digit-starting tokens (e.g. `:3000` in `localhost:3000` URLs).
6. `src/components/ContentRenderer.tsx` — Server component that handles both
   rendering branches: compiles MDX for file paths via `compile()` + `run()`
   from `@mdx-js/mdx` (frontmatter extracted separately with `gray-matter`);
   renders an `ArticleListItem` list for directory paths — recursive when
   `resolved.recursive` is true, non-recursive otherwise (404s if the list is
   empty). For file paths, the article header renders `title`, `description`
   (from frontmatter), author, publish-date, and tags. "Last Edited" (from
   `last-edited` frontmatter or `getLastModified` fallback) is shown only when
   it is strictly later than `publish-date`; for directory paths it is always
   shown. Also exports `generateContentMetadata` for use in `generateMetadata`.
7. `src/lib/nav.ts` (`server-only`) — Parses `content/_nav.mdx` to produce
   `NavSection[]`. `getNavSections()` reads the file, strips frontmatter with
   `gray-matter`, then line-scans for `:::nav-section{...}` / `:::` container
   blocks. Inside each block, `::nav-item{href title}` adds a single fixed link
   and `::nav-dir{dir}` calls `getArticlesInDir` to populate from a content
   directory. `type=directive` on `:::nav-section` sets `isDirective: true`
   (triggers `::` prefix rendering). Types: `NavItem = { href, title }`,
   `NavSection = { label, items, isDirective? }`.
8. `src/components/Sidebar.tsx` — Client component rendering the persistent left
   navigation sidebar. Receives `nav: NavSection[]` prop from the server layout
   (prop-threaded from `getNavSections()`). Includes theme toggle, GitHub link,
   and mobile off-canvas drawer (floating `<Menu>` button at top-left on small
   screens). `src/app/layout.tsx` also renders `<TableOfContents />` in a sticky
   right-rail aside (`xl:block`, 200px wide) — no `::table-of-contents`
   directive is needed in content files.
9. `src/app/[[...slug]]/page.tsx` — Single catch-all route. Delegates to
   `ContentRenderer`. Has `dynamicParams = false`; unknown paths 404.
10. `src/app/sitemap.ts` — Generates `/sitemap.xml` via Next.js
    `MetadataRoute.Sitemap`. Enumerates all routes with `getAllStaticPaths`;
    sets `lastModified` from `getLastModified` for both file and directory
    routes.
11. `src/app/rss.xml/route.tsx` — Statically prerendered RSS 2.0 Route Handler
    (`force-static`). Reads `siteConfig.rss.include` to collect content:
    `'none'` → empty feed, `'all'` → all non-draft articles via
    `getAllStaticPaths`, `string[]` → specific files/directories via
    `resolveContent`/`getArticlesInDir`. Compiles each MDX file with the
    `mdx-options.ts` pipeline, renders to HTML with `renderToStaticMarkup` (via
    `src/lib/rss-render.ts` shim — required because Next.js/Turbopack blocks
    direct `react-dom/server` imports from `app/` files), assembles the feed
    with the `feed` package, and returns `application/rss+xml`. Uses inline stub
    components (`rssComponents`) for custom MDX directives — **when new
    components are added to `src/components/mdx/index.tsx`, a corresponding stub
    must be added to `rssComponents` in this file**.

### MDX Directives

`src/components/mdx/index.tsx` exports `mdxComponents` — the component map
passed to the compiled MDX content component via
`<Content components={mdxComponents} />`. In content files, these components are
invoked through the `::directive-name{attrs}` syntax (handled by
`src/lib/remark-directive-components.ts`). The directive name is the kebab-case
form of the component name.

**`:::nav-section`, `::nav-item`, and `::nav-dir` are special directives**
parsed only in `content/_nav.mdx` by `src/lib/nav.ts` — they are **not** in
`mdxComponents` and cannot be used in regular content files. Their format is
documented in `content/reference/sidebar.mdx` and the `content/_nav.mdx` entry
of the Directory Layout above.

| Directive             | Component             | Props                                                     | Purpose                                                                                                                                              |
| --------------------- | --------------------- | --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `::article-list`      | `<ArticleList />`     | `dir: string`, `recursive?: boolean`, `limit?: number`    | Renders sorted article list from a content directory                                                                                                 |
| `::article-list-item` | `<ArticleListItem />` | `article: Article`, `urlPrefix: string`                   | Single list-style article row (also used by ArticleList)                                                                                             |
| `::table-of-contents` | `<TableOfContents />` | —                                                         | Inline use only — the component is already rendered in the layout right-rail automatically; directive is available for an additional inline instance |
| `::spacer`            | `<Spacer />`          | `size?: 'xs'\|'sm'\|'md'\|'lg'\|'xl'\|'2xl'`              | Vertical whitespace                                                                                                                                  |
| `:::timeline`         | `<Timeline />`        | —                                                         | Container for a vertical timeline                                                                                                                    |
| `:::timeline-item`    | `<TimelineItem />`    | `title`, `badges?` (pipe-separated)                       | Individual entry; badges rendered inline with `·`; children render as description                                                                    |
| `:::callout`          | `<Callout />`         | `type?: 'note'\|'tip'\|'important'\|'warning'\|'caution'` | GitHub-style callout box with colored border, background, and icon                                                                                   |

To add a new directive: create the component in `src/components/mdx/`, export it
from `src/components/mdx/index.tsx`. The `::kebab-case-name` directive form is
derived automatically — no changes to the remark plugin are needed.

#### Container directive formatting rules (`:::`)

Prettier (`proseWrap: always`) treats `:::name{attrs} … :::` blocks as prose and
will merge lines together unless hard line breaks are used. Every line inside a
container directive block must end with two trailing spaces (`  `):

```mdx
:::timeline-item{title="..." badges="..."}  
Description text here.  
:::
```

- **Opening line** — two trailing spaces prevent Prettier from merging the first
  body line onto it.
- **Last body line** — two trailing spaces prevent Prettier from merging the
  closing `:::` onto it.
- **Empty body** — two trailing spaces on the opening line prevent Prettier from
  merging the closing `:::` onto it.
- **Line length** — the opening line (before the two trailing spaces) must be ≤
  78 chars, so that the full line including the spaces stays within the 80-char
  print width. Longer lines cause Prettier to wrap mid-attribute-string,
  breaking the directive parser.

### App Router Pages

All routes are handled by `src/app/[[...slug]]/page.tsx`. The catch-all maps
every URL to `content/` via `resolveContent`.

`generateStaticParams` returns all content paths by appending `{ slug: [] }` for
root **last** in the array. Note: in Next.js 15, `{}` (empty object) for the
root entry breaks all prerendering — `{ slug: [] }` must be used instead.

### Styling

Tailwind CSS v4 with CSS custom property tokens (no `tailwind.config.*`). Theme
tokens are defined in `src/app/globals.css`. Dark mode via the `.dark` class
(managed by `next-themes`).

**Glassmorphism rule** — floating or overlapping UI elements that appear above
content should use a glassmorphism style: semi-transparent background
(`bg-background/70`), `backdrop-blur-md`, and a softened border
(`border-border/60`). Elements where the UI surface itself is the dominant
content (drawers, modals, cards, sidebars) should use a fully opaque background
(`bg-background`) and must not use `backdrop-blur`. Examples:

- ✅ Glassmorphism: the mobile "Menu" trigger button (floats over page content)
- ❌ No glassmorphism: the Drawer sheet, Sidebar, cards

Fonts are platform-native system font stacks — no web font downloads.
`--font-sans` starts with `-apple-system, BlinkMacSystemFont` (macOS/iOS), then
falls back to `'Segoe UI'`, `Roboto`, `'Helvetica Neue'`, `Arial`. `--font-mono`
starts with `ui-monospace, SFMono-Regular, 'SF Mono'`, then `Menlo`, `Monaco`,
`Consolas`, `'Liberation Mono'`, `'Courier New'`. Both are defined as CSS
variables in `@theme inline` and used via `var(--font-sans)` /
`var(--font-mono)`.

Prose/MDX content is styled via the `.prose` utility class defined in
`globals.css` (custom, not `@tailwindcss/typography`).

**Overflow handling for prose elements** — all prose elements that can exceed
the container width must be made safe on both mobile and desktop:

- `pre`, `table` — use `overflow-x-auto` (with `display: block` on `table` since
  `overflow-x` has no effect on `display: table`). Content scrolls horizontally
  rather than breaking the layout.
- `img`, `iframe` — use `max-w-full`. These are replaced elements where
  horizontal scrolling is not useful; constraining to the container width is the
  correct behavior.

### shadcn/ui Components

`components.json` is pre-configured (style: `new-york`, Tailwind v4, path
aliases). Installed primitives live in `src/components/ui/`:

| Component | Used in                          |
| --------- | -------------------------------- |
| `Button`  | `Sidebar` (nav links)            |
| `Badge`   | `ContentRenderer` (article tags) |

To add more:

```sh
bunx shadcn add <component>
```

**Prefer shadcn/ui primitives** — when building UI, always reach for an existing
shadcn/ui component (or add one with `bunx shadcn add`) before writing custom
markup. Only write bespoke HTML/Tailwind when no shadcn/ui primitive fits the
use case.

## Pre-commit Hooks

Husky runs `lint-staged` on every commit, which runs Prettier on all staged
files. Configuration in `package.json` under `"lint-staged"`.

## Code Conventions

- **Import order** enforced by Prettier: React/Next.js → third-party → `@/`
  internal → relative.
- `src/lib/mdx.ts`, `src/lib/mdx-options.ts`, and
  `src/lib/remark-directive-components.ts` all import `'server-only'` — any
  attempt to import them in a client component will cause a build error. Keep
  all file system access in these modules.
- `TableOfContents` and `Sidebar` are `'use client'` components.
  `TableOfContents` uses `IntersectionObserver` and is rendered persistently in
  the layout right-rail (`xl:` and above) — no `::table-of-contents` directive
  needed. `Sidebar` receives its `nav: NavSection[]` prop from the server layout
  (sourced from `getNavSections()` in `src/lib/nav.ts`); it uses `usePathname`
  for active-route highlighting, `useTheme` for the theme toggle, and `useState`
  for the mobile off-canvas open/close state.
- **Prefer `type` over `interface`** — use `type` for all TypeScript type
  definitions; avoid `interface`.
- **Remove unused code** — delete files, imports, components, and dependencies
  that are no longer used. Don't leave dead code behind when refactoring.
- **Keep CLAUDE.md current** — update it whenever components are added, renamed,
  or removed; plugins change; or architectural decisions are made. It should
  always reflect the actual state of the codebase.
- **Keep `rssComponents` stubs current** — `src/app/rss.xml/route.tsx` defines
  stub implementations of every custom MDX component for RSS rendering. When a
  component is added to or removed from `src/components/mdx/index.tsx`, update
  `rssComponents` in the RSS route handler to match.
- **Keep docs and examples current** — whenever a directive/component is added,
  renamed, removed, or its props change: (1) add or update its page in
  `content/directives/` (synopsis, reference table with "Attribute" columns, and
  live examples), (2) update the directive and component columns in
  `content/reference/mdx-components.mdx`. New content features (plugins,
  frontmatter fields, etc.) follow the same rule: update the relevant reference
  doc in `content/reference/`.
