// Evidence screenshots from the Lab 04 In-class sprints, resized to WebP.
// Full images are 1280x800, thumbnails 480x300.
export const CATEGORIES = [
  { id: 'routing', label: 'Routing' },
  { id: 'forms', label: 'Forms' },
  { id: 'full-stack', label: 'Full-stack' },
];

const photo = (slug, category, title, alt) => ({
  id: slug,
  category,
  title,
  alt,
  src: `/gallery/${slug}.webp`,
  thumb: `/gallery/${slug}-thumb.webp`,
  width: 1280,
  height: 800,
});

export const PHOTOS = [
  photo(
    'router-people-layout',
    'routing',
    'People directory layout',
    'People directory with a sidebar of five names and an empty detail panel'
  ),
  photo(
    'router-person-detail',
    'routing',
    'Person detail route',
    'Katherine Johnson highlighted in the sidebar with her details listed'
  ),
  photo(
    'router-suspense-skeleton',
    'routing',
    'Suspense skeleton',
    'Grey loading skeleton shown while the detail chunk downloads'
  ),
  photo(
    'router-person-404',
    'routing',
    'Unknown person id',
    'Detail panel showing 404: Person Not Found for an invalid id'
  ),
  photo(
    'form-live-status',
    'forms',
    'Live form status',
    'Profile form filled in with the status line All fields are valid'
  ),
  photo(
    'form-field-errors',
    'forms',
    'Field errors after submit',
    'Empty profile form with three red error messages under the fields'
  ),
  photo(
    'form-show-data',
    'forms',
    'Submitted data inspector',
    'Valid profile form with the submitted values listed below it'
  ),
  photo(
    'forum-slow3g-loading',
    'full-stack',
    'Loading on Slow 3G',
    'Forum channel esports-tribunal showing Loading messages'
  ),
  photo(
    'forum-channel',
    'full-stack',
    'Forum channel',
    'Channel esports-tribunal listing three messages above the post form'
  ),
  photo(
    'forum-unknown-404',
    'full-stack',
    'Unknown forum',
    'Channel mars showing the error Request failed with 404'
  ),
  photo(
    'forum-api-down',
    'full-stack',
    'API unreachable',
    'Channel nasa showing the error Failed to fetch'
  ),
];
