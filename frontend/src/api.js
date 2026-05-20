const BASE = import.meta.env.PROD ? import.meta.env.VITE_API_URL : '';

async function request(method, path, body) {
  const res = await fetch(`${BASE}api${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  // Profiles
  listProfiles: () => request('GET', '/profiles'),
  getProfile: (id) => request('GET', `/profiles/${id}`),
  createProfile: (data) => request('POST', '/profiles', data),
  updateProfile: (id, data) => request('PUT', `/profiles/${id}`, data),

  // Shots
  listShots: (profileId) =>
    request('GET', profileId ? `/shots?profile_id=${profileId}` : '/shots'),
  getShot: (id) => request('GET', `/shots/${id}`),
  createShot: (data) => request('POST', '/shots', data),
};
