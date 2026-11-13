import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL ?? '';

export const messagesUrl = (forumId) =>
  `${API_URL}/api/messages/${encodeURIComponent(forumId)}`;

// status: 'LOADING' | 'SUCCESS' | 'ERROR'. forumId is kept so a refetch of
// the same forum keeps showing its messages instead of flashing empty.
export function useForumMessages(forumId) {
  const [state, setState] = useState({
    forumId,
    status: 'LOADING',
    data: [],
    error: null,
  });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    setState((prev) => ({
      forumId,
      status: 'LOADING',
      data: prev.forumId === forumId ? prev.data : [],
      error: null,
    }));

    const fetchMessages = async () => {
      try {
        const res = await fetch(messagesUrl(forumId), { signal });
        if (!res.ok) throw new Error(`Request failed with ${res.status}`);
        const result = await res.json();
        if (!signal.aborted) {
          setState({ forumId, status: 'SUCCESS', data: result, error: null });
        }
      } catch (err) {
        // An aborted request is expected on fast switching: not an error.
        if (!signal.aborted) {
          setState({ forumId, status: 'ERROR', data: [], error: err.message });
        }
      }
    };
    fetchMessages();

    return () => controller.abort();
  }, [forumId, reloadKey]);

  const postMessage = async (payload) => {
    const res = await fetch(messagesUrl(forumId), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = await res.json();
    if (!res.ok) {
      throw new Error(body.error ?? `Request failed with ${res.status}`);
    }
    setReloadKey((k) => k + 1);
    return body;
  };

  return {
    data: state.data,
    status: state.status,
    loading: state.status === 'LOADING',
    error: state.error,
    postMessage,
  };
}
