'use client';
import { useState, useEffect } from 'react';

/** Tracks whether a CSS media query string matches the current viewport. */
export function useMediaQuery(
  /** CSS media query string (e.g. `(min-width: 768px)`). */
  query: string,
): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
