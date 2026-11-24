// Render cv/cv.html to public/Resume.pdf with headless Chrome (A4, page size and margins from the
// page's own @page rule). Run with `npm run cv`. Set CHROME to use another Chrome/Chromium binary.

import { execFileSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const input = pathToFileURL(resolve(root, 'cv/cv.html')).href;
const output = resolve(root, 'public/Resume.pdf');
const chrome = process.env.CHROME
  ?? ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(existsSync);
if (!chrome) throw new Error('No Chrome found; set CHROME to a Chrome or Chromium binary.');

execFileSync(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--no-pdf-header-footer',
  '--allow-file-access-from-files',
  '--virtual-time-budget=5000', // let the web fonts load before printing
  `--print-to-pdf=${output}`,
  input,
], { stdio: 'inherit' });
console.info(`wrote ${output} (${(statSync(output).size / 1024).toFixed(0)} kB)`);
