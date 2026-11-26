import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { Home, RootLayout } from './layouts/RootLayout.jsx';
import { PeopleIndex, PeopleLayout } from './people/PeopleLayout.jsx';
import { PersonSkeleton } from './people/PersonSkeleton.jsx';
import { PEOPLE } from './people/people-data.js';
import { SimpleForm } from './form/SimpleForm.jsx';
import { ForumChannels, ForumIndex } from './forum/ForumChannels.jsx';
import { ForumMessages } from './forum/ForumMessages.jsx';
import { PhotoGallery } from './homeworks/PhotoGallery/PhotoGallery.jsx';
import { SwipeDeck } from './homeworks/SwipeDeck/SwipeDeck.jsx';
import {
  DossierIndex,
  DossierLayout,
} from './homeworks/AppealTribunal/DossierLayout.jsx';
import { DossierView } from './homeworks/AppealTribunal/DossierView.jsx';

// Route-level code split; lazy() needs a default export, so map the named one.
const PersonDetail = lazy(() =>
  import('./people/PersonDetail.jsx').then((m) => ({ default: m.PersonDetail }))
);

export function App() {
  return (
    <Routes>
      <Route path='/' element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path='people' element={<PeopleLayout people={PEOPLE} />}>
          <Route index element={<PeopleIndex />} />
          <Route
            path=':id'
            element={
              <Suspense fallback={<PersonSkeleton />}>
                <PersonDetail people={PEOPLE} />
              </Suspense>
            }
          />
        </Route>
        <Route path='form' element={<SimpleForm />} />
        <Route path='forums' element={<ForumChannels />}>
          <Route index element={<ForumIndex />} />
          <Route path=':forumId' element={<ForumMessages />} />
        </Route>
        <Route path='gallery' element={<PhotoGallery />} />
        <Route path='swipe' element={<SwipeDeck />} />
        <Route path='dossier' element={<DossierLayout />}>
          <Route index element={<DossierIndex />} />
          <Route path=':playerId' element={<DossierView />} />
        </Route>
      </Route>
    </Routes>
  );
}
