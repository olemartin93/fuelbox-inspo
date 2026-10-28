export type Rating = 'up' | 'down';
export type Ratings = Readonly<Record<string, Rating>>;

export const STORAGE_KEY = 'fuel-talks:ratings:v1';

function isRating(value: unknown): value is Rating {
  return value === 'up' || value === 'down';
}

/** Reads saved ratings. Ignores corrupt data and unavailable storage. */
export function loadRatings(storage: Storage | undefined = globalThis.localStorage): Ratings {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {};
    const result: Record<string, Rating> = {};
    for (const [id, value] of Object.entries(parsed)) {
      if (isRating(value)) result[id] = value;
    }
    return result;
  } catch {
    return {};
  }
}

export function saveRatings(ratings: Ratings, storage: Storage | undefined = globalThis.localStorage): void {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(ratings));
  } catch {
    // Storage full or blocked (e.g. private mode) – the app still works for this session.
  }
}
