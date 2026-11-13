import { Fragment } from 'react';
import { useParams } from 'react-router';
import styles from './PersonDetail.module.css';

const FIELDS = [
  ['name', 'Name'],
  ['role', 'Role'],
  ['born', 'Born'],
  ['knownFor', 'Known for'],
];

export function PersonDetail({ people }) {
  const { id } = useParams();
  const person = people.find((p) => p.id === id);

  if (!person) {
    return (
      <article className={styles.panel} role='alert'>
        <h3 className={styles.title}>404: Person Not Found</h3>
        <p>No dossier matches the id "{id}".</p>
      </article>
    );
  }

  return (
    <article className={styles.panel} aria-labelledby='person-title'>
      <h3 id='person-title' className={styles.title}>
        {person.name}
      </h3>
      <dl className={styles.details}>
        {FIELDS.map(([key, label]) => (
          <Fragment key={key}>
            <dt>{label}</dt>
            <dd>{person[key]}</dd>
          </Fragment>
        ))}
      </dl>
    </article>
  );
}
