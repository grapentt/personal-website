// Utility functions for working with MDX blog articles

export interface BlogArticleMetadata {
  title: string;
  date: string;
  description: string;
  image: string;
  slug: string;
}

export interface BlogArticle extends BlogArticleMetadata {
  content: React.ComponentType;
}

/**
 * Generate a URL-friendly slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Get all blog articles with their metadata
 * This will be dynamically populated as we add more articles
 */
export async function getAllArticles(): Promise<BlogArticle[]> {
  const articles: BlogArticle[] = [];

  // Import MDX articles
  // Each MDX file exports frontmatter as named exports and the component as default
  const quaternionsModule = await import('../articles/quaternions-4d-rotations.mdx');

  articles.push({
    slug: 'quaternions-4d-rotations',
    title: quaternionsModule.title || 'A geometric introduction to quaternions',
    date: quaternionsModule.date || '2025-02-13',
    description: quaternionsModule.description || '',
    image: quaternionsModule.image || '',
    content: quaternionsModule.default,
  });

  // Sort by date (newest first)
  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get a single article by slug
 */
export async function getArticleBySlug(slug: string): Promise<BlogArticle | null> {
  const articles = await getAllArticles();
  return articles.find((article) => article.slug === slug) || null;
}
