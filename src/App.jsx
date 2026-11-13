import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { Home, RootLayout } from './layouts/RootLayout.jsx';
import { PeopleIndex, PeopleLayout } from './people/PeopleLayout.jsx';
import { PersonSkeleton } from './people/PersonSkeleton.jsx';
import { PEOPLE } from './people/people-data.js';
import { SimpleForm } from './form/SimpleForm.jsx';

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
      </Route>
    </Routes>
  );
}
