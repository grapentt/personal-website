import React from 'react';
import { Link } from 'react-router-dom';
import { Main } from '@/shared/layouts';
import { SideBar } from '@/shared/components';
import './index.css';

const Index: React.FC = () => (
  <Main
    description={
      'I am a very curious mathematics student at HU Berlin with background in physics and computer science exploring the mathematical '
      + 'foundations of physics and machine learning.'
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
          If you've ever been curious about the structures that shape our understanding of space, symmetry, and higher dimensions,
          I invite you to join me on this journey.
          <br /><br />
          <strong>Let's explore the fascinating world of mathematics together.</strong>
        </p>

        <h3>Topics I Plan to Cover</h3>

        <h4>Foundational Mathematics</h4>
        <ul>
          <li>Glimpse into 4d: Isoclinic rotations, quaternions and the hopf fibration</li>
          <li>Linear algebra</li>
          <li>Multilinear algebra and Tensors</li>
          <li>Group theory</li>
          <li>Representation Theory</li>
          <li>Exterior algebra</li>
          <li>Clifford/Geometric Algebra</li>
        </ul>

        <h4>Differential Geometry & Topology</h4>
        <ul>
          <li>The atoms of space: Cell and Handle decompositions</li>
          <li>Topolofical Manifolds</li>
          <li>The metric tensor: Riemannian Geometry</li>
          <li>Lie groups and Lie algebras</li>
          <li>My favourite manifolds: Projective spaces, Lie groups and Grassmannians</li>
          <li>Homology</li>
          <li>Cohomology and poincare duality</li>
          <li>Differential forms and hodge duality</li>
          <li>Intersection forms of 4-manifolds</li>
          <li>Bundles</li>
          <li>Connections, curvature, and holonomy</li>
          <li>Characteristic classes</li>
          <li>Morse Theory</li>
          <li>h-cobordism theorem</li>
          <li>Self-duality and Donaldson Theory</li>
          <li>Spin groups, Spin structures and Spinors</li>
          <li>Dirac Operator on Spin-manifolds</li>
          <li>Spin<sup>c</sup> structures and Seiberg-Witten Theory</li>
        </ul>

        <h4>Mathematical Physics</h4>
        <ul>
          <li>Pseudo-Riemannian spaces and applications to relativity</li>
          <li>Gauge theory in physics: Maxwell's equations</li>
          <li>Gauge theory in physics: Yang-Mills equations</li>
          <li>Gauge theory in physics: Minimal Coupling and Matter Fields</li>
          <li>Standard Model of particle physics</li>
          <li>Topological Quantim Field Theory</li>
          <li>Twistor theory</li>
          <li>Topological quantum computing</li>
        </ul>

        <h4>Machine Learning Applications</h4>
        <ul>
          <li>Mathematical foundations of Machine learning</li>
          <li>Topological Data Analysis</li>
          <li>Topological Deep Learning</li>
          <li>Geometric Deep Learning</li>
          <li>Category Theory: A unifying framework?</li>
          <li>Embedding Spaces</li>
          <li>Representiation Learning</li>
          <li>Geometric approaches to explainable AI</li>
          <li>... This list will certainly expand with time ....</li>
        </ul>

      </article>
    </div>
  </Main>
);

export default Index;
