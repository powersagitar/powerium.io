# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

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
└── lib/                  # Server-only utilities (mdx.ts, mdx-options.ts)
content/
├── index.mdx             # Renders at /
├── about.mdx             # Renders at /about
└── blog/                 # Renders listing at /blog; each file at /blog/<slug>
```

### Data Flow

1. `src/lib/mdx.ts` — All file system reads. Key functions:
   - `resolveContent(slugParts)` — resolves a path to `file`, `directory`, or
     `not-found`.
   - `getArticlesInDir(dirSegments)` — returns sorted, non-draft articles in a
     directory.
   - `getAllStaticPaths()` — enumerates all routes for `generateStaticParams`.
   - `readMdxSource(filePath)` — reads raw MDX source.
2. `src/lib/mdx-options.ts` — Shared MDX compiler options (remark/rehype
   plugins). Passed as `options: { mdxOptions }` to every `compileMDX()` call.
   Remark plugins: `remark-gfm`, `remark-math`, `remark-directive`,
   `remark-frontmatter`. Rehype plugins: `rehype-raw`, `rehype-slug`,
   `rehype-autolink-headings`, `rehype-pretty-code` (shiki, themes:
   `github-light`/`github-dark`), `rehype-katex`, `rehype-external-links`.
   **Note:** `rehype-format` is intentionally omitted — it inserts whitespace
   text nodes inside `<table>` elements which causes React hydration errors.
3. `src/components/ContentRenderer.tsx` — Server component that handles both
   rendering branches: compiles MDX for file paths; renders `ArticleListItem`
   list for directory paths. Also exports `generateContentMetadata` for use in
   `generateMetadata`.
4. `src/app/[[...slug]]/page.tsx` — Single catch-all route. Delegates to
   `ContentRenderer`. Has `dynamicParams = false`; unknown paths 404.

### MDX Components

`src/components/mdx/index.tsx` exports `mdxComponents` — the component map
passed to every `compileMDX()` call. Custom components usable inside any MDX
file:

| Component             | Props                                        | Purpose                                                     |
| --------------------- | -------------------------------------------- | ----------------------------------------------------------- |
| `<ArticleList />`     | `dir: string`, `limit?: number`              | Renders sorted article list from a content directory        |
| `<ArticleListItem />` | `article: Article`, `urlPrefix: string`      | Single list-style article row (also used by ArticleList)    |
| `<TableOfContents />` | —                                            | Client component; auto-detects `h2`/`h3`, highlights active |
| `<Spacer />`          | `size?: 'xs'\|'sm'\|'md'\|'lg'\|'xl'\|'2xl'` | Vertical whitespace                                         |

To add a new MDX component: create it in `src/components/mdx/`, export it from
`src/components/mdx/index.tsx`.

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
- `src/lib/mdx.ts` and `src/lib/mdx-options.ts` both import `'server-only'` —
  any attempt to import them in a client component will cause a build error.
  Keep all file system access in these modules.
- `TableOfContents` and `BackToHome` are `'use client'` components —
  `TableOfContents` uses `IntersectionObserver`; `BackToHome` uses `usePathname`
  to hide itself on the root route.
- **Remove unused code** — delete files, imports, components, and dependencies
  that are no longer used. Don't leave dead code behind when refactoring.
- **Keep CLAUDE.md current** — update it whenever components are added, renamed,
  or removed; plugins change; or architectural decisions are made. It should
  always reflect the actual state of the codebase.
