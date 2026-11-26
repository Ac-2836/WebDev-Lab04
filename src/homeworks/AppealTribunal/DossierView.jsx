import { useParams } from 'react-router';
import { DisproportionalityMatrix } from './DisproportionalityMatrix.jsx';
import { useDossier } from './useDossier.js';
import styles from './AppealTribunal.module.css';

const formatDate = (iso) =>
  new Date(iso).toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

export function DossierView() {
  const { playerId } = useParams();
  const state = useDossier(playerId);

  if (state.status === 'LOADING') {
    return (
      <article className={styles.dossier} aria-busy='true'>
        <p>Loading dossier...</p>
      </article>
    );
  }
  if (state.status === 'NOT_FOUND') {
    return (
      <article className={styles.dossier} role='alert'>
        <h3>404: Dossier Not Found</h3>
        <p>No case file matches the player id "{playerId}".</p>
      </article>
    );
  }
  if (state.status === 'ERROR') {
    return (
      <article className={styles.dossier} role='alert'>
        <h3>Could not load the dossier</h3>
        <p>{state.error}</p>
      </article>
    );
  }

  const { dossier } = state;
  return (
    <article className={styles.dossier} aria-labelledby='dossier-heading'>
      <h3 id='dossier-heading'>Case file: {dossier.playerName}</h3>
      <dl className={styles.facts}>
        <dt>Team</dt>
        <dd>{dossier.team}</dd>
        <dt>Role</dt>
        <dd>{dossier.role}</dd>
        <dt>Summary</dt>
        <dd>{dossier.summary}</dd>
        <dt>Appeal deadline</dt>
        <dd>
          <time dateTime={dossier.appealDeadline}>
            {formatDate(dossier.appealDeadline)}
          </time>
        </dd>
      </dl>
      <DisproportionalityMatrix dossier={dossier} />
    </article>
  );
}
