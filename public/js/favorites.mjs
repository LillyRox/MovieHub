// js/favorites.mjs
const KEY = 'moviehub:favorites:v1';

/**
 * favorite item: { id: string, type: 'movie'|'tv', title: string, poster_path: string, addedAt: iso }
 */

export function getFavorites() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('getFavorites error', e);
    return [];
  }
}

export function saveFavorites(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch(e) {
    console.error('saveFavorites error', e);
  }
}

export function isFavorite(type, id) {
  const list = getFavorites();
  return list.some(i => i.type === type && String(i.id) === String(id));
}

export function addFavorite(item) {
  const list = getFavorites();
  if (!isFavorite(item.type, item.id)) {
    const normalized = { ...item, id: String(item.id), addedAt: new Date().toISOString() };
    list.unshift(normalized);
    saveFavorites(list);
  }
  return getFavorites();
}

export function removeFavorite(type, id) {
  let list = getFavorites();
  list = list.filter(i => !(i.type === type && String(i.id) === String(id)));
  saveFavorites(list);
  return getFavorites();
}

export function toggleFavorite(item) {
  if (isFavorite(item.type, item.id)) {
    return removeFavorite(item.type, item.id);
  } else {
    return addFavorite(item);
  }
}
