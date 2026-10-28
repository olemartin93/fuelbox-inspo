import { useCallback, useEffect, useState } from 'react';
import { loadRatings, saveRatings, type Rating, type Ratings } from './storage';

export interface RatingsApi {
  readonly ratings: Ratings;
  readonly rate: (questionId: string, rating: Rating) => void;
  readonly clear: (questionIds: readonly string[]) => void;
}

export function useRatings(): RatingsApi {
  const [ratings, setRatings] = useState<Ratings>(() => loadRatings());

  useEffect(() => {
    saveRatings(ratings);
  }, [ratings]);

  const rate = useCallback((questionId: string, rating: Rating) => {
    setRatings((prev) => ({ ...prev, [questionId]: rating }));
  }, []);

  const clear = useCallback((questionIds: readonly string[]) => {
    setRatings((prev) => {
      const next: Record<string, Rating> = { ...prev };
      for (const id of questionIds) delete next[id];
      return next;
    });
  }, []);

  return { ratings, rate, clear };
}
