import { NextRequest } from 'next/server';

import {
  DatabaseObjectResponse,
  UserObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { retrievePublishedArticles } from '@/lib/notion/server';

export async function GET(request: NextRequest) {
  let publishedArticles = await retrievePublishedArticles(
    request.nextUrl.searchParams.get('start-cursor') ?? undefined,
  );

  for (const article of publishedArticles.results as DatabaseObjectResponse[]) {
    const privateDataPlaceholder = 'REDACTED FOR PRIVACY';

    (article.created_by as UserObjectResponse).id = privateDataPlaceholder;

    article.created_time = privateDataPlaceholder;

    (article.last_edited_by as UserObjectResponse).id = privateDataPlaceholder;

    if (article.parent.type !== 'workspace') {
      (article.parent as any)[article.parent.type] = privateDataPlaceholder;
    }
  }

  return Response.json({
    ...publishedArticles,
  });
}
