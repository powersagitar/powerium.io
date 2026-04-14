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
- If `content/<path>/` is a directory → render an article listing of all MDX
  files in it.
- Otherwise → 404.

The root path `/` maps to `content/index.mdx`.

**Frontmatter schema** (unified, parsed by `gray-matter`):

```yaml
---
title: string # required
description: string # required
date: string # optional, ISO date (e.g. 2025-01-01); shown in article header and listing cards
lastEdited: string # optional, ISO date (e.g. 2025-01-01); shown in article header only when later than date; falls back to filesystem mtime if omitted
author: string # optional; shown in article header if present
tags: string[] # optional; shown in article header if present
draft: boolean # optional; omits the file from directory listings
---
```

### Directory Layout

Source code lives in `src/`; content lives at the project root. The `@/` alias
maps to `src/`.

```
src/
├── app/                  # Next.js App Router
│   ├── [[...slug]]/      # Single catch-all route for all content paths
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ContentRenderer.tsx  # Shared file/directory rendering logic
│   ├── mdx/              # MDX component map + individual components
│   └── ui/               # shadcn/ui primitives (card, button, badge, …)
└── lib/                  # Utilities (mdx.ts, mdx-options.ts, remark-directive-components.ts, site.ts)
content/                  # Documentation + tutorial content for the project itself
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
     `not-found`.
   - `getArticlesInDir(dirSegments)` — returns sorted, non-draft articles in a
     directory.
   - `getAllStaticPaths()` — enumerates all routes for `generateStaticParams`.
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
   renders `ArticleListItem` list for directory paths. For file paths, "Last
   Edited" (from `lastEdited` frontmatter or `getLastModified` fallback) is
   shown only when it is strictly later than `date`; for directory paths it is
   always shown. Also exports `generateContentMetadata` for use in
   `generateMetadata`.
7. `src/app/[[...slug]]/page.tsx` — Single catch-all route. Delegates to
   `ContentRenderer`. Has `dynamicParams = false`; unknown paths 404.
8. `src/app/sitemap.ts` — Generates `/sitemap.xml` via Next.js
   `MetadataRoute.Sitemap`. Enumerates all routes with `getAllStaticPaths`; sets
   `lastModified` from `getLastModified` for both file and directory routes.

### MDX Directives

`src/components/mdx/index.tsx` exports `mdxComponents` — the component map
passed to the compiled MDX content component via
`<Content components={mdxComponents} />`. In content files, these components are
invoked through the `::directive-name{attrs}` syntax (handled by
`src/lib/remark-directive-components.ts`). The directive name is the kebab-case
form of the component name.

| Directive             | Component             | Props                                                  | Purpose                                                                           |
| --------------------- | --------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------- |
| `::article-list`      | `<ArticleList />`     | `dir: string`, `recursive?: boolean`, `limit?: number` | Renders sorted article list from a content directory                              |
| `::article-list-item` | `<ArticleListItem />` | `article: Article`, `urlPrefix: string`                | Single list-style article row (also used by ArticleList)                          |
| `::table-of-contents` | `<TableOfContents />` | —                                                      | Client component; auto-detects `h2`/`h3`, highlights active                       |
| `::spacer`            | `<Spacer />`          | `size?: 'xs'\|'sm'\|'md'\|'lg'\|'xl'\|'2xl'`           | Vertical whitespace                                                               |
| `:::timeline`         | `<Timeline />`        | —                                                      | Container for a vertical timeline                                                 |
| `:::timeline-item`    | `<TimelineItem />`    | `title`, `badges?` (pipe-separated)                    | Individual entry; badges rendered inline with `·`; children render as description |

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

Fonts are platform-native: `--font-sans` resolves to SF Pro on macOS/iOS, Segoe
UI on Windows, Roboto on Android. `--font-mono` resolves to SF Mono on macOS,
Cascadia Code on Windows, etc. Both are defined as CSS variables in `@theme` and
used via `var(--font-sans)` / `var(--font-mono)` — no web font downloads.

Prose/MDX content is styled via the `.prose` utility class defined in
`globals.css` (custom, not `@tailwindcss/typography`).

### shadcn/ui Components

`components.json` is pre-configured (style: `new-york`, Tailwind v4, path
aliases). Installed primitives live in `src/components/ui/`:

| Component | Used in                          |
| --------- | -------------------------------- |
| `Button`  | `BackToHome` (variant `ghost`)   |
| `Badge`   | `ContentRenderer` (article tags) |

To add more:

```sh
bunx shadcn add <component>
```

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
- `TableOfContents` and `BackToHome` are `'use client'` components —
  `TableOfContents` uses `IntersectionObserver`; `BackToHome` uses `usePathname`
  to hide itself on the root route.
- **Prefer `type` over `interface`** — use `type` for all TypeScript type
  definitions; avoid `interface`.
- **Remove unused code** — delete files, imports, components, and dependencies
  that are no longer used. Don't leave dead code behind when refactoring.
- **Keep CLAUDE.md current** — update it whenever components are added, renamed,
  or removed; plugins change; or architectural decisions are made. It should
  always reflect the actual state of the codebase.
- **Keep docs and examples current** — whenever a directive/component is added,
  renamed, removed, or its props change: (1) add or update its page in
  `content/directives/` (synopsis, reference table with "Attribute" columns, and
  live examples), (2) update the directive and component columns in
  `content/reference/mdx-components.mdx`. New content features (plugins,
  frontmatter fields, etc.) follow the same rule: update the relevant reference
  doc in `content/reference/`.
