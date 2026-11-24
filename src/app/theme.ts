import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const media = () => window.matchMedia('(prefers-color-scheme: dark)');

const stored = (): Theme | null => {
  try {
    const value = localStorage.getItem('theme');
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
};

export const resolvedTheme = (): Theme => stored() ?? (media().matches ? 'dark' : 'light');

/** The current theme and a toggle. An explicit choice is remembered; otherwise the system decides. */
export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() => (typeof window === 'undefined' ? 'light' : resolvedTheme()));

  useEffect(() => {
    const onChange = () => {
      if (!stored()) setTheme(media().matches ? 'dark' : 'light');
    };
    media().addEventListener('change', onChange);
    return () => media().removeEventListener('change', onChange);
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = resolvedTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* private mode */
    }
    setTheme(next);
    window.dispatchEvent(new CustomEvent('themechange', { detail: next }));
  }, []);

  return [theme, toggle];
}
