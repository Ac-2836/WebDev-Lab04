import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useForumMessages } from './useForumMessages.js';

// Controllable fetch: every call stays pending until the test resolves it.
// rejectOnAbort mimics the browser; false mimics a response that was
// already on its way when the request was aborted.
function createFetchMock({ rejectOnAbort = true } = {}) {
  const calls = [];
  const fn = vi.fn(
    (url, init = {}) =>
      new Promise((resolve, reject) => {
        calls.push({
          url,
          init,
          respond: (body, status = 200) =>
            resolve({ ok: status < 400, status, json: async () => body }),
        });
        if (rejectOnAbort) {
          init.signal?.addEventListener('abort', () =>
            reject(new DOMException('Aborted', 'AbortError'))
          );
        }
      })
  );
  return { fn, calls };
}

const A = [{ id: 'a1', author: 'Ada', text: 'nasa msg', timestamp: 't' }];
const B = [{ id: 'b1', author: 'Bob', text: 'notNasa msg', timestamp: 't' }];

let consoleError;
beforeEach(() => {
  consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllGlobals();
  consoleError.mockRestore();
});

const renderForum = (forumId) =>
  renderHook(({ id }) => useForumMessages(id), {
    initialProps: { id: forumId },
  });

describe('useForumMessages', () => {
  it('loads the messages of the forum', async () => {
    const mock = createFetchMock();
    vi.stubGlobal('fetch', mock.fn);
    const { result } = renderForum('nasa');

    expect(result.current.loading).toBe(true);
    expect(mock.calls[0].url).toMatch(/\/api\/messages\/nasa$/);
    expect(mock.calls[0].init.signal).toBeInstanceOf(AbortSignal);

    await act(async () => mock.calls[0].respond(A));
    expect(result.current).toMatchObject({
      loading: false,
      status: 'SUCCESS',
      data: A,
      error: null,
    });
  });

  it('aborts the stale request on forum change without logging', async () => {
    const mock = createFetchMock();
    vi.stubGlobal('fetch', mock.fn);
    const { result, rerender } = renderForum('nasa');

    rerender({ id: 'notNasa' });
    expect(mock.calls[0].init.signal.aborted).toBe(true);
    expect(mock.calls[1].url).toMatch(/\/notNasa$/);

    await act(async () => mock.calls[1].respond(B));
    expect(result.current.data).toEqual(B);
    expect(result.current.error).toBeNull();
    expect(consoleError).not.toHaveBeenCalled();
  });

  it('ignores a late response of an aborted request', async () => {
    const mock = createFetchMock({ rejectOnAbort: false });
    vi.stubGlobal('fetch', mock.fn);
    const { result, rerender } = renderForum('nasa');

    rerender({ id: 'notNasa' });
    await act(async () => mock.calls[1].respond(B));
    await act(async () => mock.calls[0].respond(A));

    expect(result.current.data).toEqual(B);
  });

  it('aborts the in-flight request on unmount', () => {
    const mock = createFetchMock();
    vi.stubGlobal('fetch', mock.fn);
    const { unmount } = renderForum('nasa');

    unmount();
    expect(mock.calls[0].init.signal.aborted).toBe(true);
  });

  it('moves to ERROR when the server fails', async () => {
    const mock = createFetchMock();
    vi.stubGlobal('fetch', mock.fn);
    const { result } = renderForum('mars');

    await act(async () => mock.calls[0].respond({ error: 'x' }, 404));
    expect(result.current).toMatchObject({
      status: 'ERROR',
      loading: false,
      data: [],
    });
    expect(result.current.error).toMatch(/404/);
  });

  it('postMessage POSTs the payload and refetches the forum', async () => {
    const mock = createFetchMock();
    vi.stubGlobal('fetch', mock.fn);
    const { result } = renderForum('nasa');
    await act(async () => mock.calls[0].respond(A));

    const created = { id: 'a2', author: 'Kat', text: 'Go', timestamp: 't' };
    let posted;
    await act(async () => {
      const pending = result.current.postMessage({ author: 'Kat', text: 'Go' });
      mock.calls[1].respond(created, 201);
      posted = await pending;
    });

    expect(mock.calls[1].init).toMatchObject({ method: 'POST' });
    expect(JSON.parse(mock.calls[1].init.body)).toEqual({
      author: 'Kat',
      text: 'Go',
    });
    expect(posted).toEqual(created);
    // Refetch keeps the old list visible while loading.
    expect(mock.calls[2].url).toMatch(/\/nasa$/);
    expect(result.current.data).toEqual(A);

    await act(async () => mock.calls[2].respond([...A, created]));
    expect(result.current.data).toEqual([...A, created]);
  });

  it('postMessage rejects with the server error message on 400', async () => {
    const mock = createFetchMock();
    vi.stubGlobal('fetch', mock.fn);
    const { result } = renderForum('nasa');
    await act(async () => mock.calls[0].respond(A));

    await act(async () => {
      const pending = result.current.postMessage({ author: 'Kat' });
      mock.calls[1].respond({ error: 'Missing required fields' }, 400);
      await expect(pending).rejects.toThrow('Missing required fields');
    });
    await waitFor(() => expect(mock.calls).toHaveLength(2));
  });
});
