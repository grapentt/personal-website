import React from 'react';
import { Link } from 'react-router-dom';
import { Main } from '@/shared/layouts';
import { SideBar } from '@/shared/components';
import './index.css';

const Index: React.FC = () => (
  <Main
    description={
      'I am a very curious CS, Math & Physics student at HU Berlin with deep passion for differential geometry, '
      + 'data science & coding. Currently working at SAP'
    }
  >
    <div className="content-wrapper">
      <SideBar />
      <article className="post" id="index">
        <header>
          <div className="title">
            <h2>
              <Link to="/">About this site</Link>
            </h2>
          </div>
        </header>
        <p>
          <strong>Welcome to my website!</strong>  
          <br /><br />
          I am super excited to launch my blog here, where I’ll be diving into the fascinating—and often misunderstood—world of mathematics.  
          <br /><br />
          Let’s face it: when most people think of math, the public image is… uninspiring. At best, it’s seen as a mere tool for science; at worst,  
          it’s dismissed as a tedious exercise in number-crunching.  
          <br /><br />
          Contrast this with physics. Many people, even without a deep background, are fascinated by concepts like relativity, quantum mechanics,  
          or black holes. There are movies, documentaries, and endless discussions about these topics.  
          <br /><br />
          This is unfortunate because mathematics is not just about numbers—it’s the rigorous study of the nature of reality itself.  
          And not just physical reality! One reason for its inaccessibility is that mathematics often defies natural language.  
          Physics, at least, describes things we can experience—motion, gravity, time dilation. But mathematics ventures far beyond that,  
          exploring spaces of arbitrary dimension, structures that don’t exist in our physical world, and symmetries that cannot be visualized.  
          <br /><br />
          Another reason, though, is that mathematicians tend to communicate in a language that is incredibly precise and expressive—but also  
          extremely difficult to learn. In my opinion, many mathematicians overuse this language and forget how hard it was to master in the  
          first place. They rarely make an effort to translate their insights into something more accessible for outsiders. This is part of why  
          math students struggle so much in the early years of their studies. There are, of course, inspiring exceptions, but they are rare.  
          <br /><br />
          <strong>That’s where this blog comes in.</strong>  
          <br /><br />
          My goal is to break down complex mathematical ideas—especially ideas related to the differential topology of four-manifolds—into something more  
          intuitive and accessible. I’ll try to use clear language and many self-created visuals to bridge the gap between  
          formal mathematics and intuitive understanding.  
          <br /><br />
          And along the way, we’ll occasionally dive into physics as an application (reverting the usual order).
          <br /><br />
          If you’ve ever been curious about the structures that shape our understanding of space, symmetry, and higher dimensions,  
          I invite you to join me on this journey.  
          <br /><br />
          <strong>Let’s explore the fascinating world of mathematics together.</strong>
        </p>

      </article>
    </div>
  </Main>
);

export default Index;
