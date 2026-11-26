export const DIRECTIONS = {
  left: { label: 'Nope', points: -5 },
  up: { label: 'Hẹn hò nhưng không yêu', points: -5 },
  right: { label: 'Like', points: 10 },
};

// LIFO stack of swipes; every update returns a new array.
export function historyReducer(history, action) {
  switch (action.type) {
    case 'swipe': {
      const { profileId, direction } = action;
      if (history.some((s) => s.profileId === profileId)) return history;
      return [...history, { profileId, direction }];
    }
    case 'undo':
      return history.length ? history.slice(0, -1) : history;
    // Server round-trip results (H2.7).
    case 'saved':
      return history.map((s) =>
        s.profileId === action.profileId
          ? { ...s, swipeId: action.swipeId }
          : s
      );
    case 'rollback':
      return history.filter((s) => s.profileId !== action.profileId);
    case 'restore':
      return [...history, action.entry];
    default:
      return history;
  }
}

// Undo waits until every swipe has its server id, so it can be deleted.
export const canUndo = (history) =>
  history.length > 0 && history.every((s) => s.swipeId);

export function remainingDeck(profiles, history) {
  const swiped = new Set(history.map((s) => s.profileId));
  return profiles.filter((p) => !swiped.has(p._id));
}

// Asymmetric: one Like outweighs two rejections.
export const scoreOf = (history) =>
  history.reduce((sum, s) => sum + DIRECTIONS[s.direction].points, 0);
