import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { MDXProvider } from '@mdx-js/react';
import Layout from './app/Layout';
import { mdxComponents } from './content/mdxComponents';

// Every page is its own chunk.
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const ArticlePage = lazy(() => import('./pages/ArticlePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const DocumentPage = lazy(() => import('./pages/DocumentPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const StatsPage = lazy(() => import('./pages/StatsPage'));

const App = () => (
  <HelmetProvider>
    <MDXProvider components={mdxComponents}>
      <BrowserRouter basename="/personal-website">
        <Layout>
          <Suspense fallback={<div className="container page" aria-busy="true" />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<ArticlePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/resume" element={<DocumentPage kind="resume" />} />
              <Route path="/thesis" element={<DocumentPage kind="thesis" />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </MDXProvider>
  </HelmetProvider>
);

export default App;
