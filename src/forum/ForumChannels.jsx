import { NavLink, Outlet } from 'react-router';
import styles from './Forum.module.css';

export const FORUMS = [
  { id: 'nasa', label: 'nasa' },
  { id: 'esports-tribunal', label: 'esports-tribunal' },
  { id: 'notNasa', label: 'notNasa' },
];

export function ForumChannels() {
  return (
    <section className={styles.frame} aria-labelledby='forum-heading'>
      <h2 id='forum-heading' className={styles.heading}>
        Forum Channels
      </h2>
      <nav className={styles.channels} aria-label='Channels'>
        <ul className={styles.channelList}>
          {FORUMS.map((forum) => (
            <li key={forum.id}>
              <NavLink
                to={`/forums/${forum.id}`}
                className={({ isActive }) =>
                  isActive ? styles.activeChannel : styles.channel
                }
              >
                #{forum.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <Outlet />
    </section>
  );
}

export function ForumIndex() {
  return <p>Pick a channel to read its messages.</p>;
}
