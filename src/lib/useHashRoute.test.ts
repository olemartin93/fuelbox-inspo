import { describe, expect, it } from 'vitest';
import { parseHash, routeToHash, type Route } from './useHashRoute';

describe('hash routes', () => {
  it.each<[string, Route]>([
    ['', { name: 'home' }],
    ['#/', { name: 'home' }],
    ['#/favoritter', { name: 'favorites' }],
    ['#/kategori/jobb', { name: 'deck', categoryId: 'jobb' }],
    ['#/tull/<script>', { name: 'home' }],
  ])('parses %j', (hash, route) => {
    expect(parseHash(hash)).toEqual(route);
  });

  it('round-trips routes', () => {
    const routes: Route[] = [{ name: 'home' }, { name: 'favorites' }, { name: 'deck', categoryId: 'moro' }];
    for (const r of routes) expect(parseHash(routeToHash(r))).toEqual(r);
  });
});
