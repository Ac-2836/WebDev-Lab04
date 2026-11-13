import { NavLink, Outlet } from 'react-router';
import styles from './PeopleLayout.module.css';

export function PeopleLayout({ people }) {
  return (
    <section className={styles.frame} aria-labelledby='people-heading'>
      <h2 id='people-heading' className={styles.heading}>
        People Directory
      </h2>
      <nav className={styles.sidebar} aria-label='People'>
        <ul className={styles.list}>
          {people.map((p) => (
            <li key={p.id}>
              <NavLink
                to={`/people/${p.id}`}
                className={({ isActive }) =>
                  isActive ? styles.activeLink : styles.link
                }
              >
                {p.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <section className={styles.content} aria-label='Person details'>
        <Outlet />
      </section>
    </section>
  );
}

export function PeopleIndex() {
  return <p>Select a person to open their dossier.</p>;
}
