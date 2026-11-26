import { useAppealSlaTimer } from './useAppealSlaTimer.js';
import styles from './AppealTribunal.module.css';

const pad = (n) => String(n).padStart(2, '0');

export function formatRemaining(ms) {
  const total = Math.ceil(ms / 1000);
  const days = Math.floor(total / 86400);
  const clock = [
    Math.floor((total % 86400) / 3600),
    Math.floor((total % 3600) / 60),
    total % 60,
  ]
    .map(pad)
    .join(':');
  return days > 0 ? `${days}d ${clock}` : clock;
}

export function AppealSection({ dossier, serverOffsetMs }) {
  const { remainingMs, isExpired } = useAppealSlaTimer(
    Date.parse(dossier.appealDeadline),
    serverOffsetMs
  );

  return (
    <section className={styles.appeal} aria-labelledby='appeal-heading'>
      <h3 id='appeal-heading'>Appeal</h3>
      {isExpired ? (
        <p className={styles.closed} role='status'>
          The appeal window for {dossier.playerName} has closed.
        </p>
      ) : (
        <p className={styles.sla}>
          Appeal window closes in{' '}
          <time role='timer' dateTime={`PT${Math.ceil(remainingMs / 1000)}S`}>
            {formatRemaining(remainingMs)}
          </time>
        </p>
      )}
    </section>
  );
}
