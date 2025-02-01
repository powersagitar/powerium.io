import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import { siteConfig } from '@/config/site';
import { SiteConfig } from '@/lib/config/site';

import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from './ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';

type SearchDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function SearchDialog({ open, setOpen }: SearchDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>Search</DialogTitle>
        <DialogDescription>
          Search for anything on {siteConfig.metadata.title} with Google.
        </DialogDescription>
        <InputForm origin={siteConfig.url.origin} />
      </DialogContent>
    </Dialog>
  );
}

const FormSchema = z.object({
  search: z.string().min(1, { message: 'Nothing to search for.' }),
});

type InputFormProps = { origin: SiteConfig['url']['origin'] };

function InputForm({ origin }: InputFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { search: '' },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    window.open(
      `https://www.google.com/search?q=site:${origin} ${data.search}`,
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
                  type="text"
                  placeholder="Search..."
                  {...field}
                />
              </FormControl>
              <FormDescription>Input may not be empty.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-4">
          Search
        </Button>
      </form>
    </Form>
  );
}
