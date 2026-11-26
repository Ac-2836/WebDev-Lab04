import { useEffect, useReducer, useState } from 'react';
import {
  canUndo,
  DIRECTIONS,
  historyReducer,
  remainingDeck,
  scoreOf,
} from './deck-state.js';
import { deleteSwipe, fetchProfiles, saveSwipe } from './swipe-api.js';
import { useSwipeGestures } from './useSwipeGestures.js';
import styles from './SwipeDeck.module.css';

function useProfiles() {
  const [state, setState] = useState({ status: 'LOADING', profiles: [] });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    fetchProfiles(signal)
      .then((profiles) => {
        if (!signal.aborted) setState({ status: 'SUCCESS', profiles });
      })
      .catch((err) => {
        if (!signal.aborted) {
          setState({ status: 'ERROR', profiles: [], error: err.message });
        }
      });
    return () => controller.abort();
  }, []);

  return state;
}

export function SwipeDeck() {
  const { status, profiles, error } = useProfiles();
  const [history, dispatch] = useReducer(historyReducer, []);
  // Derived every render from the profiles and the LIFO stack.
  const deck = remainingDeck(profiles, history);
  const top = deck[0];
  const score = scoreOf(history);
  const last = history.at(-1);
  const lastName = profiles.find((p) => p._id === last?.profileId)?.name;

  const [saveError, setSaveError] = useState(null);

  // Optimistic: the card leaves at once; a failed save puts it back.
  const swipe = (direction) => {
    if (!top) return;
    const profileId = top._id;
    setSaveError(null);
    dispatch({ type: 'swipe', profileId, direction });
    saveSwipe({ profileId, direction })
      .then((saved) =>
        dispatch({ type: 'saved', profileId, swipeId: saved._id })
      )
      .catch((err) => {
        dispatch({ type: 'rollback', profileId });
        setSaveError(`Swipe on ${top.name} was not saved: ${err.message}`);
      });
  };

  const undo = () => {
    if (!canUndo(history)) return;
    const entry = history.at(-1);
    setSaveError(null);
    dispatch({ type: 'undo' });
    deleteSwipe(entry.swipeId).catch((err) => {
      dispatch({ type: 'restore', entry });
      setSaveError(`Undo was not saved: ${err.message}`);
    });
  };
  const { drag, handlers } = useSwipeGestures({ onSwipe: swipe, onUndo: undo });

  return (
    <section className={styles.swipe} aria-labelledby='swipe-heading'>
      <h2 id='swipe-heading'>Hẹn Hò Nhưng Không Yêu</h2>
      <dl className={styles.stats}>
        <dt>Score</dt>
        <dd>
          <output aria-live='polite'>{score}</output>
        </dd>
        <dt>Cards left</dt>
        <dd>{deck.length}</dd>
      </dl>
      {status === 'LOADING' && <p aria-busy='true'>Loading profiles...</p>}
      {status === 'ERROR' && (
        <p role='alert'>Could not load profiles: {error}</p>
      )}
      {status === 'SUCCESS' && (
        <>
          <article
            className={styles.card}
            aria-labelledby='card-name'
            aria-describedby='card-help'
            aria-keyshortcuts='ArrowLeft ArrowUp ArrowRight Backspace'
            tabIndex={0}
            style={{
              transform: `translate(${drag.dx}px, ${drag.dy}px) rotate(${
                drag.dx / 20
              }deg)`,
            }}
            {...handlers}
          >
            {top ? (
              <>
                <h3 id='card-name'>
                  {top.name}, {top.age}
                </h3>
                <p>{top.bio}</p>
              </>
            ) : (
              <h3 id='card-name'>No more profiles. Undo to go back.</h3>
            )}
          </article>
          <p id='card-help' className={styles.help}>
            Drag the card or use Arrow Left (Nope), Arrow Up (Hẹn hò nhưng
            không yêu), Arrow Right (Like) and Backspace (Undo).
          </p>
          <p className={styles.actions}>
            {Object.entries(DIRECTIONS).map(([direction, meta]) => (
              <button
                key={direction}
                type='button'
                className={styles[direction]}
                disabled={!top}
                onClick={() => swipe(direction)}
              >
                {meta.label}
              </button>
            ))}
            <button
              type='button'
              className={styles.undo}
              disabled={!canUndo(history)}
              onClick={undo}
            >
              Undo
            </button>
          </p>
          {saveError && (
            <p className={styles.error} role='alert'>
              {saveError}
            </p>
          )}
          <p className={styles.last} aria-live='polite'>
            {last && `${DIRECTIONS[last.direction].label}: ${lastName}`}
          </p>
        </>
      )}
    </section>
  );
}
