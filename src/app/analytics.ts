/**
 * Anonymous counting with hits.sh: one image request per counted thing, no cookies,
 * nothing stored in the visitor's browser. Counts are only sent from the live site,
 * and never from a browser that opted out on the /stats page.
 */
import { counterKey, pageCounter } from './counters';

const LIVE_HOST = 'grapentt.github.io';
const OPT_OUT_KEY = 'hits-opt-out';

/** Events already counted during the current page view (each counts at most once). */
const sent = new Set<string>();

export function isOptedOut(): boolean {
  try {
    return localStorage.getItem(OPT_OUT_KEY) === '1';
  } catch {
    return false;
  }
}

export function setOptedOut(value: boolean) {
  try {
    if (value) localStorage.setItem(OPT_OUT_KEY, '1');
    else localStorage.removeItem(OPT_OUT_KEY);
  } catch {
    /* private mode: nothing to remember */
  }
}

function send(name: string) {
  const live = typeof window !== 'undefined' && window.location.hostname === LIVE_HOST;
  if (!live || isOptedOut()) {
    if (import.meta.env.DEV) console.info(`[count] ${name}`);
    return;
  }
  const url = `https://hits.sh/${counterKey(name)}.svg`;
  try {
    fetch(url, { mode: 'no-cors', cache: 'no-store', credentials: 'omit', keepalive: true, referrerPolicy: 'no-referrer' }).catch(() => {});
  } catch {
    new Image().src = url;
  }
}

/** Count a view of the page at `pathname` (router path, without the base). Starts a new page view. */
export function countPage(pathname: string) {
  sent.clear();
  const name = pageCounter(pathname);
  if (name) send(name);
}

/** Count an event such as 'download/cv' or 'film/hopf-fibration/play', once per page view. */
export function countEvent(event: string) {
  const name = `/event/${event}`;
  if (sent.has(name)) return;
  sent.add(name);
  send(name);
}

/** The event a click on a link stands for, if any. */
export function linkEvent(href: string): string | null {
  if (/Resume\.pdf($|[?#])/.test(href)) return 'download/cv';
  if (/thesis\.pdf($|[?#])/.test(href)) return 'download/thesis';
  if (href.startsWith('mailto:')) return 'contact/email';
  if (/^https?:\/\/(www\.)?linkedin\.com\//.test(href)) return 'contact/linkedin';
  if (/^https?:\/\/github\.com\/grapentt\/?$/.test(href)) return 'contact/github';
  return null;
}
