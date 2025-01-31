'use client';

import { useEffect, useState } from 'react';
import { isDesktop } from 'react-device-detect';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import { SiteConfig } from '@/lib/config/site';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';

type SearchBarProps = {
  origin: SiteConfig['url']['origin'];
};

export default function SearchBar({ origin }: SearchBarProps) {
  const [platform, setPlatform] = useState<
    'macos' | 'windows' | 'linux' | 'unix' | 'unknown'
  >('macos');

  useEffect(() => {
    const userAgent = window.navigator.userAgent;

    if (userAgent.includes('Mac')) {
      setPlatform('macos');
    } else if (userAgent.includes('Win')) {
      setPlatform('windows');
    } else if (userAgent.includes('Linux')) {
      setPlatform('linux');
    } else if (userAgent.includes('X11')) {
      setPlatform('unix');
    } else {
      setPlatform('unknown');
    }
  }, []);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const keydownHandler = (e: KeyboardEvent) => {
      const modifierKeyDown = platform === 'macos' ? e.metaKey : e.ctrlKey;

      if (modifierKeyDown && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener('keydown', keydownHandler);

    return () => {
      document.removeEventListener('keydown', keydownHandler);
    };
  }, [platform, setOpen]);

  return (
    <>
      <Button
        variant="ghost"
        className="text-muted-foreground border-muted relative flex h-8 w-full justify-start rounded-[0.5rem] border text-sm font-normal shadow-none sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <span>Search...</span>
        {isDesktop && (
          <kbd className="bg-muted pointer-events-none absolute top-[0.3rem] right-[0.3rem] hidden h-5 items-center gap-1 rounded px-1.5 font-mono text-[10px] font-medium opacity-100 select-none md:flex">
            <span className="text-xs">
              {platform === 'macos' ? '⌘' : 'Ctrl'}
            </span>
            K
          </kbd>
        )}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>
            Search for anything on the site.
          </DialogDescription>
          <InputForm origin={origin} />
        </DialogContent>
      </Dialog>
    </>
  );
}

const FormSchema = z.object({
  search: z.string().min(1, { message: 'Nothing to search for.' }),
});

type InputFormProps = {
  origin: SiteConfig['url']['origin'];
};

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
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
