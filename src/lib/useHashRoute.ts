import { useCallback, useEffect, useState } from 'react';

export type Route = { readonly name: 'home' } | { readonly name: 'deck'; readonly categoryId: string } | { readonly name: 'favorites' };

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#\/?/, '');
  if (path === 'favoritter') return { name: 'favorites' };
  const match = /^kategori\/([a-z]+)$/.exec(path);
  if (match?.[1]) return { name: 'deck', categoryId: match[1] };
  return { name: 'home' };
}

export function routeToHash(route: Route): string {
  switch (route.name) {
    case 'home':
      return '#/';
    case 'favorites':
      return '#/favoritter';
    case 'deck':
      return `#/kategori/${route.categoryId}`;
  }
}

/** Hash routing so the phone's back button works and the PWA scope stays simple on GitHub Pages. */
export function useHashRoute(): [Route, (route: Route) => void] {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));

  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((next: Route) => {
    window.location.hash = routeToHash(next);
  }, []);

  return [route, navigate];
}
