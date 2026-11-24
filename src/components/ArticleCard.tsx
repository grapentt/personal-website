import { Link } from 'react-router-dom';
import type { ArticleEntry } from '../content/articles/types';
import { formatDate } from '../content/articles';
import ArticlePoster from './ArticlePoster';

const ArticleCard = ({ article }: { article: ArticleEntry }) => (
  <Link to={`/blog/${article.slug}`} className="article-card">
    <div className="article-card__media">
      <ArticlePoster article={article} />
    </div>
    <div className="article-card__body">
      <div className="article-card__meta">
        <span className={`tag${article.kind === 'film' ? ' tag--film' : ''}`}>{article.kind === 'film' ? 'Interactive film' : 'Article'}</span>
        <span>{formatDate(article.date)}</span>
      </div>
      <h3>{article.title}</h3>
      <p>{article.subtitle ?? article.description}</p>
      <span className="article-card__read">
        {article.kind === 'film' ? `${article.filmMinutes} min film · ${article.readingMinutes} min read` : `${article.readingMinutes} min read`}
      </span>
    </div>
  </Link>
);

export default ArticleCard;
