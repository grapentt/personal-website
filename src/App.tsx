import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Main } from '@/shared/layouts';
import '@/styles/css/main.scss';

// Every route - we lazy load so that each page can be chunked
// NOTE that some of these chunks are very small. We should optimize
// which pages are lazy loaded in the future.
const About = lazy(() => import('@/features/about').then((m) => ({ default: m.About })));
const Contact = lazy(() => import('@/features/contact').then((m) => ({ default: m.Contact })));
const Index = lazy(() => import('@/features/home').then((m) => ({ default: m.Index })));
const NotFound = lazy(() => import('@/shared/components').then((m) => ({ default: m.NotFound })));
const Blog = lazy(() => import('@/features/blog').then((m) => ({ default: m.Blog })));
const BlogArticle = lazy(() => import('@/features/blog').then((m) => ({ default: m.BlogArticle })));
const Resume = lazy(() => import('@/features/resume').then((m) => ({ default: m.Resume })));
const Thesis = lazy(() => import('@/features/thesis').then((m) => ({ default: m.Thesis })));

const App: React.FC = () => (
  <BrowserRouter basename="/personal-website">
    <Suspense fallback={<Main />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogArticle />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/thesis" element={<Thesis />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default App;
