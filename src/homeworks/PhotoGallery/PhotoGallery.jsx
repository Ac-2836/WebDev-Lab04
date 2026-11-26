import { PHOTOS } from './photos.js';
import styles from './PhotoGallery.module.css';

// Thumbnails above the fold load eagerly; the rest wait for scroll.
const EAGER_COUNT = 4;

export function PhotoGallery() {
  return (
    <section className={styles.gallery} aria-labelledby='gallery-heading'>
      <h2 id='gallery-heading'>Photo &amp; Evidence Gallery</h2>
      <ul className={styles.grid}>
        {PHOTOS.map((p, i) => (
          <li key={p.id}>
            <button type='button' className={styles.thumb}>
              <img
                src={p.thumb}
                alt={p.alt}
                width={480}
                height={300}
                loading={i < EAGER_COUNT ? 'eager' : 'lazy'}
              />
              <span className={styles.caption}>{p.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
