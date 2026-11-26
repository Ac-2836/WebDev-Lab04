const API_URL = import.meta.env.VITE_API_URL ?? '';

export async function fetchProfiles(signal) {
  const res = await fetch(`${API_URL}/api/profiles`, { signal });
  if (!res.ok) throw new Error(`Request failed with ${res.status}`);
  return res.json();
}

export async function saveSwipe({ profileId, direction }) {
  const res = await fetch(`${API_URL}/api/swipe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profileId, direction }),
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.error ?? `Request failed with ${res.status}`);
  }
  return body;
}

export async function deleteSwipe(swipeId) {
  const res = await fetch(`${API_URL}/api/swipe/${swipeId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`Undo failed with ${res.status}`);
}
