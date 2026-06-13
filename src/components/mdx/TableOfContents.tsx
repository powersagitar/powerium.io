'use client';

import { useEffect, useRef, useState } from 'react';

import { usePathname } from 'next/navigation';

type Heading = {
  id: string;
  text: string;
  level: number;
};

type BarRect = {
  top: number;
  height: number;
};

export function TableOfContents({
  onLinkClick,
}: {
  onLinkClick?: (id: string) => void;
}) {
  const pathname = usePathname();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [barRect, setBarRect] = useState<BarRect | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    // Reset highlight state when navigating to a new page, before
    // recomputing it for the new article's headings below.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveId('');
    setBarRect(null);
    const headingEls = Array.from(
      document.querySelectorAll<HTMLElement>('article h2, article h3'),
    );
    const articleEl = document.querySelector('article');
    itemRefs.current = [];
    setHeadings(
      headingEls.map((el) => ({
        id: el.id,
        text: el.textContent ?? '',
        level: Number(el.tagName.charAt(1)),
      })),
    );

    if (headingEls.length === 0) return;

    let frame = 0;
    const update = () => {
      const sectionStarts = headingEls.map(
        (el) => el.getBoundingClientRect().top,
      );
      const articleBottom =
        articleEl?.getBoundingClientRect().bottom ?? Infinity;

      let firstVisible = -1;
      let lastVisible = -1;
      for (let i = 0; i < headingEls.length; i++) {
        const sectionStart = sectionStarts[i];
        const sectionEnd = sectionStarts[i + 1] ?? articleBottom;
        if (sectionEnd > 0 && sectionStart < window.innerHeight) {
          if (firstVisible === -1) firstVisible = i;
          lastVisible = i;
        }
      }

      // Scrolled past the end of the last section — clamp to the last
      // heading rather than letting the indicator disappear.
      if (firstVisible === -1 && articleBottom <= 0) {
        firstVisible = lastVisible = headingEls.length - 1;
      }

      if (firstVisible === -1) {
        setActiveId('');
        setBarRect(null);
        return;
      }

      setActiveId(headingEls[firstVisible].id);

      const startItem = itemRefs.current[firstVisible];
      const endItem = itemRefs.current[lastVisible];
      if (startItem && endItem) {
        setBarRect({
          top: startItem.offsetTop,
          height:
            endItem.offsetTop + endItem.offsetHeight - startItem.offsetTop,
        });
      }
    };

    const onScrollOrResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    // Defer the initial measurement until refs are populated after render.
    frame = requestAnimationFrame(update);
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [pathname]);

  if (headings.length === 0) return null;

  return (
    <nav className="not-prose">
      <p className="text-muted-foreground mb-2.5 text-[11px] font-semibold tracking-[0.05em] uppercase">
        On this page
      </p>
      <ul className="border-border relative flex flex-col gap-0.5 border-l">
        {barRect && (
          <div
            className="bg-foreground absolute left-0 -ml-px w-px transition-[top,height] duration-200"
            style={{ top: barRect.top, height: barRect.height }}
          />
        )}
        {headings.map((heading, index) => (
          <li
            key={heading.id}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
          >
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
              className={`block py-0.5 pr-2 text-[13px] transition-colors ${
                activeId === heading.id
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground'
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
