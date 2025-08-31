// Minimal, robust base URL handling for Vite builds.
// Uses VITE_API_URL when defined, falls back to localhost for dev.
const rawBase =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) || '';

const API_BASE = rawBase || 'http://localhost:8787';

// Join paths safely (handles trailing/leading slashes & subpaths).
function apiUrl(path: string) {
  return new URL(path, API_BASE).toString();
}

export async function renderFloorplan(opts: { image: File; viewpoint: string; style?: string }) {
  const fd = new FormData();
  fd.append('floorplan', opts.image);
  fd.append('viewpoint', opts.viewpoint);
  if (opts.style) fd.append('style', opts.style);

  const res = await fetch(apiUrl('/api/render'), { method: 'POST', body: fd });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  const blob = await res.blob();
  return URL.createObjectURL(blob);
}