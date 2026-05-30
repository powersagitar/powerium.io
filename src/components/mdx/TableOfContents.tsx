'use client';

import { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

type Heading = {
  id: string;
  text: string;
  level: number;
};

export function TableOfContents({
  onLinkClick,
}: {
  onLinkClick?: (id: string) => void;
}) {
  const pathname = usePathname();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    setActiveId('');
    const elements = Array.from(
      document.querySelectorAll('article h2, article h3'),
    );
    setHeadings(
      elements.map((el) => ({
        id: el.id,
        text: el.textContent ?? '',
        level: Number(el.tagName.charAt(1)),
      })),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '0% 0% -80% 0%' },
    );

    elements.forEach((el) => observer.observe(el));

    // Seed activeId from current scroll position so the drawer TOC is
    // immediately correct when it mounts mid-page.
    const above = elements.filter(
      (el) => el.getBoundingClientRect().top < window.innerHeight * 0.3,
    );
    const initial = above[above.length - 1];
    if (initial?.id) setActiveId(initial.id);

    return () => observer.disconnect();
  }, [pathname]);

  if (headings.length === 0) return null;

  return (
    <nav className="not-prose">
      <p className="text-muted-foreground mb-2.5 text-[11px] font-semibold tracking-[0.05em] uppercase">
        On this page
      </p>
      <ul className="border-border flex flex-col gap-0.5 border-l">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              onClick={
                onLinkClick
                  ? (e) => {
                      e.preventDefault();
                      onLinkClick(heading.id);
                    }
                  : undefined
              }
              style={{ paddingLeft: heading.level === 2 ? 10 : 20 }}
              className={`-ml-px block border-l py-0.5 pr-2 text-[13px] transition-colors ${
                activeId === heading.id
                  ? 'border-foreground text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground border-transparent'
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
