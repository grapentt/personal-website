import React from 'react';
import { Link } from 'react-router-dom';

import Main from '../layouts/Main';
import ContactIcons from '../components/Contact/ContactIcons';

const Contact = () => (
  <Main
    title="Contact"
    description="Contact Thomas Grapentin via email thomas.grapentin@gmx.de"
  >
    <article className="post" id="contact">
      <header>
        <div className="title">
          <h2>
            <Link to="/contact">Contact</Link>
          </h2>
        </div>
      </header>
      <div className="email-at">
        <p>Feel free to get in touch. You can email me at:  
          <a href="mailto:thomas.grapentin@gmx.de" aria-label="mail">
          &nbsp;thomas.grapentin@gmx.de
          </a>
        </p>
      </div>
      <ContactIcons />
    </article>
  </Main>
);

export default Contact;
