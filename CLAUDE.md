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

All content lives in `content/`:

- `content/blog/*.mdx` — Blog posts. Filename becomes the URL slug
  (`hello-world.mdx` → `/blog/hello-world`).
- `content/pages/*.mdx` — Standalone pages. `home.mdx` renders at `/`; other
  files (e.g. `about.mdx`) render at `/<slug>`.

**Blog post frontmatter schema** (parsed by `gray-matter`):

```yaml
---
title: string # required
date: string # required, ISO date (e.g. 2025-01-01)
description: string # required
tags: string[] # optional
draft: boolean # optional, omits post from all listings
---
```

### Directory Layout

Source code lives in `src/`; content lives at the project root. The `@/` alias
maps to `src/`.

```
src/
├── app/          # Next.js App Router (pages, layout, globals.css)
├── components/   # React components
│   └── mdx/      # MDX component map + individual components
└── lib/          # Server-only utilities (mdx.ts, mdx-options.ts)
content/
├── blog/         # Blog post MDX files
└── pages/        # Standalone page MDX files
```

### Data Flow

1. `src/lib/mdx.ts` — All file system reads. Functions: `getAllBlogPosts()`,
   `getBlogSource(slug)`, `getPageSource(page)`, `getBlogSlugs()`,
   `getPageSlugs()`. Called only at build time (server components).
2. `src/lib/mdx-options.ts` — Shared MDX compiler options (remark/rehype
   plugins). Passed as `options: { mdxOptions }` to every `compileMDX()` call.
   Plugins: `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`,
   `rehype-pretty-code` (syntax highlighting via shiki, themes:
   `github-light`/`github-dark`).
3. App Router pages call `compileMDX()` from `next-mdx-remote/rsc` to turn MDX
   source into React elements.

### MDX Components

`src/components/mdx/index.tsx` exports `mdxComponents` — the component map
passed to every `compileMDX()` call. Custom components usable inside any MDX
file:

| Component             | Props                                        | Purpose                                                     |
| --------------------- | -------------------------------------------- | ----------------------------------------------------------- |
| `<BlogList />`        | `limit?: number`                             | Renders sorted post cards, latest first                     |
| `<BlogPostCard />`    | `post: BlogPost`                             | Single post card (also used by BlogList)                    |
| `<TableOfContents />` | —                                            | Client component; auto-detects `h2`/`h3`, highlights active |
| `<Spacer />`          | `size?: 'xs'\|'sm'\|'md'\|'lg'\|'xl'\|'2xl'` | Vertical whitespace                                         |

To add a new MDX component: create it in `src/components/mdx/`, export it from
`src/components/mdx/index.tsx`.

### App Router Pages

| Route          | Source                                                  |
| -------------- | ------------------------------------------------------- |
| `/`            | `content/pages/home.mdx`                                |
| `/blog`        | lists all non-draft posts via `getAllBlogPosts()`       |
| `/blog/[slug]` | `content/blog/<slug>.mdx`                               |
| `/[slug]`      | `content/pages/<slug>.mdx` (any file except `home.mdx`) |

`src/app/[slug]/page.tsx` has `export const dynamicParams = false` — unknown
slugs 404 without a runtime.

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

### Adding shadcn/ui Components

```sh
bunx shadcn add <component>
```

`components.json` is pre-configured (style: `new-york`, Tailwind v4, path
aliases).

## Pre-commit Hooks

Husky runs `lint-staged` on every commit, which runs Prettier on all staged
files. Configuration in `package.json` under `"lint-staged"`.

## Code Conventions

- **Import order** enforced by Prettier: React/Next.js → third-party → `@/`
  internal → relative.
- `src/lib/mdx.ts` and `src/lib/mdx-options.ts` both import `'server-only'` —
  any attempt to import them in a client component will cause a build error.
  Keep all file system access in these modules.
- `TableOfContents` is the only `'use client'` component — it uses
  `IntersectionObserver` to track scroll position.
