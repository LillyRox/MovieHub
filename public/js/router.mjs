// js/details.mjs
import { getDetails } from './api.mjs';
import { getParam, posterUrl, formatDate } from './utils.mjs';
import { isFavorite, toggleFavorite } from './favorites.mjs';

const main = document.getElementById('main');

async function fetchOMDb(title) {
  try {
    const res = await fetch(`/api/omdb/${encodeURIComponent(title)}`);
    if (!res.ok) throw new Error('OMDb fetch failed');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('OMDb error', err);
    return null;
  }
}

async function render() {
  const type = getParam('type') || 'movie';
  const id = getParam('id');
  if (!id) {
    main.innerHTML = `<p>Error: no se proporcionó ID.</p>`;
    return;
  }

  try {
    main.innerHTML = '<div id="loading">Cargando…</div>';

    const details = await getDetails(type, id);
    const title = details.title || details.name || 'Untitled';
    const poster = posterUrl(details.poster_path);
    const overview = details.overview || 'No hay sinopsis.';
    const release = details.release_date || details.first_air_date || '';
    const runtime = details.runtime || (details.episode_run_time && details.episode_run_time[0]) || '—';
    const rating = details.vote_average ? details.vote_average.toFixed(1) : 'N/A';
    const genres = (details.genres || []).map(g => g.name).join(', ');
    const cast = (details.credits && details.credits.cast) ? details.credits.cast.slice(0,6) : [];
    const videos = (details.videos && details.videos.results) ? details.videos.results : [];
    const trailer = videos.find(v => v.site === 'YouTube' && v.type === 'Trailer') || videos[0];
    const favState = isFavorite(type, id);

    
    const omdbData = await fetchOMDb(title);

    const omdbContainer = document.getElementById('omdbInfo');
    if(omdbData && omdbData.Response === "True") {
      omdbContainer.innerHTML = `
        <p><strong>IMDb Rating:</strong> ${omdbData.imdbRating || 'N/A'} • <strong>Metascore:</strong> ${omdbData.Metascore || 'N/A'}</p>
        <p><strong>Awards:</strong> ${omdbData.Awards || 'N/A'}</p>
    `;
    } else {
      omdbContainer.innerHTML = `<p>No OMDb info available</p>`;
    }


    

    main.innerHTML = `
      <section class="details">
        <div class="poster">
          <img src="${poster}" alt="${title}" />
        </div>
        <div class="info">
          <h2>${title}</h2>
          <div class="sub">${genres} • ${formatDate(release)}</div>
          <p class="muted">Runtime: ${runtime} • TMDb Rating: ${rating}</p>
          <p>${overview}</p>

          ${omdbData && omdbData.Response === "True" ? `
  <p><strong>IMDb Rating:</strong> ${omdbData.imdbRating || 'N/A'} • <strong>Metascore:</strong> ${omdbData.Metascore || 'N/A'}</p>
  <p><strong>Awards:</strong> ${omdbData.Awards || 'N/A'}</p>
` : '<p>No OMDb info available</p>'}


          <div style="margin-top:1rem; display:flex; gap:.5rem;">
            <button id="favBtn" class="btn ${favState ? '' : 'primary'}">${favState ? 'Remove Favorite' : 'Add to Favorites'}</button>
            ${trailer ? `<a id="watchTrailer" class="btn primary" target="_blank" href="https://youtube.com/watch?v=${trailer.key}">Watch Trailer</a>` : ''}
          </div>

          <h3 style="margin-top:1rem">Cast</h3>
          <div id="cast" style="display:flex; gap:.5rem; flex-wrap:wrap"></div>

          <h3 style="margin-top:1rem">More like this</h3>
          <div id="similar" class="grid"></div>
        </div>
      </section>
    `;

    
    const castContainer = document.getElementById('cast');
    if (cast.length === 0) castContainer.innerText = 'No cast available';
    else {
      cast.forEach(person => {
        const el = document.createElement('div');
        el.style.width = '120px';
        el.style.textAlign = 'center';
        el.innerHTML = `
          <img src="${person.profile_path ? posterUrl(person.profile_path) : '/assets/no-poster.png'}" style="width:100%;height:150px;object-fit:cover;border-radius:8px" alt="${person.name}" />
          <div style="font-weight:600;margin-top:.25rem">${person.name}</div>
          <div style="font-size:.85rem;color:var(--muted)">${person.character || ''}</div>
        `;
        castContainer.appendChild(el);
      });
    }

    
    const similar = details.similar && details.similar.results ? details.similar.results.slice(0,8) : [];
    const similarContainer = document.getElementById('similar');
    if(similar.length === 0) similarContainer.innerText = 'No similar titles.';
    else {
      similar.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <img src="${item.poster_path ? posterUrl(item.poster_path) : '/assets/no-poster.png'}" alt="${item.title || item.name}" />
          <div class="meta">
            <div class="title">${item.title || item.name}</div>
            <div class="sub">${(item.release_date || item.first_air_date || '').slice(0,4)}</div>
          </div>
        `;
        card.addEventListener('click', () => {
          const t = item.media_type || (item.title ? 'movie' : 'tv');
          window.location.href = `details.html?type=${t}&id=${item.id}`;
        });
        similarContainer.appendChild(card);
      });
    }

    
    const favBtn = document.getElementById('favBtn');
    favBtn.addEventListener('click', () => {
      const item = { id, type, title, poster_path: details.poster_path };
      toggleFavorite(item);
      const nowFav = isFavorite(type, id);
      favBtn.innerText = nowFav ? 'Remove Favorite' : 'Add to Favorites';
      if(nowFav) favBtn.classList.remove('primary'); else favBtn.classList.add('primary');
    });

  } catch (err) {
    console.error('details error', err);
    main.innerHTML = `<p>Error cargando detalles: ${err.message}</p>`;
  }
}

render();
