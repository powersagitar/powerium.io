'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import { siteConfig } from '@/config/site';

import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';

const FormSchema = z.object({
  search: z.string().min(1, { message: 'Nothing to search for.' }),
});

export default function SearchForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { search: '' },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    window.open(
      `https://www.google.com/search?q=site:${siteConfig.url.origin} ${data.search}`,
      '_blank',
    );
  }

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  autoFocus
                  spellCheck
                  type="search"
                  placeholder="Search..."
                  {...field}
                />
              </FormControl>
              <FormDescription>Input may not be empty.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-4 w-full sm:w-auto">
          Search
        </Button>
      </form>
    </Form>
  );
}
