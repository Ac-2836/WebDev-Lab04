import { NavLink, Outlet } from 'react-router';
import styles from './RootLayout.module.css';

const NAV_ITEMS = [
  { to: '/', label: 'Home', end: true },
  { to: '/people', label: 'People', end: false },
  { to: '/form', label: 'Form', end: false },
];

export function RootLayout() {
  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>Lab 04</h1>
        <nav aria-label='Main'>
          <ul className={styles.list}>
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    isActive ? styles.activeLink : styles.link
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export function Home() {
  return (
    <section aria-labelledby='home-heading'>
      <h2 id='home-heading'>In-class Sprints</h2>
      <p>Multi-route SPA built with React Router v7.</p>
    </section>
  );
}
