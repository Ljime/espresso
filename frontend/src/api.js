// In development, Vite proxies /api → localhost:3001
// In production, set VITE_API_URL to your Railway backend URL (no trailing slash)
const BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}api`
  : 'api';

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
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
  base: BASE,
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
  // Custom colours
  listColours: () => request('GET', '/colours'),
  addColour: (list, colour) => request('POST', '/colours', { list, ...colour }),
  deleteColour: (list, hex) => request('DELETE', `/colours/${list}/${encodeURIComponent(hex)}`),
};
