import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Main } from '@/shared/layouts';
import BackToTopButton from '@/shared/components/BackToTopButton';
import BlogPreview from './BlogPreview';
import { getAllArticles, BlogArticle } from './utils/mdxUtils';

const BlogList = () => {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getAllArticles().then((data) => {
      setArticles(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Main title="Blog" description="Read my blog.">
        <article className="post" id="blog">
          <header>
            <div className="title">
              <h2>
                <Link to="/blog">Blog</Link>
              </h2>
            </div>
          </header>
          <p>Loading articles...</p>
        </article>
      </Main>
    );
  }

  return (
    <Main title="Blog" description="Read my blog.">
      <article className="post" id="blog" ref={containerRef}>
        <header>
          <div className="title">
            <h2>
              <Link to="/blog">Blog</Link>
            </h2>
          </div>
        </header>
        {articles.map((article) => (
          <BlogPreview key={article.slug} article={article} />
        ))}
      </article>
      <BackToTopButton containerRef={containerRef} />
    </Main>
  );
};

export default BlogList;
