import { useEffect, useRef } from 'react';
import { CATEGORIES } from './photos.js';
import styles from './Lightbox.module.css';

const categoryLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label;

// Slide contract: the URL decides whether the dialog is open; the native
// modal dialog provides the focus trap, Esc and the inert background.
export function Lightbox({ photo, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (photo) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [photo]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby='lightbox-title'
      onClose={onClose}
    >
      {photo && (
        <figure className={styles.figure}>
          <img
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
          />
          <figcaption className={styles.caption}>
            <h3 id='lightbox-title'>{photo.title}</h3>
            <p>{categoryLabel(photo.category)}</p>
          </figcaption>
        </figure>
      )}
      <button
        type='button'
        className={styles.close}
        aria-label='Close photo'
        onClick={() => dialogRef.current.close()}
      >
        ×
      </button>
    </dialog>
  );
}
