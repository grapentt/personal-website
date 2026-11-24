import { Github, Linkedin, Mail } from 'lucide-react';
import Seo from '../components/Seo';
import { site } from '../app/site';

const ContactPage = () => (
  <div className="container page">
    <Seo title="Contact" path="/contact" description={`Contact Thomas Grapentin by email at ${site.email}.`} />
    <header className="page-header">
      <p className="eyebrow">Contact</p>
      <h1>Say hello</h1>
      <p className="lede">
        Questions about an article, a mistake you spotted, an idea for a visualisation, or something to work on together: write to me.
      </p>
    </header>
    <ul className="contact-list">
      <li>
        <a href={`mailto:${site.email}`}>
          <Mail size={20} />
          {site.email}
          <span>email</span>
        </a>
      </li>
      <li>
        <a href={site.github}>
          <Github size={20} />
          github.com/grapentt
          <span>code</span>
        </a>
      </li>
      <li>
        <a href={site.linkedin}>
          <Linkedin size={20} />
          Thomas Grapentin
          <span>linkedin</span>
        </a>
      </li>
    </ul>
  </div>
);

export default ContactPage;
