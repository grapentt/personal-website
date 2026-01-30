import { useState } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { ChevronDown, ChevronUp } from 'lucide-react';
import VideoPlayer from '@/shared/components/VideoPlayer';
import { BlogArticle } from './utils/mdxUtils';
import './cell.css';

interface BlogPreviewProps {
  article: BlogArticle;
}

const BlogPreview: React.FC<BlogPreviewProps> = ({ article }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => setIsExpanded(!isExpanded);

  return (
    <div className="cell-container">
      <article className={`mini-post ${isExpanded ? 'expanded' : ''}`}>
        <header
          role="button"
          tabIndex={0}
          onClick={handleToggle}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleToggle();
          }}
          style={{ cursor: 'pointer' }}
        >
          <h3>{article.title}</h3>
          <time className="published">
            {dayjs(article.date).format('MMMM, YYYY')}
          </time>
          <span className="toggle-arrow">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </span>
        </header>

        {/* Expanded preview content */}
        {isExpanded && (
          <div className="preview-content">
            {/* Description */}
            <div className="descriptionContainer">
              <p>{article.description}</p>
            </div>

            {/* Display image or video */}
            {article.image && (
              <div className="image-container">
                {article.image.endsWith('.gif') ? (
                  <VideoPlayer
                    src={article.image.replace(/\.gif$/, '')}
                    alt={article.title}
                    className="gif"
                  />
                ) : (
                  <img src={article.image} alt={article.title} className="image" />
                )}
              </div>
            )}

            {/* Read Full Article Button */}
            <div className="read-more-container">
              <Link to={`/blog/${article.slug}`} className="button read-more-button">
                Read Full Article →
              </Link>
            </div>
          </div>
        )}
      </article>
    </div>
  );
};

export default BlogPreview;
