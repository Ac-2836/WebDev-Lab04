import styles from './PersonDetail.module.css';

// Same .panel box as PersonDetail, so swapping them causes no layout shift.
export function PersonSkeleton() {
  return (
    <section
      className={`${styles.panel} ${styles.skeleton}`}
      aria-busy='true'
      aria-live='polite'
      aria-label='Loading person details'
    >
      <p className={styles.srOnly}>Loading person details...</p>
    </section>
  );
}
