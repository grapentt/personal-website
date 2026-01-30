import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import { Analytics, Navigation, ScrollToTop } from '@/shared/components';
import { ContactIcons } from '@/features/contact';

interface MainProps {
  children?: React.ReactNode;
  title?: string | null;
  description?: string;
}

const Main: React.FC<MainProps> = ({
  children = null,
  title = null,
  description = "Thomas Grapentin's personal website.",
}) => (
  <HelmetProvider>
    <Analytics />
    <ScrollToTop />
    <Helmet
      titleTemplate="%s | Thomas Grapentin"
      defaultTitle="Thomas Grapentin"
      defer={false}
    >
      {title && <title>{title}</title>}
      <meta name="description" content={description} />
    </Helmet>
    <div id="wrapper">
      <Navigation />
      <div id="main">{children}</div>
      {/* {!props.fullPage && <SideBar />}  */}
    </div>
    <section id="footer">
      <ContactIcons />
      <p className="copyright">
        &copy; Thomas Grapentin <Link to="/">https://grapentt.github.io/personal-website</Link>.
      </p>
    </section>
  </HelmetProvider>
);

export default Main;
