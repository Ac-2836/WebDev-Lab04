import { NavLink, Outlet } from 'react-router';
import styles from './AppealTribunal.module.css';

export const PLAYERS = [
  { id: 'himass', name: 'Himass' },
  { id: 'tanvuu', name: 'TanVuu' },
];

export function DossierLayout() {
  return (
    <section className={styles.tribunal} aria-labelledby='tribunal-heading'>
      <h2 id='tribunal-heading'>Esports Fair-Play Appeal Tribunal</h2>
      <p className={styles.note}>
        Fictional training case for Lab 04, not a real ruling.
      </p>
      <nav aria-label='Player dossiers'>
        <ul className={styles.players}>
          {PLAYERS.map((p) => (
            <li key={p.id}>
              <NavLink
                to={`/dossier/${p.id}`}
                className={({ isActive }) =>
                  isActive ? styles.activePlayer : styles.player
                }
              >
                {p.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <Outlet />
    </section>
  );
}

export function DossierIndex() {
  return <p>Pick a player to open their case dossier.</p>;
}
