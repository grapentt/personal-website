import { Helmet } from 'react-helmet-async';
import { site } from '../app/site';

interface SeoProps {
  title?: string;
  description?: string;
  path?: string;
  type?: 'website' | 'article';
}

const Seo = ({ title, description = site.description, path = '', type = 'website' }: SeoProps) => (
  <Helmet>
    {title && <title>{title}</title>}
    <meta name="description" content={description} />
    <meta property="og:title" content={title ? `${title} · ${site.name}` : site.name} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content={type} />
    <meta property="og:url" content={`${site.url}${path}`} />
    <link rel="canonical" href={`${site.url}${path}`} />
  </Helmet>
);

export default Seo;
