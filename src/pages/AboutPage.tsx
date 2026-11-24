import Seo from '../components/Seo';
import SmartLink from '../components/SmartLink';
import About from '../content/about.mdx';
import { asset, site } from '../app/site';
import { education, experience, skills } from '../content/profile';

const AboutPage = () => (
  <div className="container page">
    <Seo title="About" path="/about" description="About Thomas Grapentin: mathematician and AI scientist in Berlin. Education, research and experience." />
    <header className="page-header">
      <p className="eyebrow">About</p>
      <h1>Thomas Grapentin</h1>
      <p className="lede">Mathematician and AI scientist in Berlin, drawn to the geometry and topology of spaces one cannot see.</p>
    </header>
    <div className="about-grid">
      <div>
        <div className="prose">
          <About />
        </div>

        <section className="about-section">
          <h2>Experience</h2>
          <div className="entries">
            {experience.map((role) => (
              <article key={role.organisation} className="entry">
                <div className="entry__meta">{role.period}</div>
                <div className="entry__body">
                  <h3>{role.organisation} <span className="entry__role">· {role.title}</span></h3>
                  <p>{role.summary}</p>
                  {role.details && (
                    <ul>
                      {role.details.map((d) => <li key={d}>{d}</li>)}
                    </ul>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section">
          <h2>Education</h2>
          <div className="entries">
            {education.map((e) => (
              <article key={e.degree} className="entry">
                <div className="entry__meta">{e.period}</div>
                <div className="entry__body">
                  <h3>{e.degree}</h3>
                  <p className="entry__role">{e.institution}</p>
                  <p>{e.summary}</p>
                  {e.link && (
                    <div className="entry__links">
                      <SmartLink href={e.link.href}>{e.link.label} →</SmartLink>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <aside className="about-aside">
        <img src={asset('images/me.jpg')} alt="Thomas Grapentin" width={560} height={560} />
        <div>
          <h4>Elsewhere</h4>
          <ul>
            <li><a href={site.github}>GitHub</a></li>
            <li><a href={site.linkedin}>LinkedIn</a></li>
            <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
          </ul>
        </div>
        <div>
          <h4>Documents</h4>
          <ul>
            <li><a href={asset('Resume.pdf')}>CV (PDF)</a></li>
            <li><a href={asset('thesis.pdf')}>Bachelor’s thesis (PDF)</a></li>
          </ul>
        </div>
        {skills.map((g) => (
          <div key={g.group}>
            <h4>{g.group}</h4>
            <ul>
              {g.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        ))}
      </aside>
    </div>
  </div>
);

export default AboutPage;
