import { ComponentType, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Seo from '../components/Seo';
import { site } from '../app/site';
import TableOfContents from '../components/TableOfContents';
import { articleBySlug, formatDate, neighbours } from '../content/articles';
import NotFoundPage from './NotFoundPage';
import { countEvent } from '../app/analytics';

const ArticlePage = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const article = articleBySlug(slug);
  const [Content, setContent] = useState<ComponentType | null>(null);
  const [failed, setFailed] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLElement>(null);

  // count "read to the end" once the end of the article scrolls into view
  useEffect(() => {
    const end = endRef.current;
    if (!end || !Content) return undefined;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        countEvent(`read/${slug}`);
        observer.disconnect();
      }
    });
    observer.observe(end);
    return () => observer.disconnect();
  }, [Content, slug]);

  useEffect(() => {
    setContent(null);
    setFailed(false);
    if (!article) return;
    let cancelled = false;
    article
      .load()
      .then((m) => {
        if (!cancelled) setContent(() => m.default);
      })
      .catch((err) => {
        console.error(`Loading article "${slug}" failed`, err);
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [article, slug]);

  if (!article) return <NotFoundPage />;
  const { older, newer } = neighbours(article.slug);

  return (
    <div className="container page">
      <Seo title={article.title} description={article.description} path={`/blog/${article.slug}`} type="article" />
      <div className="article-layout">
        <TableOfContents containerRef={bodyRef} ready={Content !== null} />
        <div>
          <header className="article-header">
            <div className="eyebrow">
              <span className={`tag${article.kind === 'film' ? ' tag--film' : ''}`}>{article.kind === 'film' ? 'Interactive film' : 'Article'}</span>
              {article.series && <span>{article.series.name} · part {article.series.part}</span>}
            </div>
            <h1>{article.title}</h1>
            {article.subtitle && <p className="lede">{article.subtitle}</p>}
            <div className="article-header__meta">
              <span>{formatDate(article.date)}</span>
              {article.filmMinutes && <span>{article.filmMinutes} min film</span>}
              <span>{article.readingMinutes} min read</span>
              <span>{article.topics.join(' · ')}</span>
            </div>
          </header>
          <div ref={bodyRef} className="prose article-body" key={article.slug}>
            {Content && <Content />}
            {!Content && !failed && <p className="smallprint" aria-busy="true">Loading…</p>}
            {failed && <p className="smallprint">This article could not be loaded. Please reload the page.</p>}
          </div>
          <footer className="article-footer" ref={endRef}>
            <p className="smallprint">
              Found a mistake, or something that could be clearer? I would be glad to hear it:{' '}
              <a href={`mailto:${site.email}`}>{site.email}</a>.
            </p>
            <nav className="article-footer__nav" aria-label="More articles">
              {older ? (
                <Link to={`/blog/${older.slug}`}>
                  <span>Earlier</span>
                  {older.title}
                </Link>
              ) : (
                <span />
              )}
              {newer ? (
                <Link to={`/blog/${newer.slug}`} className="next">
                  <span>Later</span>
                  {newer.title}
                </Link>
              ) : (
                <Link to="/blog" className="next">
                  <span>Index</span>
                  All articles
                </Link>
              )}
            </nav>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
