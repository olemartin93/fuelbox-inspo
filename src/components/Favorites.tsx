import { categories } from '../data/categories';
import { questions } from '../data/questions';
import type { RatingsApi } from '../lib/useRatings';

interface FavoritesProps {
  readonly ratingsApi: RatingsApi;
  readonly onBack: () => void;
}

export function Favorites({ ratingsApi, onBack }: FavoritesProps) {
  const { ratings, clear } = ratingsApi;
  const liked = questions.filter((q) => ratings[q.id] === 'up');

  return (
    <section className="mx-auto w-full max-w-2xl px-4 pb-8" aria-label="Favoritter">
      <header className="flex items-center gap-3 py-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Tilbake"
          className="grid size-10 shrink-0 place-items-center rounded-full bg-stone-800 text-lg font-semibold hover:bg-stone-700"
        >
          ←
        </button>
        <h2 className="flex-1 text-center text-lg font-bold">⭐ Favoritter</h2>
        <span className="size-10 shrink-0" />
      </header>

      {liked.length === 0 ? (
        <p className="py-16 text-center text-stone-400">Ingen favoritter ennå. Gi et kort 👍 for å lagre det her.</p>
      ) : (
        categories.map((category) => {
          const items = liked.filter((q) => q.categoryId === category.id);
          if (items.length === 0) return null;
          return (
            <div key={category.id} className="mt-4">
              <h3 className="mb-2 font-bold">
                <span aria-hidden="true">{category.emoji}</span> {category.name}
              </h3>
              <ul className="space-y-2">
                {items.map((q) => (
                  <li key={q.id} className="flex items-start gap-3 rounded-xl bg-stone-800 p-3">
                    <p className="flex-1">{q.text}</p>
                    <button
                      type="button"
                      onClick={() => clear([q.id])}
                      aria-label={`Fjern «${q.text}» fra favoritter`}
                      className="rounded-full px-2 text-stone-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })
      )}
    </section>
  );
}
