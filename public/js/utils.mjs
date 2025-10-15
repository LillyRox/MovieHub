// js/utils.mjs
export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

/**
 * posterUrl 
 * @param {string|null} path
 */
export function posterUrl(path) {
  if (!path) return '/assets/no-poster.png';
  return `${TMDB_IMAGE_BASE}${path}`;
}

/** safeJson */
export async function safeJson(response) {
  if (!response.ok) {
    const text = await response.text().catch(()=>response.statusText);
    throw new Error(`${response.status} - ${text}`);
  }
  return response.json();
}

/** getParam  */
export function getParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

/** formatDate  */
export function formatDate(iso) {
  if(!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString();
  } catch(e){ return iso; }
}
