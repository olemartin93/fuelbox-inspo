import { describe, expect, it } from 'vitest';
import { getQuestionsForCategory } from '../data/questions';
import { buildDeck, shuffle } from './deck';

describe('shuffle', () => {
  it('keeps all items and does not mutate the input', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8];
    const copy = [...input];
    const result = shuffle(input);
    expect(input).toEqual(copy);
    expect([...result].sort((a, b) => a - b)).toEqual(copy);
  });

  it('uses the random source', () => {
    expect(shuffle([1, 2, 3], () => 0)).toEqual([2, 3, 1]);
  });

  it('handles empty arrays', () => {
    expect(shuffle([])).toEqual([]);
  });
});

describe('buildDeck', () => {
  const qs = getQuestionsForCategory('jobb');

  it('contains every question when nothing is rated', () => {
    expect(buildDeck(qs, {})).toHaveLength(qs.length);
  });

  it('leaves out thumbs-down questions but keeps thumbs-up ones', () => {
    const [a, b] = qs;
    if (!a || !b) throw new Error('need questions');
    const deck = buildDeck(qs, { [a.id]: 'down', [b.id]: 'up' });
    expect(deck).toHaveLength(qs.length - 1);
    expect(deck.map((q) => q.id)).not.toContain(a.id);
    expect(deck.map((q) => q.id)).toContain(b.id);
  });
});
