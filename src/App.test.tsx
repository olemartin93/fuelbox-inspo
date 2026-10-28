import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from './App';
import { categories } from './data/categories';
import { getQuestionsForCategory } from './data/questions';
import { STORAGE_KEY } from './lib/storage';

const savedRatings = (): Record<string, string> => JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Record<string, string>;

async function openCategory(name: RegExp) {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole('button', { name }));
  await screen.findByTestId('question');
  return user;
}

describe('App', () => {
  it('shows the app name and all categories on the home screen', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: 'Fuel Talks' })).toBeInTheDocument();
    for (const c of categories) {
      expect(screen.getByRole('button', { name: new RegExp(c.name) })).toBeInTheDocument();
    }
  });

  it('opens a category and shows a question from it', async () => {
    await openCategory(/Romantikk & dating/);
    const texts = getQuestionsForCategory('romantikk').map((q) => q.text);
    expect(texts).toContain(screen.getByTestId('question').textContent);
    expect(screen.getByTestId('progress')).toHaveTextContent(`1 / ${texts.length}`);
    expect(window.location.hash).toBe('#/kategori/romantikk');
  });

  it('thumbs up saves the card as a favourite and moves to the next card', async () => {
    const user = await openCategory(/Jobb & karriere/);
    const first = screen.getByTestId('question').textContent ?? '';
    await user.click(screen.getByRole('button', { name: 'Tommel opp' }));
    await waitFor(() => expect(screen.getByTestId('progress')).toHaveTextContent(/^2 \//));
    expect(screen.getByTestId('question').textContent).not.toBe(first);
    expect(Object.values(savedRatings())).toEqual(['up']);

    await user.click(screen.getByRole('button', { name: 'Tilbake' }));
    await user.click(screen.getByRole('button', { name: /Favoritter/ }));
    expect(within(screen.getByRole('region', { name: 'Favoritter' })).getByText(first)).toBeInTheDocument();
  });

  it('thumbs down hides the card the next time the deck is opened', async () => {
    const user = await openCategory(/Vennskap/);
    const total = getQuestionsForCategory('vennskap').length;
    await user.click(screen.getByRole('button', { name: 'Tommel ned' }));
    await waitFor(() => expect(screen.getByTestId('progress')).toHaveTextContent(/^2 \//));
    expect(Object.values(savedRatings())).toEqual(['down']);

    await user.click(screen.getByRole('button', { name: 'Tilbake' }));
    await user.click(screen.getByRole('button', { name: /Vennskap/ }));
    expect(await screen.findByTestId('progress')).toHaveTextContent(`1 / ${total - 1}`);
  });

  it('skip moves on without rating', async () => {
    const user = await openCategory(/Dype tanker/);
    await user.click(screen.getByRole('button', { name: 'Hopp over' }));
    await waitFor(() => expect(screen.getByTestId('progress')).toHaveTextContent(/^2 \//));
    expect(savedRatings()).toEqual({});
  });

  it('undo goes back and removes the rating', async () => {
    const user = await openCategory(/Familie/);
    const first = screen.getByTestId('question').textContent;
    await user.click(screen.getByRole('button', { name: 'Tommel opp' }));
    await waitFor(() => expect(screen.getByTestId('progress')).toHaveTextContent(/^2 \//));
    await user.click(screen.getByRole('button', { name: 'Angre' }));
    expect(screen.getByTestId('question').textContent).toBe(first);
    expect(savedRatings()).toEqual({});
  });

  it('swiping right gives a thumbs up', async () => {
    await openCategory(/Moro/);
    const card = screen.getByTestId('swipe-card');
    fireEvent.pointerDown(card, { clientX: 100, pointerId: 1 });
    fireEvent.pointerMove(card, { clientX: 260, pointerId: 1 });
    fireEvent.pointerUp(card, { clientX: 260, pointerId: 1 });
    await waitFor(() => expect(screen.getByTestId('progress')).toHaveTextContent(/^2 \//));
    expect(Object.values(savedRatings())).toEqual(['up']);
  });

  it('swiping left gives a thumbs down', async () => {
    await openCategory(/Moro/);
    const card = screen.getByTestId('swipe-card');
    fireEvent.pointerDown(card, { clientX: 300, pointerId: 1 });
    fireEvent.pointerMove(card, { clientX: 100, pointerId: 1 });
    fireEvent.pointerUp(card, { clientX: 100, pointerId: 1 });
    await waitFor(() => expect(Object.values(savedRatings())).toEqual(['down']));
  });

  it('a short drag snaps back without rating', async () => {
    await openCategory(/Moro/);
    const card = screen.getByTestId('swipe-card');
    fireEvent.pointerDown(card, { clientX: 100, pointerId: 1 });
    fireEvent.pointerMove(card, { clientX: 140, pointerId: 1 });
    fireEvent.pointerUp(card, { clientX: 140, pointerId: 1 });
    expect(screen.getByTestId('progress')).toHaveTextContent(/^1 \//);
    expect(savedRatings()).toEqual({});
  });

  it('arrow keys rate cards', async () => {
    await openCategory(/Moro/);
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    await waitFor(() => expect(screen.getByTestId('progress')).toHaveTextContent(/^2 \//));
    expect(Object.values(savedRatings())).toEqual(['up']);
  });

  it('shows an empty state for favourites and can remove a favourite', async () => {
    const user = userEvent.setup();
    const [q] = getQuestionsForCategory('moro');
    if (!q) throw new Error('need question');
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ [q.id]: 'up' }));
    window.location.hash = '#/favoritter';
    render(<App />);
    expect(screen.getByText(q.text)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Fjern/ }));
    expect(screen.getByText(/Ingen favoritter ennå/)).toBeInTheDocument();
  });

  it('shows the finished screen and can reshuffle', async () => {
    const qs = getQuestionsForCategory('moro');
    const [keep, ...rest] = qs;
    if (!keep) throw new Error('need question');
    // Every card except one is thumbs down, so the deck has a single card.
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(rest.map((q) => [q.id, 'down']))));
    const user = await openCategory(/Moro/);
    expect(screen.getByTestId('question')).toHaveTextContent(keep.text);
    await user.click(screen.getByRole('button', { name: 'Hopp over' }));
    expect(await screen.findByText('Ferdig med bunken!')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Nullstill og vis alle kort' }));
    expect(screen.getByTestId('progress')).toHaveTextContent(`1 / ${qs.length}`);
  });

  it('falls back to home for unknown categories', () => {
    window.location.hash = '#/kategori/ukjent';
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: 'Fuel Talks' })).toBeInTheDocument();
  });
});
