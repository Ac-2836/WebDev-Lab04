import { Link, useSearchParams } from 'react-router';
import {
  readGallery,
  withCategory,
  withoutPhoto,
  withPhoto,
} from './gallery-params.js';
import { Lightbox } from './Lightbox.jsx';
import { CATEGORIES, PHOTOS } from './photos.js';
import styles from './PhotoGallery.module.css';

// main is capped at 1440px, so the grid never shows more than 6 thumbnails
// in its first row: those load eagerly, the rest wait for scroll.
const EAGER_COUNT = 6;
const FILTERS = [{ id: 'all', label: 'All' }, ...CATEGORIES];

export function PhotoGallery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { category, photos, selected } = readGallery(searchParams, PHOTOS);

  // Fires for Esc, the close button and URL-driven close(); only the first
  // two still have photoId in the URL.
  const handleClose = () => {
    if (selected) setSearchParams(withoutPhoto(searchParams));
  };

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
            <button
              type='button'
              className={styles.thumb}
              onClick={() => setSearchParams(withPhoto(searchParams, p.id))}
            >
              <img
                src={p.thumb}
                alt={p.alt}
                width={480}
                height={300}
                loading={i < EAGER_COUNT ? 'eager' : 'lazy'}
                fetchPriority={i === 0 ? 'high' : undefined}
                decoding='async'
              />
              <span className={styles.caption}>{p.title}</span>
            </button>
          </li>
        ))}
      </ul>
      <Lightbox photo={selected} onClose={handleClose} />
    </section>
  );
}
