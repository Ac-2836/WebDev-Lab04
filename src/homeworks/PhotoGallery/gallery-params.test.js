import { describe, expect, it } from 'vitest';
import {
  readGallery,
  withCategory,
  withoutPhoto,
  withPhoto,
} from './gallery-params.js';
import { PHOTOS } from './photos.js';

// Contract: the URL query is the only gallery state.
//   readGallery(searchParams, photos) -> { category, photos, selected }
//   withCategory / withPhoto / withoutPhoto(searchParams, ...) -> a new
//   URLSearchParams; the input is never mutated.
const params = (query) => new URLSearchParams(query);
const ids = (list) => list.map((p) => p.id);

describe('readGallery', () => {
  it('shows every photo and no selection for an empty query', () => {
    const view = readGallery(params(''), PHOTOS);
    expect(view.category).toBe('all');
    expect(ids(view.photos)).toEqual(ids(PHOTOS));
    expect(view.selected).toBeNull();
  });

  it('filters by a known ?category=', () => {
    const view = readGallery(params('category=forms'), PHOTOS);
    expect(view.category).toBe('forms');
    expect(view.photos.length).toBeGreaterThan(0);
    expect(view.photos.every((p) => p.category === 'forms')).toBe(true);
  });

  it('falls back to all photos for an unknown category', () => {
    const view = readGallery(params('category=mars'), PHOTOS);
    expect(view.category).toBe('all');
    expect(ids(view.photos)).toEqual(ids(PHOTOS));
  });

  it('selects the photo named by ?photoId=, or none if unknown', () => {
    const [first] = PHOTOS;
    expect(readGallery(params(`photoId=${first.id}`), PHOTOS).selected).toBe(
      first
    );
    expect(readGallery(params('photoId=nope'), PHOTOS).selected).toBeNull();
  });
});

describe('search param updates', () => {
  it('withPhoto keeps the category filter', () => {
    const next = withPhoto(params('category=forms'), 'form-show-data');
    expect(next.get('category')).toBe('forms');
    expect(next.get('photoId')).toBe('form-show-data');
  });

  it('withoutPhoto removes only photoId', () => {
    const next = withoutPhoto(params('category=forms&photoId=form-show-data'));
    expect(next.get('category')).toBe('forms');
    expect(next.has('photoId')).toBe(false);
  });

  it('withCategory sets the filter, and "all" removes it', () => {
    expect(withCategory(params(''), 'routing').get('category')).toBe(
      'routing'
    );
    expect(withCategory(params('category=routing'), 'all').has('category'))
      .toBe(false);
  });

  it('never mutates the given search params', () => {
    const original = params('category=forms&photoId=form-show-data');
    withPhoto(original, 'forum-channel');
    withoutPhoto(original);
    withCategory(original, 'routing');
    expect(original.toString()).toBe('category=forms&photoId=form-show-data');
  });
});
