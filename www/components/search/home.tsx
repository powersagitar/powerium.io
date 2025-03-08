'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import { siteConfig } from '@/config/site';

import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { Input } from '../ui/input';

const schema = z.object({
  search: z.string().nonempty(),
});

function onSubmit(values: z.infer<typeof schema>) {
  window.open(
    `https://www.google.com/search?q=site:${siteConfig.url.origin} ${values.search}`,
    '_blank',
  );
}

export default function SearchOnHomePage() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      search: '',
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="hidden gap-2 sm:flex"
      >
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input type="search" placeholder="Search..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Search</Button>
      </form>
    </Form>
  );
}
