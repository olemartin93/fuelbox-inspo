import type { Question } from '../data/questions';
import type { Ratings } from './storage';

/** Fisher–Yates shuffle. Returns a new array. */
export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const a = result[i] as T;
    result[i] = result[j] as T;
    result[j] = a;
  }
  return result;
}

/** Shuffled deck for a category, without the questions the user has given a thumbs down. */
export function buildDeck(
  questions: readonly Question[],
  ratings: Ratings,
  random: () => number = Math.random,
): Question[] {
  return shuffle(
    questions.filter((q) => ratings[q.id] !== 'down'),
    random,
  );
}
