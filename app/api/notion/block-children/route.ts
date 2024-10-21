import 'server-only';

import { NextRequest } from 'next/server';

import {
  BlockObjectResponse,
  UserObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { retrieveNotionBlockChildren } from '@/lib/notion/server';

export async function GET(request: NextRequest) {
  if (!request.nextUrl.searchParams.has('block-id')) {
    return new Response('GET parameter `block-id` is required', {
      status: 400,
    });
  }

  const notionBlockChildren = await retrieveNotionBlockChildren(
    request.nextUrl.searchParams.get('block-id')!,
    request.nextUrl.searchParams.get('start-cursor') ?? undefined,
  );

  for (const childBlock of notionBlockChildren.results as BlockObjectResponse[]) {
    const privateDataPlaceholder = 'REDACTED FOR PRIVACY';

    if (childBlock.parent.type !== 'workspace') {
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      (childBlock.parent as any)[childBlock.parent.type] =
        privateDataPlaceholder;
    }

    childBlock.created_time = privateDataPlaceholder;

    (childBlock.created_by as UserObjectResponse).id = privateDataPlaceholder;

    (childBlock.last_edited_by as UserObjectResponse).id =
      privateDataPlaceholder;
  }

  return Response.json({
    ...notionBlockChildren,
  });
}
