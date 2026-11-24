import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

import '@fontsource/spectral/400.css';
import '@fontsource/spectral/400-italic.css';
import '@fontsource/spectral/500.css';
import '@fontsource/spectral/500-italic.css';
import '@fontsource/spectral/600.css';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import 'katex/dist/katex.min.css';

import './styles/tokens.css';
import './styles/base.css';
import './styles/prose.css';
import './styles/site.css';
import './stage/stage.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
