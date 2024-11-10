import { revalidatePath } from 'next/cache';

export function POST() {
  revalidatePath('/', 'layout');
  return new Response(undefined, { status: 200 });
}
