import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { asset } from '../app/site';

/** A link to a route ("/blog"), an external URL ("https://…") or a file in public/ ("thesis.pdf"). */
const SmartLink = ({ href, className, children }: { href: string; className?: string; children: ReactNode }) => {
  if (href.startsWith('/')) return <Link to={href} className={className}>{children}</Link>;
  if (/^https?:/.test(href)) return <a href={href} className={className} target="_blank" rel="noreferrer">{children}</a>;
  return <a href={asset(href)} className={className}>{children}</a>;
};

export default SmartLink;
