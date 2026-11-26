import { useRef, useState } from 'react';

export const SWIPE_THRESHOLD = 50;

const KEY_TO_DIRECTION = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
};

// Pure: which swipe (if any) a pointer drag of (dx, dy) pixels means.
export function directionFromDelta(dx, dy) {
  if (Math.abs(dy) > Math.abs(dx)) {
    return dy < -SWIPE_THRESHOLD ? 'up' : null;
  }
  if (dx > SWIPE_THRESHOLD) return 'right';
  if (dx < -SWIPE_THRESHOLD) return 'left';
  return null;
}

// Keyboard + pointer handlers for the focusable deck (slide 31 contract).
export function useSwipeGestures({ onSwipe, onUndo }) {
  const start = useRef(null);
  const [drag, setDrag] = useState({ dx: 0, dy: 0 });

  const onKeyDown = (e) => {
    if (e.repeat) return;
    if (e.key === 'Backspace') {
      e.preventDefault();
      onUndo();
    } else if (e.key in KEY_TO_DIRECTION) {
      e.preventDefault();
      onSwipe(KEY_TO_DIRECTION[e.key]);
    }
  };

  const reset = () => {
    start.current = null;
    setDrag({ dx: 0, dy: 0 });
  };

  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    start.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerMove = (e) => {
    if (!start.current) return;
    setDrag({
      dx: e.clientX - start.current.x,
      dy: e.clientY - start.current.y,
    });
  };

  const onPointerUp = (e) => {
    // A pointerup without a recorded start would crash the slide version.
    if (!start.current) return;
    const direction = directionFromDelta(
      e.clientX - start.current.x,
      e.clientY - start.current.y
    );
    reset();
    if (direction) onSwipe(direction);
  };

  return {
    drag,
    handlers: {
      onKeyDown,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: reset,
    },
  };
}
