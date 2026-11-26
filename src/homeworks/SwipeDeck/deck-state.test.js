import { describe, expect, it } from 'vitest';
import { historyReducer, remainingDeck, scoreOf } from './deck-state.js';

// Contract:
//   historyReducer(history, action) -> history (LIFO stack, never mutated)
//     { type: 'swipe', profileId, direction }  push, ignored if already swiped
//     { type: 'undo' }                         pop, no-op when empty
//   remainingDeck(profiles, history) -> profiles not swiped, in deck order
//   scoreOf(history) -> right (LIKE) +10, left (NOPE) -5,
//                       up ('Hẹn hò nhưng không yêu') -5
const PROFILES = [{ _id: 'a' }, { _id: 'b' }, { _id: 'c' }];
const swipe = (profileId, direction) => ({
  type: 'swipe',
  profileId,
  direction,
});
const run = (actions) => actions.reduce(historyReducer, []);

describe('historyReducer', () => {
  it('pushes swipes in order', () => {
    const history = run([swipe('a', 'right'), swipe('b', 'left')]);
    expect(history).toEqual([
      { profileId: 'a', direction: 'right' },
      { profileId: 'b', direction: 'left' },
    ]);
  });

  it('undo pops the last swipe first (LIFO)', () => {
    const history = run([
      swipe('a', 'right'),
      swipe('b', 'up'),
      swipe('c', 'left'),
      { type: 'undo' },
      { type: 'undo' },
    ]);
    expect(history).toEqual([{ profileId: 'a', direction: 'right' }]);
  });

  it('undo on an empty stack is a no-op', () => {
    const empty = [];
    expect(historyReducer(empty, { type: 'undo' })).toBe(empty);
  });

  it('ignores a second swipe of the same profile', () => {
    const once = run([swipe('a', 'right')]);
    expect(historyReducer(once, swipe('a', 'left'))).toBe(once);
  });

  it('never mutates the previous stack', () => {
    const before = Object.freeze([{ profileId: 'a', direction: 'right' }]);
    historyReducer(before, swipe('b', 'left'));
    historyReducer(before, { type: 'undo' });
    expect(before).toEqual([{ profileId: 'a', direction: 'right' }]);
  });
});

describe('derived deck and score', () => {
  it('remainingDeck drops swiped profiles and keeps the order', () => {
    const history = run([swipe('b', 'right')]);
    expect(remainingDeck(PROFILES, history).map((p) => p._id)).toEqual([
      'a',
      'c',
    ]);
  });

  it('an undone card goes back to the top of the deck', () => {
    const history = run([
      swipe('a', 'left'),
      swipe('b', 'left'),
      { type: 'undo' },
    ]);
    expect(remainingDeck(PROFILES, history)[0]._id).toBe('b');
  });

  it('scores asymmetrically: LIKE +10, everything else -5', () => {
    expect(scoreOf([])).toBe(0);
    expect(scoreOf(run([swipe('a', 'right')]))).toBe(10);
    expect(scoreOf(run([swipe('a', 'left')]))).toBe(-5);
    expect(scoreOf(run([swipe('a', 'up')]))).toBe(-5);
    expect(
      scoreOf(run([swipe('a', 'right'), swipe('b', 'left'), swipe('c', 'up')]))
    ).toBe(0);
  });
});
