import { RefObject, useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  depth: 2 | 3;
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);

/**
 * Builds a table of contents from the h2/h3 headings of an article after it has
 * rendered, gives them ids (so they can be linked), and highlights the section
 * currently in view.
 */
const TableOfContents = ({ containerRef, ready }: { containerRef: RefObject<HTMLElement | null>; ready: boolean }) => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    const root = containerRef.current;
    if (!root || !ready) return;
    const seen = new Map<string, number>();
    const list: Heading[] = [];
    root.querySelectorAll<HTMLHeadingElement>('h2, h3').forEach((h) => {
      const text = h.textContent?.trim() ?? '';
      if (!text || h.closest('.film, .explorable, .callout')) return;
      if (!h.id) {
        const base = slugify(text) || 'section';
        const n = (seen.get(base) ?? 0) + 1;
        seen.set(base, n);
        h.id = n > 1 ? `${base}-${n}` : base;
      }
      list.push({ id: h.id, text, depth: h.tagName === 'H2' ? 2 : 3 });
    });
    setHeadings(list);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive((visible[0].target as HTMLElement).id);
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 },
    );
    list.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [containerRef, ready]);

  if (!headings.length) return <div />;
  return (
    <nav className="toc" aria-label="Contents">
      <div className="toc__title">Contents</div>
      <ol>
        {headings.map((h) => (
          <li key={h.id} className={`depth-${h.depth}`}>
            <a href={`#${h.id}`} className={active === h.id ? 'is-active' : undefined}>
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default TableOfContents;
