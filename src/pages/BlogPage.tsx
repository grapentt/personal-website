import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import ArticlePoster from '../components/ArticlePoster';
import { articles, formatDate } from '../content/articles';

const BlogPage = () => (
  <div className="container page">
    <Seo title="Writing" path="/blog" description="Articles and interactive films on geometry, topology, physics and machine learning." />
    <header className="page-header">
      <p className="eyebrow">Writing</p>
      <h1>Articles and interactive films</h1>
      <p className="lede">
        Long-form, visual and slow. The interactive films are narrated animations you can scrub through chapter by chapter, with
        scenes you can take over and explore.
      </p>
    </header>
    <div className="article-list">
      {articles.map((article) => (
        <Link key={article.slug} to={`/blog/${article.slug}`} className="article-row">
          <div className="article-row__media">
            <ArticlePoster article={article} />
          </div>
          <div className="article-row__body">
            <div className="article-card__meta">
              <span className={`tag${article.kind === 'film' ? ' tag--film' : ''}`}>{article.kind === 'film' ? 'Interactive film' : 'Article'}</span>
              <span>{formatDate(article.date)}</span>
              {article.series && <span>{article.series.name} · part {article.series.part}</span>}
            </div>
            <h2>{article.title}</h2>
            {article.subtitle && <p className="lede" style={{ fontSize: '1.1rem' }}>{article.subtitle}</p>}
            <p>{article.description}</p>
            <span className="article-card__read">
              {article.kind === 'film' ? `${article.filmMinutes} min film · ${article.readingMinutes} min read` : `${article.readingMinutes} min read`}
            </span>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

export default BlogPage;
