import { describe, expect, it } from 'vitest';
import { loadRatings, saveRatings, STORAGE_KEY } from './storage';

describe('ratings storage', () => {
  it('round-trips ratings', () => {
    saveRatings({ 'jobb-1': 'up', 'moro-2': 'down' });
    expect(loadRatings()).toEqual({ 'jobb-1': 'up', 'moro-2': 'down' });
  });

  it('returns an empty object when nothing is saved', () => {
    expect(loadRatings()).toEqual({});
  });

  it('ignores corrupt JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{not json');
    expect(loadRatings()).toEqual({});
  });

  it('drops invalid values', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ a: 'up', b: 'maybe', c: 3 }));
    expect(loadRatings()).toEqual({ a: 'up' });
  });

  it('ignores non-object data', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['up']));
    expect(loadRatings()).toEqual({});
  });

  it('does not throw when storage is unavailable', () => {
    const broken = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
    } as unknown as Storage;
    expect(loadRatings(broken)).toEqual({});
    expect(() => saveRatings({ a: 'up' }, broken)).not.toThrow();
  });
});
