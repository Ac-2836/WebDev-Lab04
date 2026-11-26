import { useEffect, useReducer, useState } from 'react';
import {
  DIRECTIONS,
  historyReducer,
  remainingDeck,
  scoreOf,
} from './deck-state.js';
import { fetchProfiles } from './swipe-api.js';
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

  const swipe = (direction) => {
    if (top) dispatch({ type: 'swipe', profileId: top._id, direction });
  };
  const undo = () => dispatch({ type: 'undo' });

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
          {top ? (
            <article className={styles.card} aria-labelledby='card-name'>
              <h3 id='card-name'>
                {top.name}, {top.age}
              </h3>
              <p>{top.bio}</p>
            </article>
          ) : (
            <p className={styles.empty}>No more profiles. Undo to go back.</p>
          )}
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
              disabled={history.length === 0}
              onClick={undo}
            >
              Undo
            </button>
          </p>
          <p className={styles.last} aria-live='polite'>
            {last && `${DIRECTIONS[last.direction].label}: ${lastName}`}
          </p>
        </>
      )}
    </section>
  );
}
