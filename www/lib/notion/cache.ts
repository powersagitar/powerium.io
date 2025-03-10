'use server';

import { revalidatePath } from 'next/cache';

export async function purgeCache() {
  revalidatePath('/', 'layout');
}
