# RSS Feed Design

**Date:** 2026-05-30 **Goal:** Add a statically prerendered RSS 2.0 feed at
`/rss.xml` with configurable content inclusion, suitable for cross-posting to
dev.to.

---

## Overview

A Next.js Route Handler at `src/app/rss.xml/route.ts` generates an RSS 2.0 feed
using the `feed` npm package. It is statically prerendered at build time
(`force-static`). Each feed item includes full compiled HTML via
`<content:encoded>`, produced by the existing MDX pipeline plus React's
`renderToStaticMarkup`. Which content is included is controlled by a new `rss`
field in `site.config.ts`.

---

## SiteConfig Extension

`src/lib/site.ts` gains a `RssConfig` type and an optional `rss` field:

```ts
type RssConfig = {
  include: 'none' | 'all' | string[];
};

type SiteConfig = {
  name: string;
  description: string;
  url: string;
  author?: string;
  repository?: string;
  branch?: string;
  rss?: RssConfig; // omitting = { include: 'none' }
};
```

`include` semantics:

- `'none'` (default when `rss` is omitted) — feed route exists but returns an
  empty `<channel>` with no items.
- `'all'` — all non-draft published content across the full site.
- `string[]` — explicit list of paths relative to `content/`, without the `.mdx`
  extension. Each entry is resolved via `resolveContent`: files are collected
  directly; directories collect all non-draft articles via `getArticlesInDir`,
  using the same recursive/non-recursive logic as the content model.

`site.config.ts` is updated to add a commented example showing all three modes,
defaulting to `{ include: 'none' }`.

---

## Feed Generation (`src/app/rss.xml/route.ts`)

### Static prerendering

```ts
export const dynamic = 'force-static';
```

Next.js prerenders the route at build time alongside all content pages.

### Item collection

1. Read `siteConfig.rss?.include` (default `'none'`).
2. `'none'` → empty items array, skip to feed construction.
3. `'all'` → call `getAllStaticPaths()`, resolve each path with
   `resolveContent`, keep `kind === 'file'` results.
4. `string[]` → for each entry, call `resolveContent(entry.split('/'))`:
   - `kind === 'file'` → collect that file directly.
   - `kind === 'directory'` → call `getArticlesInDir` with `resolved.recursive`,
     collect all returned articles.
   - `kind === 'not-found'` → skip silently.

Deduplicate by `filePath` (a directory entry and an explicit file entry could
overlap).

### Content rendering

For each collected file:

1. `readMdxSource(filePath)` + `gray-matter` to extract frontmatter and raw MDX
   body.
2. Compile with
   `compile(source, { ...mdxOptions, outputFormat: 'function-body' })`.
3. `run()` (from `@mdx-js/mdx`) the compiled output with
   `{ ...runtime, baseUrl: import.meta.url }` where `runtime` is
   `react/jsx-runtime`.
4. `renderToStaticMarkup(<Content components={rssComponents} />)` to produce the
   HTML string.

**RSS stub components** (`rssComponents`) — defined inline in the route file:

| Component         | Stub behavior                              |
| ----------------- | ------------------------------------------ |
| `Callout`         | render children                            |
| `Timeline`        | render children                            |
| `TimelineItem`    | render `<strong>title</strong>` + children |
| `ArticleList`     | render nothing                             |
| `ArticleListItem` | render nothing                             |
| `TableOfContents` | render nothing                             |
| `Spacer`          | render nothing                             |
| `ProgressBar`     | render nothing                             |

### Feed construction (`feed` package)

```
Feed({
  title: siteConfig.name,
  description: siteConfig.description,
  id: siteConfig.url,
  link: siteConfig.url,
  copyright: siteConfig.author ?? '',
  feedLinks: { rss2: `${siteConfig.url}/rss.xml` },
  author: { name: siteConfig.author },
})
```

Each item:

- `title` — frontmatter `title`
- `description` — frontmatter `description`
- `link` — `${siteConfig.url}${urlPath}` (canonical URL; dev.to reads this as
  `canonical_url`)
- `id` — same as `link`
- `date` — `publish-date` frontmatter → `last-edited` frontmatter →
  `getLastModified(filePath)` (filesystem mtime)
- `content` — compiled HTML string (mapped to `<content:encoded>`)

Items are sorted newest-first by date before insertion.

### Response

```ts
return new Response(feed.rss2(), {
  headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
});
```

---

## Files Changed

| File                       | Change                                                         |
| -------------------------- | -------------------------------------------------------------- |
| `src/lib/site.ts`          | Add `RssConfig` type; add `rss?: RssConfig` to `SiteConfig`    |
| `src/app/rss.xml/route.ts` | New Route Handler                                              |
| `site.config.ts`           | Add `rss: { include: 'none' }` with comments showing all modes |
| `package.json`             | Add `feed` dependency                                          |

---

## Non-goals

- Atom or JSON Feed variants (RSS 2.0 is sufficient for dev.to import).
- Per-item author override (all items use `siteConfig.author`).
- Pagination or item limits (dev.to import reads the whole feed once).
