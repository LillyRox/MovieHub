// api.mjs
const API_KEY = "3258f0433edc4fee1b40def01c143859";
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMjU4ZjA0MzNlZGM0ZmVlMWI0MGRlZjAxYzE0Mzg1OSIsIm5iZiI6MTc2MDQ2NzE3Ni45MjUsInN1YiI6IjY4ZWU5OGU4NTNkMmY0YjZkYTQwYzljYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.TCGDLqkhzCDLE0mnx_A7KNXrDivRcsA-ulR6IcDefB4";

const BASE_URL = "https://api.themoviedb.org/3";

const headers = {
  accept: "application/json",
  Authorization: `Bearer ${ACCESS_TOKEN}`,
};


export async function getTrending() {
  const res = await fetch(`${BASE_URL}/trending/all/week?language=en-US`, { headers });
  if (!res.ok) throw new Error("Failed to load trending data.");
  return res.json();
}


export async function searchMovies(query) {
  const res = await fetch(`${BASE_URL}/search/multi?query=${encodeURIComponent(query)}&language=en-US`, { headers });
  if (!res.ok) throw new Error("Search request failed.");
  return res.json();
}


export async function getDetails(type, id) {
  const res = await fetch(`${BASE_URL}/${type}/${id}?language=en-US&append_to_response=videos,credits`, { headers });
  if (!res.ok) throw new Error("Failed to fetch details.");
  return res.json();
}


export async function getGenres() {
  const [movieRes, tvRes] = await Promise.all([
    fetch(`${BASE_URL}/genre/movie/list?language=en-US`, { headers }),
    fetch(`${BASE_URL}/genre/tv/list?language=en-US`, { headers })
  ]);
  const movieGenres = await movieRes.json();
  const tvGenres = await tvRes.json();
  return { movie: movieGenres.genres, tv: tvGenres.genres };
}
