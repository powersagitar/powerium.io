---
sidebar_position: 2
---

# Configuration

## Create a Notion Integration

The site relies on a Notion integration to fetch data.

To create one:

1. Go to [developers.notion.com](https://developers.notion.com/), and click on
   _View my Integrations_ in the top right corner.

![image](https://github.com/user-attachments/assets/02f06309-5325-49a6-8690-195cff4942c4)

2. In _Integrations_, create a new integration.

![image](https://github.com/user-attachments/assets/775f175c-ab0d-44ea-a848-d084d303f165)

3. Fill in the details and save.

- **Associated workspace**: The workspace you would like to keep the blog database
  in. The database properties are described in [Set Up the Blog Database](#set-up-the-blog-database).

- **Type**: _Internal_

![image](https://github.com/user-attachments/assets/1ae44b7e-3552-493c-8365-9d892a569c8e)

4. Final bits

- **Internal Integration Secret**: This will be your [`notionApiKey`](#confignotionts)

- **Content Capabilities**: _Read content_

- **User Capabilities**: _No user information_

![image](https://github.com/user-attachments/assets/1fd3600e-88a7-435e-a426-2b6e91f9bca3)

## Set Up the Blog Database

:::tip
Properties names are **case-sensitive**.
:::

Create a Notion database with following properties:

| Name          | Type  | Description                                                                     |
| :------------ | :---- | :------------------------------------------------------------------------------ |
| `title`       | Title | Title of the blog post.                                                         |
| `published`   | Date  | Date of publication in UTC.                                                     |
| `authors`     | Text  | Authors of the blog post, if different from the [default value](#configsitets). |
| `description` | Text  | Description of the blog post. Will also be used as page metadata.               |

![image](https://github.com/user-attachments/assets/a3623fde-2754-4338-95b8-9f0021b9de07)

Install the integration to the database.

See [Add connections to pages](https://www.notion.so/help/add-and-manage-connections-with-the-api#add-connections-to-pages).

## Adjust Site Config

:::tip
Existing configurations are for [powerium.io](https://www.powerium.io). Please
adjust the entries accordingly.
:::

Configuration files are stored in
[`config`](https://github.com/powersagitar/powerium.io/tree/main/config) and [`next.config.mjs`](https://github.com/powersagitar/powerium.io/tree/main/next.config.mjs).

### `config/notion.ts`

| Key                | Description                                                                                                                             |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| `notionApiKey`     | Secret of the integration.                                                                                                              |
| `notionDatabaseId` | ID of the database. See [Notion API Reference](https://developers.notion.com/reference/retrieve-a-database) for how to find.            |
| `cacheTtl`         | Time-to-live of the cache in seconds. Database queries are cached.                                                                      |
| `customPages?`     | Arbitrary pages you want to publicize. They will show up in the nav bar. Make sure the integration is installed to these pages as well. |

### `config/site.ts`

| Key                    | Description                                                                                                              |
| :--------------------- | :----------------------------------------------------------------------------------------------------------------------- |
| `url.protocol`         | Protocol used by the site.                                                                                               |
| `url.hostname`         | Hostname of the site.                                                                                                    |
| `url.origin`           | Origin of the site.                                                                                                      |
| `metadata.author`      | Default authorship information of site and blog posts.                                                                   |
| `metadata.title`       | Title of the site.                                                                                                       |
| `metadata.description` | Description of the site.                                                                                                 |
| `metadata.icons?`      | Favicon of the site. See [Metadata Fields](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#icons). |
| `githubRepository?`    | GitHub repository where the source of the site resides in.                                                               |

### Generating a Favicon

See [RealFaviconGenerator](https://realfavicongenerator.net/favicon-generator/nextjs).
