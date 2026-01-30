import { useState, useEffect, useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { Main } from '@/shared/layouts';
import BackToTopButton from '@/shared/components/BackToTopButton';
import { getArticleBySlug, BlogArticle as BlogArticleType } from './utils/mdxUtils';
import 'katex/dist/katex.min.css';

const BlogArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<BlogArticleType | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (slug) {
      getArticleBySlug(slug).then((data) => {
        if (data) {
          setArticle(data);
        } else {
          setNotFound(true);
        }
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) {
    return (
      <Main title="Loading..." description="Loading blog article">
        <article className="post" id="blog-article">
          <p>Loading article...</p>
        </article>
      </Main>
    );
  }

  if (notFound || !article) {
    return <Navigate to="/404" replace />;
  }

  const Content = article.content;

  return (
    <Main
      title={article.title}
      description={article.description}
    >
      <article className="post markdown" id="blog-article" ref={containerRef}>
        <header>
          <div className="title">
            <h2>
              <Link to={`/blog/${article.slug}`}>{article.title}</Link>
            </h2>
            <time className="published">
              {dayjs(article.date).format('MMMM D, YYYY')}
            </time>
          </div>
        </header>
        <div className="article-content">
          <Content />
        </div>
        <footer style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #ddd' }}>
          <Link to="/blog" className="button back-to-blog-button">
            ← Back to Blog Overview
          </Link>
        </footer>
      </article>
      <BackToTopButton containerRef={containerRef} />
    </Main>
  );
};

export default BlogArticle;
