import type { ComponentType } from 'react';

export type ArticleKind = 'article' | 'film';

export interface ArticleMeta {
  slug: string;
  title: string;
  /** Short line under the title. */
  subtitle?: string;
  /** ISO date of (last substantial) publication. */
  date: string;
  /** One-paragraph abstract shown on cards and in search engines. */
  description: string;
  /** 'film' = an interactive film article with explorables. */
  kind: ArticleKind;
  /** Poster for cards: a video under public/ (without extension) or an image path. */
  poster?: { video?: string; image?: string; alt: string };
  readingMinutes: number;
  /** Length of the film in minutes, for film articles. */
  filmMinutes?: number;
  topics: string[];
  /** Articles that form a sequence, in order. */
  series?: { name: string; part: number };
}

export interface ArticleModule {
  default: ComponentType;
}

export interface ArticleEntry extends ArticleMeta {
  load: () => Promise<ArticleModule>;
}
