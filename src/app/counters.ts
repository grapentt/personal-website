/**
 * The anonymous view counters of the site, kept by hits.sh (no account, no cookies).
 * Every counter is a path under the site's address; a request to
 * https://hits.sh/<key>.svg adds one to it. This module only names the counters;
 * src/app/analytics.ts sends the counts and scripts/fetch-stats.ts reads them back
 * for the unlisted /stats page.
 */
import { articles } from '../content/articles';

export const COUNTER_BASE = 'grapentt.github.io/personal-website';

/** The hits.sh key of a counter name such as '/blog' or '/event/download/cv'. */
export const counterKey = (name: string) => `${COUNTER_BASE}${name === '/' ? '' : name}`;

export interface Counter {
  label: string;
  name: string;
}

export interface CounterGroup {
  id: 'pages' | 'films' | 'engagement' | 'actions';
  title: string;
  counters: Counter[];
}

/** Routes counted as pages, besides one per article. */
const PAGES: Counter[] = [
  { label: 'Home', name: '/' },
  { label: 'Writing (index)', name: '/blog' },
  { label: 'About', name: '/about' },
  { label: 'Contact', name: '/contact' },
  { label: 'CV page', name: '/resume' },
  { label: 'Thesis page', name: '/thesis' },
  { label: 'Not found', name: '/not-found' },
];

/** Every counter, grouped as on the stats page. */
export function counterGroups(): CounterGroup[] {
  const films = articles.filter((a) => a.kind === 'film');
  return [
    {
      id: 'pages',
      title: 'Page views',
      counters: [
        PAGES[0],
        PAGES[1],
        ...articles.map((a) => ({ label: a.title, name: `/blog/${a.slug}` })),
        ...PAGES.slice(2),
      ],
    },
    {
      id: 'films',
      title: 'Films',
      counters: films.flatMap((a) => [
        { label: `${a.title}: played`, name: `/event/film/${a.slug}/play` },
        { label: `${a.title}: watched to the end`, name: `/event/film/${a.slug}/finish` },
        { label: `${a.title}: live scene taken over`, name: `/event/film/${a.slug}/explore` },
      ]),
    },
    {
      id: 'engagement',
      title: 'Reading',
      counters: articles.flatMap((a) => [
        { label: `${a.title}: read to the end`, name: `/event/read/${a.slug}` },
        { label: `${a.title}: explorable used`, name: `/event/explorable/${a.slug}` },
      ]),
    },
    {
      id: 'actions',
      title: 'Downloads and contact',
      counters: [
        { label: 'CV downloaded', name: '/event/download/cv' },
        { label: 'Thesis downloaded', name: '/event/download/thesis' },
        { label: 'Email link clicked', name: '/event/contact/email' },
        { label: 'GitHub link clicked', name: '/event/contact/github' },
        { label: 'LinkedIn link clicked', name: '/event/contact/linkedin' },
      ],
    },
  ];
}

/** The counter name of a route, or null for routes that are not counted (the stats page). */
export function pageCounter(pathname: string): string | null {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/stats') return null;
  if (PAGES.some((p) => p.name === path)) return path;
  const article = path.match(/^\/blog\/([^/]+)$/);
  if (article && articles.some((a) => a.slug === article[1])) return path;
  return '/not-found';
}

/** The snapshot of all counters, written by scripts/fetch-stats.ts to public/stats.json. */
export interface StatsSnapshot {
  generatedAt: string;
  counters: Record<string, { total: number; weekly: number; monthly: number; daily: [string, number][] }>;
  failed: string[];
}
