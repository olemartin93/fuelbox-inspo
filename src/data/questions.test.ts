import { describe, expect, it } from 'vitest';
import { categories, getCategory } from './categories';
import { getQuestionsForCategory, questions } from './questions';

describe('question bank', () => {
  it('has the required categories', () => {
    const ids = categories.map((c) => c.id);
    expect(ids).toContain('romantikk');
    expect(ids).toContain('jobb');
    expect(categories.length).toBeGreaterThanOrEqual(4);
  });

  it.each(categories.map((c) => [c.id] as const))('category "%s" has at least 50 questions', (id) => {
    expect(getQuestionsForCategory(id).length).toBeGreaterThanOrEqual(50);
  });

  it('has unique ids', () => {
    const ids = questions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has no duplicate question texts', () => {
    const texts = questions.map((q) => q.text.toLowerCase());
    const duplicates = texts.filter((t, i) => texts.indexOf(t) !== i);
    expect(duplicates).toEqual([]);
  });

  it('has tidy question texts', () => {
    for (const q of questions) {
      expect(q.text, q.id).toBe(q.text.trim());
      expect(q.text.length, q.id).toBeGreaterThan(10);
      expect(q.text, q.id).toMatch(/[?.!]$/);
      expect(q.text, q.id).not.toMatch(/\s{2,}/);
    }
  });

  it('every question belongs to a known category', () => {
    for (const q of questions) expect(getCategory(q.categoryId)).toBeDefined();
  });

  it('getCategory returns undefined for unknown ids', () => {
    expect(getCategory('finnes-ikke')).toBeUndefined();
  });
});
