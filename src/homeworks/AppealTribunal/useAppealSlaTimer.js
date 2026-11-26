import { useEffect, useRef, useState } from 'react';

const TICK_MS = 250;
const SECOND = 1000;

const remainingAt = (deadlineEpochMs, serverOffsetMs) =>
  Math.max(0, deadlineEpochMs - (Date.now() + serverOffsetMs));

// Zero drift: always recomputed from the absolute clock, never decremented.
export function useAppealSlaTimer(deadlineEpochMs, serverOffsetMs = 0) {
  const [remainingMs, setRemainingMs] = useState(() =>
    remainingAt(deadlineEpochMs, serverOffsetMs)
  );
  // Second currently on screen; setState is skipped while it is unchanged,
  // so the 250 ms tick costs no render at all.
  const shownSecond = useRef(null);

  useEffect(() => {
    const sync = () => {
      const next = remainingAt(deadlineEpochMs, serverOffsetMs);
      const second = Math.ceil(next / SECOND);
      if (second === shownSecond.current) return;
      shownSecond.current = second;
      setRemainingMs(next);
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') sync();
    };

    shownSecond.current = null;
    sync();
    const id = setInterval(sync, TICK_MS);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [deadlineEpochMs, serverOffsetMs]);

  return { remainingMs, isExpired: remainingMs === 0 };
}
