<!-- markdownlint-disable MD033 -->

# powerium.io

Thank you for stopping by. This is the repository that powers
[powerium.io](https://www.powerium.io), my blog site.

It's designed with performance in mind. Although not as performant as intended,
yet, I'm actively trying to optimize every single tiny bit of the code.

Feel free to open an issue or a PR if you would like.

## Tech Stack

- Framework: [Next.js (App Router)](https://nextjs.org)
- Styling: [Tailwind CSS](https://tailwindcss.com)
- CMS: [Notion](https://www.notion.so)
- Component Library: [shadcn/ui](https://ui.shadcn.com)
- Hosting: [Vercel](https://vercel.com/)

## Supported Notion Blocks

See [#45](https://github.com/powersagitar/powerium.io/issues/45).

## Preview

| Home                                                                                                       | Blog Post                                                                                                                                                                                                                     |
| :--------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [![home page of powerium.io](https://image.thum.io/get/https://www.powerium.io/)](https://www.powerium.io) | [![configuration guide of powerium.io](https://image.thum.io/get/https://www.powerium.io/blog/2024/11/09/configuring-powersagitar-powerium-io)](https://www.powerium.io/blog/2024/11/09/configuring-powersagitar-powerium-io) |

Above are snapshots of [powerium.io](https://www.powerium.io) at this very
moment. It's deployed straight from `main`, without any hidden magic.

## Configuration Guide

Please see the
[guide](https://www.powerium.io/blog/2024/11/09/configuring-powersagitar-powerium-io)
on [powerium.io](https://www.powerium.io).

## Running a Local Development Server

<!-- prettier-ignore -->
> [!TIP]
> This site is developed using [bun](https://bun.sh). Please run the dev server
> with `bun` in case of any issues.

1. Create a new integration and database for development purposes.
2. Add the environment variables to
   [`.env.local`](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables).
3. Run the development server:

```zsh
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
