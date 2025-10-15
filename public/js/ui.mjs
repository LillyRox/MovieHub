// ui.mjs
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export function renderTrending(items) {
  const container = document.getElementById("trendingContainer");
  container.innerHTML = "";
  items.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <img src="${IMAGE_BASE + item.poster_path}" alt="${item.title || item.name}" />
      <h3>${item.title || item.name}</h3>
      <p>⭐ ${item.vote_average?.toFixed(1) || "N/A"}</p>
    `;
    div.addEventListener("click", () => {
      const type = item.media_type;
      window.location.href = `details.html?type=${type}&id=${item.id}`;
    });
    container.appendChild(div);
  });
}

export function renderSearchResults(results) {
  const container = document.getElementById("trendingContainer");
  container.innerHTML = `<h2>Search Results</h2>`;
  results.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <img src="${IMAGE_BASE + item.poster_path}" alt="${item.title || item.name}" />
      <h3>${item.title || item.name}</h3>
      <p>⭐ ${item.vote_average?.toFixed(1) || "N/A"}</p>
    `;
    div.addEventListener("click", () => {
      const type = item.media_type;
      window.location.href = `details.html?type=${type}&id=${item.id}`;
    });
    container.appendChild(div);
  });
}
