import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Markdown from 'markdown-to-jsx';
import { Main } from '@/shared/layouts';

const About = () => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    // Fetch markdown from public folder
    fetch(`${import.meta.env.BASE_URL}about.md`)
      .then((r) => r.text())
      .then(setMarkdown)
      .catch((error) => {
        console.error('Failed to load about page:', error);
        setMarkdown('# Error\n\nFailed to load content. Please try again later.');
      });
  }, []); // Run only once on mount

  return (
    <Main title="About" description="Learn about Thomas Grapentin">
      <article className="post markdown" id="about">
        <header>
          <div className="title">
            <h2>
              <Link to="/about">About Me</Link>
            </h2>
          </div>
        </header>
        <Markdown>{markdown}</Markdown>
      </article>
    </Main>
  );
};

export default About;
