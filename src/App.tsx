import { useEffect } from 'react';
import { Deck } from './components/Deck';
import { Favorites } from './components/Favorites';
import { Home } from './components/Home';
import { getCategory } from './data/categories';
import { useHashRoute } from './lib/useHashRoute';
import { useRatings } from './lib/useRatings';

export function App() {
  const [route, navigate] = useHashRoute();
  const ratingsApi = useRatings();
  const goHome = () => navigate({ name: 'home' });
  const category = route.name === 'deck' ? getCategory(route.categoryId) : undefined;

  useEffect(() => {
    window.scrollTo?.(0, 0);
  }, [route]);

  return (
    <main className="flex min-h-dvh flex-col bg-stone-900 pt-[env(safe-area-inset-top)] text-stone-100">
      {route.name === 'favorites' ? (
        <Favorites ratingsApi={ratingsApi} onBack={goHome} />
      ) : category ? (
        <Deck key={category.id} category={category} ratingsApi={ratingsApi} onBack={goHome} />
      ) : (
        <Home
          ratings={ratingsApi.ratings}
          onPick={(categoryId) => navigate({ name: 'deck', categoryId })}
          onFavorites={() => navigate({ name: 'favorites' })}
        />
      )}
    </main>
  );
}
