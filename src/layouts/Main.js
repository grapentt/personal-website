import React from 'react';
import PropTypes from 'prop-types';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import Analytics from '../components/Template/Analytics';
import Navigation from '../components/Template/Navigation';
import SideBar from '../components/Template/SideBar';
import ScrollToTop from '../components/Template/ScrollToTop';
import ContactIcons from '../components/Contact/ContactIcons';

const Main = (props) => (
  <HelmetProvider>
    <Analytics />
    <ScrollToTop />
    <Helmet
      titleTemplate="%s | Thomas Grapentin"
      defaultTitle="Thomas Grapentin"
      defer={false}
    >
      {props.title && <title>{props.title}</title>}
      <meta name="description" content={props.description} />
    </Helmet>
    <div id="wrapper">
      <Navigation />
      {!props.fullPage && <SideBar />} {/* Move SideBar above */}
      <div id="main">{props.children}</div>
    </div>  
    <section id="footer">
      <ContactIcons />
      <p className="copyright">
        &copy; Thomas Grapentin <Link to="/">https://grapentt.github.io/personal-website</Link>.
      </p>
    </section>
  </HelmetProvider>
);

Main.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  fullPage: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
};

Main.defaultProps = {
  children: null,
  fullPage: false,
  title: null,
  description: "Thomas Grapentin's personal website.",
};

export default Main;
