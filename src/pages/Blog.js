import React from 'react';
import { Link } from 'react-router-dom';

import Main from '../layouts/Main';

import Cell from '../components/blog/Cell';
import data from '../data/blogArticles';

const Blog = () => (
  <Main title="Blog" description="Read my blog.">
    <article className="post" id="blog">
      <header>
        <div className="title">
          <h2>
            <Link to="/blog">Blog</Link>
          </h2>
        </div>
      </header>
      {data.map((blogArticle) => (
        <Cell data={blogArticle} key={blogArticle.title} />
      ))}
    </article>
  </Main>
);

export default Blog;
