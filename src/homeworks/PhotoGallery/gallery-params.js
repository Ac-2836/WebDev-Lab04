import { CATEGORIES } from './photos.js';

const KNOWN = new Set(CATEGORIES.map((c) => c.id));

// Everything the gallery shows is derived from the query string.
export function readGallery(searchParams, photos) {
  const raw = searchParams.get('category');
  const category = KNOWN.has(raw) ? raw : 'all';
  const photoId = searchParams.get('photoId');
  return {
    category,
    photos:
      category === 'all'
        ? photos
        : photos.filter((p) => p.category === category),
    selected: photos.find((p) => p.id === photoId) ?? null,
  };
}

const edit = (searchParams, change) => {
  const next = new URLSearchParams(searchParams);
  change(next);
  return next;
};

export const withCategory = (searchParams, category) =>
  edit(searchParams, (next) => {
    if (category === 'all') next.delete('category');
    else next.set('category', category);
  });

export const withPhoto = (searchParams, photoId) =>
  edit(searchParams, (next) => next.set('photoId', photoId));

export const withoutPhoto = (searchParams) =>
  edit(searchParams, (next) => next.delete('photoId'));
