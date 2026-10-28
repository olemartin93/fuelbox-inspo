import { useCallback, useEffect, useRef, useState } from 'react';
import type { Category } from '../data/categories';
import { getQuestionsForCategory, type Question } from '../data/questions';
import { buildDeck } from '../lib/deck';
import type { Rating } from '../lib/storage';
import type { RatingsApi } from '../lib/useRatings';
import { SwipeCard, type SwipeDirection } from './SwipeCard';

interface DeckProps {
  readonly category: Category;
  readonly ratingsApi: RatingsApi;
  readonly onBack: () => void;
}

const EXIT_MS = 250;

type Action = Rating | 'skip';

export function Deck({ category, ratingsApi, onBack }: DeckProps) {
  const { ratings, rate, clear } = ratingsApi;
  const allQuestions = getQuestionsForCategory(category.id);
  const [deck, setDeck] = useState<Question[]>(() => buildDeck(allQuestions, ratings));
  const [index, setIndex] = useState(0);
  const [exit, setExit] = useState<SwipeDirection | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const current = deck[index];
  const next = deck[index + 1];

  const act = useCallback(
    (action: Action) => {
      if (!current || exit) return;
      if (action !== 'skip') rate(current.id, action);
      setExit(action === 'down' ? 'left' : 'right');
      timer.current = setTimeout(() => {
        setExit(null);
        setIndex((i) => i + 1);
      }, EXIT_MS);
    },
    [current, exit, rate],
  );

  const undo = () => {
    if (index === 0 || exit) return;
    const previous = deck[index - 1];
    if (previous) clear([previous.id]);
    setIndex(index - 1);
  };

  const reshuffle = () => {
    setDeck(buildDeck(allQuestions, ratings));
    setIndex(0);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') act('up');
      else if (e.key === 'ArrowLeft') act('down');
      else if (e.key === 'ArrowUp') act('skip');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [act]);

  const liked = allQuestions.filter((q) => ratings[q.id] === 'up').length;
  const disliked = allQuestions.filter((q) => ratings[q.id] === 'down').length;

  return (
    <section className="flex min-h-0 flex-1 flex-col" aria-label={category.name}>
      <header className="flex items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Tilbake"
          className="grid size-10 shrink-0 place-items-center rounded-full bg-stone-800 text-lg font-semibold hover:bg-stone-700"
        >
          ←
        </button>
        <h2 className="flex-1 truncate text-center text-lg font-bold">
          <span aria-hidden="true">{category.emoji}</span> {category.name}
        </h2>
        <span className="min-w-14 shrink-0 text-right text-sm tabular-nums text-stone-400" data-testid="progress">
          {Math.min(index + 1, deck.length)} / {deck.length}
        </span>
      </header>

      {current ? (
        <>
          <div className="relative mx-auto my-4 w-full max-w-sm flex-1 px-4">
            <div className="relative h-full min-h-[22rem]">
              {next && (
                <div
                  aria-hidden="true"
                  className={`absolute inset-0 translate-y-3 scale-95 rounded-3xl bg-gradient-to-br opacity-60 ${category.gradient}`}
                />
              )}
              <SwipeCard key={current.id} gradient={category.gradient} exit={exit} onSwipe={(d) => act(d === 'right' ? 'up' : 'down')}>
                <span className="text-5xl" aria-hidden="true">
                  {category.emoji}
                </span>
                <p className="text-2xl font-bold leading-snug text-balance" data-testid="question">
                  {current.text}
                </p>
                <span className="text-sm font-medium text-white/80">Fuel Talks · {category.name}</span>
              </SwipeCard>
            </div>
          </div>

          <p className="px-4 text-center text-sm text-stone-400">Sveip til høyre for 👍, til venstre for 👎</p>

          <div className="flex items-center justify-center gap-4 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4">
            <button
              type="button"
              onClick={undo}
              disabled={index === 0}
              aria-label="Angre"
              className="grid size-12 place-items-center rounded-full bg-stone-800 text-xl disabled:opacity-30"
            >
              ↩️
            </button>
            <button
              type="button"
              onClick={() => act('down')}
              aria-label="Tommel ned"
              className="grid size-16 place-items-center rounded-full bg-stone-800 text-3xl shadow-lg ring-2 ring-rose-500 hover:bg-stone-700"
            >
              👎
            </button>
            <button
              type="button"
              onClick={() => act('skip')}
              aria-label="Hopp over"
              className="grid size-12 place-items-center rounded-full bg-stone-800 text-xl"
            >
              ⏭️
            </button>
            <button
              type="button"
              onClick={() => act('up')}
              aria-label="Tommel opp"
              className="grid size-16 place-items-center rounded-full bg-stone-800 text-3xl shadow-lg ring-2 ring-emerald-500 hover:bg-stone-700"
            >
              👍
            </button>
          </div>
        </>
      ) : (
        <div className="mx-auto flex max-w-sm flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="text-6xl" aria-hidden="true">
            🎉
          </span>
          <h3 className="text-2xl font-bold">Ferdig med bunken!</h3>
          <p className="text-stone-300">
            Du har {liked} 👍 og {disliked} 👎 i denne kategorien. Kort med tommel ned blir ikke vist igjen.
          </p>
          <button
            type="button"
            onClick={reshuffle}
            className="w-full rounded-full bg-orange-500 px-6 py-3 font-bold text-stone-950 hover:bg-orange-400"
          >
            Stokk på nytt
          </button>
          {disliked > 0 && (
            <button
              type="button"
              onClick={() => {
                clear(allQuestions.map((q) => q.id));
                setDeck(buildDeck(allQuestions, {}));
                setIndex(0);
              }}
              className="w-full rounded-full bg-stone-800 px-6 py-3 font-semibold hover:bg-stone-700"
            >
              Nullstill og vis alle kort
            </button>
          )}
        </div>
      )}
    </section>
  );
}
