import Link from 'next/link';

import { ArrowLeft, ExternalLink } from 'lucide-react';
import siteConfig from '~/site.config';

import { ResolveTrace } from '@/components/ResolveTrace';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="max-w-190">
      <h1 className="mb-3.5 text-[46px] leading-[1.08] font-extrabold tracking-[-0.03em]">
        This page was never written.
      </h1>
      <p className="text-muted-foreground mb-7 max-w-155 text-[17px] leading-[1.6]">
        mSSG maps every URL straight to the{' '}
        <code className="bg-muted rounded px-[0.4em] py-[0.15em] font-mono text-[0.86em]">
          content/
        </code>{' '}
        tree on disk. No{' '}
        <code className="bg-muted rounded px-[0.4em] py-[0.15em] font-mono text-[0.86em]">
          .mdx
        </code>{' '}
        file backs this path, so there is nothing to render.
      </p>

      <ResolveTrace />

      <div className="mb-10 flex flex-wrap gap-2.5">
        <Button asChild size="lg">
          <Link href="/">
            <ArrowLeft className="size-3.75" />
            Back to overview
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="https://mssg.powerium.io/guides/writing-content">
            Browse the docs
          </Link>
        </Button>
        {siteConfig.repository && (
          <Button asChild variant="ghost" size="lg">
            <a
              href={`${siteConfig.repository}/issues/new`}
              target="_blank"
              rel="noreferrer"
            >
              Report a missing page
              <ExternalLink className="size-4" />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
