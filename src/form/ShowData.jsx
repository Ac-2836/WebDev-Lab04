import { Fragment } from 'react';
import styles from './ShowData.module.css';

// Semantic key-value inspector instead of a JSON.stringify dump.
export function ShowData({ data }) {
  return (
    <section
      className={styles.inspector}
      aria-labelledby='show-data-heading'
      aria-live='polite'
    >
      <h3 id='show-data-heading' className={styles.heading}>
        Submitted data
      </h3>
      <dl className={styles.list}>
        {Object.entries(data).map(([key, value]) => (
          <Fragment key={key}>
            <dt>{key}</dt>
            <dd>{String(value)}</dd>
          </Fragment>
        ))}
      </dl>
    </section>
  );
}
