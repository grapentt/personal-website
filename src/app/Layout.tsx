import { ReactNode, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Sun, Moon } from 'lucide-react';
import { site, navigation } from './site';
import { useTheme } from './theme';
import Mark from '../components/Mark';
import { countEvent, countPage, linkEvent } from './analytics';

const ScrollManager = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      return undefined;
    }
    // the page may still be loading (every page is a lazy chunk): look for the target a few times
    let tries = 0;
    let timer = 0;
    const find = () => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) target.scrollIntoView({ block: 'start' });
      else if (tries++ < 20) timer = window.setTimeout(find, 60);
    };
    find();
    return () => window.clearTimeout(timer);
  }, [pathname, hash]);
  return null;
};

/** Counts every page view and the clicks on downloads and contact links. */
const Counting = () => {
  const { pathname } = useLocation();
  useEffect(() => countPage(pathname), [pathname]);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a');
      const event = link ? linkEvent(link.href) : null;
      if (event) countEvent(event);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);
  return null;
};

const Layout = ({ children }: { children: ReactNode }) => {
  const [theme, toggleTheme] = useTheme();
  return (
    <>
      <Helmet titleTemplate={`%s · ${site.name}`} defaultTitle={site.name}>
        <meta name="description" content={site.description} />
        <meta property="og:site_name" content={site.name} />
        <meta property="og:type" content="website" />
      </Helmet>
      <ScrollManager />
      <Counting />
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <div className="container site-header__inner">
          <Link to="/" className="brand" aria-label={`${site.name}, home`}>
            <Mark className="brand__mark" />
            <span className="brand__name">{site.name}</span>
          </Link>
          <nav className="site-nav" aria-label="Primary">
            {navigation.map((item) => (item.section ? (
              <Link key={item.to} to={item.to} className="site-nav__section">
                {item.label}
              </Link>
            ) : (
              <NavLink key={item.to} to={item.to}>
                {item.label}
              </NavLink>
            )))}
            <button
              type="button"
              className="icon-button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </nav>
        </div>
      </header>
      <main id="main" className="site-main">
        {children}
      </main>
      <footer className="site-footer">
        <div className="container site-footer__inner">
          <div>
            © {new Date().getFullYear()} {site.name}. Written and drawn by hand; the interactive films run on a 2D canvas. Anonymous view counts via hits.sh, no cookies.
          </div>
          <div className="site-footer__links">
            <a href={site.github}>GitHub</a>
            <a href={site.linkedin}>LinkedIn</a>
            <a href={`mailto:${site.email}`}>Email</a>
            <a href={site.repository}>Source</a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Layout;
