import { revalidateTag } from 'next/cache';

export function POST() {
  revalidateTag('notion');
  return new Response(undefined, { status: 200 });
}
