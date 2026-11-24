import { ReactNode } from 'react';

interface CalloutProps {
  tag?: string;
  children: ReactNode;
}

const Callout = ({ tag, children }: CalloutProps) => (
  <aside className="callout">
    {tag && <span className="callout__tag">{tag}</span>}
    {children}
  </aside>
);

export default Callout;
