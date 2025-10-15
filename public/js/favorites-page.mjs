// js/favorites-page.mjs
import { getFavorites, removeFavorite } from './favorites.mjs';
import { posterUrl } from './utils.mjs';

const grid = document.getElementById('favoritesGrid');

function render() {
  const favs = getFavorites();
  grid.innerHTML = '';
  if (!favs.length) {
    grid.innerHTML = '<p>You do not have favorites yet.</p>';
    return;
  }

  favs.forEach(item => {
    const el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = `
      <img src="${item.poster_path ? posterUrl(item.poster_path) : '/assets/no-poster.png'}" alt="${item.title}" />
      <div class="meta">
        <div class="title">${item.title}</div>
        <div class="sub">${(new Date(item.addedAt)).toLocaleString()}</div>
        <div style="margin-top:.5rem;display:flex;gap:.5rem">
          <button class="btn viewBtn">View</button>
          <button class="btn removeBtn">Remove</button>
        </div>
      </div>
    `;
    grid.appendChild(el);

    el.querySelector('.viewBtn').addEventListener('click', () => {
      window.location.href = `details.html?type=${item.type}&id=${item.id}`;
    });
    el.querySelector('.removeBtn').addEventListener('click', () => {
      if (!confirm('Remove from favorites?')) return;
      removeFavorite(item.type, item.id);
      render(); 
    });
  });
}

render();
