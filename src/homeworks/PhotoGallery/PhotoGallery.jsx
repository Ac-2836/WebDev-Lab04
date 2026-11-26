import { Link, useSearchParams } from 'react-router';
import { readGallery, withCategory } from './gallery-params.js';
import { CATEGORIES, PHOTOS } from './photos.js';
import styles from './PhotoGallery.module.css';

// Thumbnails above the fold load eagerly; the rest wait for scroll.
const EAGER_COUNT = 4;
const FILTERS = [{ id: 'all', label: 'All' }, ...CATEGORIES];

export function PhotoGallery() {
  const [searchParams] = useSearchParams();
  const { category, photos } = readGallery(searchParams, PHOTOS);

  return (
    <section className={styles.gallery} aria-labelledby='gallery-heading'>
      <h2 id='gallery-heading'>Photo &amp; Evidence Gallery</h2>
      <nav aria-label='Photo categories'>
        <ul className={styles.filters}>
          {FILTERS.map((f) => (
            <li key={f.id}>
              <Link
                to={{ search: withCategory(searchParams, f.id).toString() }}
                className={styles.filter}
                aria-current={f.id === category ? 'true' : undefined}
              >
                {f.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <output className={styles.count} aria-live='polite'>
        {photos.length} of {PHOTOS.length} photos
      </output>
      <ul className={styles.grid}>
        {photos.map((p, i) => (
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
