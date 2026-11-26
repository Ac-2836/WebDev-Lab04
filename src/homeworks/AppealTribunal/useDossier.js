import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL ?? '';

// status: 'LOADING' | 'SUCCESS' | 'NOT_FOUND' | 'ERROR'
export function useDossier(playerId) {
  const [state, setState] = useState({ status: 'LOADING' });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    setState({ status: 'LOADING' });

    const load = async () => {
      try {
        const sentAt = Date.now();
        const res = await fetch(
          `${API_URL}/api/dossiers/${encodeURIComponent(playerId)}`,
          { signal }
        );
        if (res.status === 404) {
          if (!signal.aborted) setState({ status: 'NOT_FOUND' });
          return;
        }
        if (!res.ok) throw new Error(`Request failed with ${res.status}`);
        const { serverNow, ...dossier } = await res.json();
        // Server clock minus the local clock at the middle of the round trip.
        const serverOffsetMs = serverNow - (sentAt + Date.now()) / 2;
        if (!signal.aborted) {
          setState({ status: 'SUCCESS', dossier, serverOffsetMs });
        }
      } catch (err) {
        if (!signal.aborted) setState({ status: 'ERROR', error: err.message });
      }
    };
    load();

    return () => controller.abort();
  }, [playerId]);

  return state;
}
