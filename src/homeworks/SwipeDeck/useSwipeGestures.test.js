import { describe, expect, it } from 'vitest';
import { directionFromDelta } from './useSwipeGestures.js';

describe('directionFromDelta (50 px threshold)', () => {
  it('maps horizontal drags past 50 px to left / right', () => {
    expect(directionFromDelta(51, 0)).toBe('right');
    expect(directionFromDelta(-51, 10)).toBe('left');
  });

  it('maps an upward drag past 50 px to up', () => {
    expect(directionFromDelta(10, -80)).toBe('up');
  });

  it('ignores short drags, taps and downward drags', () => {
    expect(directionFromDelta(50, 0)).toBeNull();
    expect(directionFromDelta(0, 0)).toBeNull();
    expect(directionFromDelta(5, 120)).toBeNull();
  });
});
