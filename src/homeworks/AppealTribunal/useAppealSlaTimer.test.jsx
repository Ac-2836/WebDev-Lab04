import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useAppealSlaTimer } from './useAppealSlaTimer.js';

// Contract: useAppealSlaTimer(deadlineEpochMs, serverOffsetMs = 0)
//   -> { remainingMs, isExpired }
// remainingMs = max(0, deadline - (Date.now() + serverOffsetMs)), recomputed
// from the absolute clock on every tick and on visibilitychange -> visible;
// the component re-renders only when the displayed second changes.
const NOW = Date.UTC(2026, 10, 26, 12, 0, 0);
const SECOND = 1000;

function setVisibility(state) {
  Object.defineProperty(document, 'visibilityState', {
    configurable: true,
    get: () => state,
  });
  document.dispatchEvent(new Event('visibilitychange'));
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useAppealSlaTimer', () => {
  it('starts from deadline - (now + server offset)', () => {
    const { result } = renderHook(() =>
      useAppealSlaTimer(NOW + 90 * SECOND, 30 * SECOND)
    );
    expect(result.current).toEqual({
      remainingMs: 60 * SECOND,
      isExpired: false,
    });
  });

  it('counts down with the clock', () => {
    const { result } = renderHook(() => useAppealSlaTimer(NOW + 10 * SECOND));
    act(() => vi.advanceTimersByTime(3 * SECOND));
    expect(Math.ceil(result.current.remainingMs / SECOND)).toBe(7);
  });

  it('clamps at 0 and reports expiry', () => {
    const { result } = renderHook(() => useAppealSlaTimer(NOW + 2 * SECOND));
    act(() => vi.advanceTimersByTime(5 * SECOND));
    expect(result.current).toEqual({ remainingMs: 0, isExpired: true });
  });

  it('resyncs immediately when the tab becomes visible again', () => {
    const { result } = renderHook(() =>
      useAppealSlaTimer(NOW + 60 * 60 * SECOND)
    );
    // A background tab: the clock jumps 10 min while no interval ran.
    act(() => {
      setVisibility('hidden');
      vi.setSystemTime(NOW + 10 * 60 * SECOND);
      setVisibility('visible');
    });
    expect(Math.ceil(result.current.remainingMs / SECOND)).toBe(50 * 60);
  });

  it('renders once per displayed second, not once per tick', () => {
    let renders = 0;
    renderHook(() => {
      renders += 1;
      return useAppealSlaTimer(NOW + 60 * SECOND);
    });
    const before = renders;
    // One act() per 250 ms tick: a single act() would batch every update
    // into one render and hide per-tick re-renders.
    for (let i = 0; i < 12; i++) act(() => vi.advanceTimersByTime(250));
    expect(renders - before).toBe(3);
  });

  it('removes its interval and listener on unmount', () => {
    const remove = vi.spyOn(document, 'removeEventListener');
    const { unmount } = renderHook(() => useAppealSlaTimer(NOW + 60 * SECOND));
    expect(vi.getTimerCount()).toBeGreaterThan(0);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
    expect(remove).toHaveBeenCalledWith(
      'visibilitychange',
      expect.any(Function)
    );
    remove.mockRestore();
  });
});
