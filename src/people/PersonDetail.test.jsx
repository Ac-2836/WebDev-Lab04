import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { PersonDetail } from './PersonDetail.jsx';
import { PEOPLE } from './people-data.js';

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path='/people/:id' element={<PersonDetail people={PEOPLE} />} />
      </Routes>
    </MemoryRouter>
  );
}

afterEach(cleanup);

describe('PersonDetail', () => {
  it('renders the person found by the :id URL param as a <dl>', () => {
    const { container } = renderAt('/people/grace-hopper');
    const list = container.querySelector('dl');

    expect(list).not.toBeNull();
    const terms = within(list).getAllByRole('term');
    const defs = within(list).getAllByRole('definition');
    expect(terms.map((t) => t.textContent)).toContain('Name');
    expect(terms.map((t) => t.textContent)).toContain('Role');
    expect(defs.map((d) => d.textContent)).toContain('Grace Hopper');
    expect(defs.map((d) => d.textContent)).toContain('Computer Scientist');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('renders a role="alert" 404 state for an unknown id', () => {
    const { container } = renderAt('/people/not-a-real-id');

    expect(screen.getByRole('alert').textContent).toMatch(/404/);
    expect(container.querySelector('dl')).toBeNull();
  });
});
