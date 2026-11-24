import { Link } from 'react-router-dom';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import Seo from '../components/Seo';
import ArticleCard from '../components/ArticleCard';
import HeroCanvas from '../components/HeroCanvas';
import SmartLink from '../components/SmartLink';
import { articles } from '../content/articles';
import { topicGroups } from '../content/topics';
import { intro, pillars, research, projects, experience } from '../content/profile';
import { asset, site } from '../app/site';

const HomePage = () => (
  <>
    <Seo />
    <section className="hero">
      <HeroCanvas className="hero__canvas" />
      <div className="container">
        <div className="hero__inner">
          <p className="eyebrow eyebrow--accent">{intro.tagline} · {intro.location}</p>
          <h1>{intro.name}</h1>
          <p className="lede">{intro.lede}</p>
          <div className="hero__actions">
            <Link to="/blog" className="button button--primary">Read the blog</Link>
            <Link to="/about" className="button">About me</Link>
            <a href={asset('Resume.pdf')} className="button">CV (PDF)</a>
          </div>
          <ul className="hero__social" aria-label="Elsewhere">
            <li><a href={site.github} aria-label="GitHub"><Github size={18} /></a></li>
            <li><a href={site.linkedin} aria-label="LinkedIn"><Linkedin size={18} /></a></li>
            <li><a href={`mailto:${site.email}`} aria-label="Email"><Mail size={18} /></a></li>
          </ul>
          <p className="hero__hint">Behind this text: the Hopf fibration, live</p>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div className="pillars">
          {pillars.map((p) => (
            <div key={p.title} className="pillar">
              <h2>{p.title}</h2>
              <p>{p.text}</p>
              <Link to={p.link.to} className="pillar__link">{p.link.label} <ArrowRight size={15} /></Link>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="section section--tint" id="writing">
      <div className="container">
        <div className="section__head">
          <div>
            <p className="eyebrow">Writing</p>
            <h2>Mathematics, physics and machine learning</h2>
            <p className="section__lede">
              Long-form articles built around hand-made visualisations. The newer ones are interactive films: narrated animations you can
              scrub chapter by chapter, with scenes you can take over and explore.
            </p>
          </div>
          <Link className="section__more" to="/blog">All articles →</Link>
        </div>
        <div className="card-grid">
          {articles.slice(0, 3).map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
        <details className="topic-map">
          <summary>What comes next: the map of topics</summary>
          <div className="topics">
            {topicGroups.map((group) => (
              <div key={group.title}>
                <h3>{group.title}</h3>
                <ul>
                  {group.topics.map((topic) => (
                    <li key={topic.label} className={topic.slug ? 'is-written' : undefined}>
                      {topic.slug ? <Link to={`/blog/${topic.slug}`}>{topic.label}</Link> : topic.label}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </details>
      </div>
    </section>

    <section className="section" id="research">
      <div className="container">
        <div className="section__head">
          <div>
            <p className="eyebrow">Research</p>
            <h2>Geometry, for machine learning and for its own sake</h2>
          </div>
        </div>
        <div className="entries">
          {research.map((item) => (
            <article key={item.title} className="entry">
              <div className="entry__meta">{item.status}</div>
              <div className="entry__body">
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                {item.points && (
                  <ul>
                    {item.points.map((pt) => <li key={pt}>{pt}</li>)}
                  </ul>
                )}
                <div className="entry__links">
                  {item.links.map((l) => (
                    <SmartLink key={l.href} href={l.href}>{l.label} →</SmartLink>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="section" id="projects">
      <div className="container">
        <div className="section__head">
          <div>
            <p className="eyebrow">Projects</p>
            <h2>Things I have built</h2>
          </div>
          <a className="section__more" href={site.github}>More on GitHub →</a>
        </div>
        <div className="card-grid">
          {projects.map((p) => (
            <article key={p.title} className="project-card">
              <div className="article-card__meta">{p.kind}</div>
              <h3>{p.title}</h3>
              <p>{p.summary}</p>
              <div className="project-card__tags">
                {p.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
              </div>
              {p.href && <SmartLink href={p.href} className="project-card__link">{p.linkLabel ?? 'Open'} →</SmartLink>}
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="section" id="experience">
      <div className="container">
        <div className="section__head">
          <div>
            <p className="eyebrow">Experience</p>
            <h2>From software engineering to AI research</h2>
          </div>
          <a className="section__more" href={asset('Resume.pdf')}>Full CV (PDF) →</a>
        </div>
        <div className="entries">
          {experience.map((role) => (
            <article key={role.organisation} className="entry">
              <div className="entry__meta">{role.period}</div>
              <div className="entry__body">
                <h3>{role.organisation} <span className="entry__role">· {role.title}</span></h3>
                <p>{role.summary}</p>
                {role.tags && (
                  <div className="project-card__tags">
                    {role.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="section section--tint">
      <div className="container contact-strip">
        <div>
          <h2>Say hello</h2>
          <p className="section__lede">About an article, a mistake you spotted, research, or something to build together.</p>
        </div>
        <div className="hero__actions">
          <a href={`mailto:${site.email}`} className="button button--primary"><Mail size={16} /> {site.email}</a>
          <Link to="/contact" className="button">Other ways</Link>
        </div>
      </div>
    </section>
  </>
);

export default HomePage;
