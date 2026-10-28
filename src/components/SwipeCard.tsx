import { useRef, useState, type PointerEvent, type ReactNode } from 'react';

export type SwipeDirection = 'left' | 'right';

interface SwipeCardProps {
  readonly children: ReactNode;
  readonly gradient: string;
  /** Set by the parent when the card should fly out (after a swipe or a button press). */
  readonly exit: SwipeDirection | null;
  readonly onSwipe: (direction: SwipeDirection) => void;
}

/** Distance in px a card must be dragged before it counts as a swipe. */
export const SWIPE_THRESHOLD = 100;

export function SwipeCard({ children, gradient, exit, onSwipe }: SwipeCardProps) {
  const startX = useRef<number | null>(null);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (exit) return;
    startX.current = e.clientX;
    setDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (startX.current === null) return;
    setDragX(e.clientX - startX.current);
  };

  const handlePointerEnd = () => {
    if (startX.current === null) return;
    startX.current = null;
    setDragging(false);
    if (Math.abs(dragX) >= SWIPE_THRESHOLD) {
      onSwipe(dragX > 0 ? 'right' : 'left');
    } else {
      setDragX(0);
    }
  };

  const x = exit === 'right' ? 600 : exit === 'left' ? -600 : dragX;
  const rotation = x / 20;
  const likeOpacity = Math.min(Math.max(x / SWIPE_THRESHOLD, 0), 1);
  const dislikeOpacity = Math.min(Math.max(-x / SWIPE_THRESHOLD, 0), 1);

  return (
    <div
      data-testid="swipe-card"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      style={{ transform: `translateX(${x}px) rotate(${rotation}deg)` }}
      className={`absolute inset-0 flex cursor-grab touch-none select-none flex-col justify-between rounded-3xl bg-gradient-to-br p-7 text-white shadow-2xl active:cursor-grabbing ${gradient} ${
        dragging ? '' : 'transition-transform duration-300 ease-out motion-reduce:transition-none'
      } ${exit ? 'pointer-events-none opacity-0 transition-[transform,opacity]' : ''}`}
    >
      <span
        aria-hidden="true"
        style={{ opacity: likeOpacity }}
        className="absolute left-6 top-24 -rotate-12 rounded-xl border-4 border-white px-3 py-1 text-2xl font-black"
      >
        👍 LIKER
      </span>
      <span
        aria-hidden="true"
        style={{ opacity: dislikeOpacity }}
        className="absolute right-6 top-24 rotate-12 rounded-xl border-4 border-white px-3 py-1 text-2xl font-black"
      >
        👎 NEI
      </span>
      {children}
    </div>
  );
}
