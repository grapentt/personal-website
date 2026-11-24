import type { ArticleEntry, ArticleMeta } from './types';
import quaternions from './quaternions-4d-rotations/meta';
import hopf from './hopf-fibration/meta';
import shapeSpace from './shape-space/meta';

/**
 * Every article on the site. Metadata is imported eagerly (it is tiny); the
 * article itself, with its film and explorables, is loaded when opened.
 * Add a new article by creating src/content/articles/<slug>/{meta.ts,index.mdx}
 * and listing it here.
 */
const entries: ArticleEntry[] = [
  { ...quaternions, load: () => import('./quaternions-4d-rotations/index.mdx') },
  { ...hopf, load: () => import('./hopf-fibration/index.mdx') },
  { ...shapeSpace, load: () => import('./shape-space/index.mdx') },
];

/** Newest first. */
export const articles: ArticleEntry[] = [...entries].sort((a, b) => b.date.localeCompare(a.date));

export const articleBySlug = (slug: string): ArticleEntry | undefined => articles.find((a) => a.slug === slug);

/** The articles before and after `slug` in publication order (older, newer). */
export function neighbours(slug: string): { older?: ArticleMeta; newer?: ArticleMeta } {
  const i = articles.findIndex((a) => a.slug === slug);
  return { older: articles[i + 1], newer: i > 0 ? articles[i - 1] : undefined };
}

export const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
