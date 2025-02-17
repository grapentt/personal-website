import React from 'react';
import Main from '../layouts/Main';

const Resume = () => (
  <Main
    title="Resume"
    description="Thomas Grapentin's Resume."
  >
    <div className="resume-container">
      <h1>My Resume</h1>
      <iframe
        src={`${process.env.PUBLIC_URL}/Resume.pdf`}
        width="100%"
        height="1000px"
        title="My Resume"
      >
      </iframe>
    </div>
  </Main>
);

export default Resume;
