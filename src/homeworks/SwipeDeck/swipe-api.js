const API_URL = import.meta.env.VITE_API_URL ?? '';

export async function fetchProfiles(signal) {
  const res = await fetch(`${API_URL}/api/profiles`, { signal });
  if (!res.ok) throw new Error(`Request failed with ${res.status}`);
  return res.json();
}
