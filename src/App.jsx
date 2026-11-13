import { Route, Routes } from 'react-router';
import { Home, RootLayout } from './layouts/RootLayout.jsx';
import { PeopleIndex, PeopleLayout } from './people/PeopleLayout.jsx';
import { PEOPLE } from './people/people-data.js';

export function App() {
  return (
    <Routes>
      <Route path='/' element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path='people' element={<PeopleLayout people={PEOPLE} />}>
          <Route index element={<PeopleIndex />} />
        </Route>
      </Route>
    </Routes>
  );
}
