import { categories } from '../data/categories';
import { getQuestionsForCategory } from '../data/questions';
import type { Ratings } from '../lib/storage';

interface HomeProps {
  readonly ratings: Ratings;
  readonly onPick: (categoryId: string) => void;
  readonly onFavorites: () => void;
}

export function Home({ ratings, onPick, onFavorites }: HomeProps) {
  const likedTotal = Object.values(ratings).filter((r) => r === 'up').length;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-[max(2rem,env(safe-area-inset-bottom))]">
      <header className="flex flex-col items-center gap-2 py-8 text-center">
        <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="size-20 rounded-2xl shadow-xl" />
        <h1 className="text-4xl font-black tracking-tight">Fuel Talks</h1>
        <p className="max-w-xs text-stone-300">Trekk et kort, snakk sammen – og gi tommel opp eller ned.</p>
      </header>

      <h2 className="sr-only">Velg en kategori</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {categories.map((category) => {
          const total = getQuestionsForCategory(category.id).length;
          return (
            <li key={category.id}>
              <button
                type="button"
                onClick={() => onPick(category.id)}
                className={`flex w-full items-center gap-4 rounded-2xl bg-gradient-to-br p-4 text-left text-white shadow-lg transition active:scale-[0.98] ${category.gradient}`}
              >
                <span className="text-4xl" aria-hidden="true">
                  {category.emoji}
                </span>
                <span className="flex-1">
                  <span className="block text-lg font-bold">{category.name}</span>
                  <span className="block text-sm text-white/85">{category.description}</span>
                  <span className="mt-1 block text-xs font-semibold text-white/75">{total} kort</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={onFavorites}
        className="mt-4 w-full rounded-2xl bg-stone-800 p-4 text-left font-semibold hover:bg-stone-700"
      >
        ⭐ Favoritter <span className="text-stone-400">({likedTotal})</span>
      </button>

      <details className="mt-4 rounded-2xl bg-stone-800/60 p-4 text-sm text-stone-300">
        <summary className="cursor-pointer font-semibold text-stone-100">Slik bruker du Fuel Talks</summary>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Velg en kategori som passer situasjonen.</li>
          <li>Les spørsmålet høyt og la alle svare.</li>
          <li>Sveip til høyre (👍) for å lagre kortet som favoritt, eller til venstre (👎) for å skjule det.</li>
          <li>Appen fungerer uten nett, og alt lagres bare på din telefon.</li>
        </ol>
      </details>
    </div>
  );
}
