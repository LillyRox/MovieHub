// js/main.mjs
import { getTrending, searchMovies, getGenres } from './api.mjs';
import { posterUrl } from './utils.mjs';

const trendingContainer = document.getElementById('trendingContainer');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const mediaTypeSelect = document.getElementById('mediaType');
const genreSelect = document.getElementById('genreSelect');

async function init() {
  try {
    
    const genresResp = await getGenres();
    const movieGenres = genresResp.movie || [];
    
    movieGenres.forEach(g => {
      const opt = document.createElement('option');
      opt.value = g.id;
      opt.textContent = g.name;
      genreSelect.appendChild(opt);
    });

    const trending = await getTrending();
    renderGrid(trending.results);

  } catch (err) {
    console.error('init error', err);
    trendingContainer.innerHTML = `<p>Error cargando datos: ${err.message}</p>`;
  }
}

function renderGrid(items) {
  trendingContainer.innerHTML = '';
  if(!items || items.length === 0) {
    trendingContainer.innerHTML = '<p>No results.</p>';
    return;
  }

  items.forEach(item => {
    const title = item.title || item.name || 'Untitled';
    const poster = item.poster_path ? posterUrl(item.poster_path) : '/assets/no-poster.png';
    const el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = `
      <img src="${poster}" alt="${title}" />
      <h3>${title}</h3>
      <p>⭐ ${item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}</p>
    `;
    el.addEventListener('click', () => {
      const t = item.media_type || (item.title ? 'movie' : 'tv');
      window.location.href = `details.html?type=${t}&id=${item.id}`;
    });
    trendingContainer.appendChild(el);
  });
}

searchBtn.addEventListener('click', async () => {
  const q = searchInput.value.trim();
  if (!q) return;
  try {
    const resultsResp = await searchMovies(q);
    let results = resultsResp.results || [];
    
    const mediaType = mediaTypeSelect.value;
    if (mediaType && mediaType !== 'multi') {
      results = results.filter(r => (r.media_type || (r.title ? 'movie' : 'tv')) === mediaType);
    }
    
    const genreId = genreSelect.value;
    if (genreId) {
      results = results.filter(r => (r.genre_ids || []).includes(Number(genreId)));
    }
    renderGrid(results);
  } catch(err) {
    console.error('search error', err);
    trendingContainer.innerHTML = `<p>Search failed: ${err.message}</p>`;
  }
});

document.addEventListener('DOMContentLoaded', init);
