// server.js 
const express = require('express');
const path = require('path');
const { fileURLToPath } = require('url'); 
const fetch = global.fetch || require('node-fetch');
const axios = require("axios"); 
const OMDB_API_KEY = "2e787881";

require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 3000;

const PUBLIC_DIR = path.join(__dirname, 'public');


app.use(express.static(PUBLIC_DIR, { extensions: ['html'] }));


app.get('/', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});




app.get('/api/trending', async (req, res) => {
  try {
    const resp = await fetch('https://api.themoviedb.org/3/trending/all/week?language=en-US', {
      headers: { Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}` }
    });
    const json = await resp.json();
    res.json(json);
  } catch (err) {
    console.error('API proxy error:', err);
    res.status(500).json({ error: 'Failed to proxy trending' });
  }
});


app.get('/api/search', async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ error: 'Missing q parameter' });
  try {
    const url = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(q)}&language=en-US`;
    const resp = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}` }
    });
    const json = await resp.json();
    res.json(json);
  } catch (err) {
    console.error('API proxy error:', err);
    res.status(500).json({ error: 'Failed to proxy search' });
  }
});


app.get('/api/details/:type/:id', async (req, res) => {
  const { type, id } = req.params;
  try {
    const url = `https://api.themoviedb.org/3/${type}/${id}?language=en-US&append_to_response=videos,credits,similar,watch/providers`;
    const resp = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}` }
    });
    const json = await resp.json();
    res.json(json);
  } catch (err) {
    console.error('API proxy error:', err);
    res.status(500).json({ error: 'Failed to proxy details' });
  }
});


app.get("/api/omdb/:title", async (req, res) => {
  try {
    const title = req.params.title;
    const response = await axios.get(`http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${OMDB_API_KEY}`);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data from OMDb");
  }
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server error');
});


app.listen(PORT, () => {
  console.log(`🎬 MovieHub server is running at http://localhost:${PORT}`);
});
