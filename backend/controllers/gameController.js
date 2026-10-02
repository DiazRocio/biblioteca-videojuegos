const { Juego } = require('../models');

const fallbackGames = [
  { id: 1, name: 'Cyberpunk 2077', genre: 'RPG', rating: 4.7, image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500' },
  { id: 2, name: 'The Witcher 3', genre: 'Action RPG', rating: 4.9, image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500' },
  { id: 3, name: 'Elden Ring', genre: 'Soulslike', rating: 4.8, image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500' },
  { id: 4, name: 'Hades', genre: 'Roguelike', rating: 4.6, image: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=500' }
];

let igdbToken = null;
let igdbTokenExpiresAt = 0;

const getIgdbAccessToken = async () => {
  if (igdbToken && Date.now() < igdbTokenExpiresAt) return igdbToken;

  const body = new URLSearchParams({
    client_id: process.env.TWITCH_CLIENT_ID,
    client_secret: process.env.TWITCH_CLIENT_SECRET,
    grant_type: 'client_credentials'
  });
  const response = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    signal: AbortSignal.timeout(10000)
  });

  if (!response.ok) {
    console.error(`Twitch OAuth respondió con estado ${response.status}`);
    throw new Error('No se pudo autenticar con Twitch para consultar IGDB.');
  }

  const data = await response.json();
  igdbToken = data.access_token;
  igdbTokenExpiresAt = Date.now() + Math.max(0, data.expires_in - 60) * 1000;
  return igdbToken;
};

const mapIgdbGame = (game) => ({
  id: game.id,
  name: game.name,
  genre: game.genres?.map((genre) => genre.name).slice(0, 2).join(', ') || 'Sin género',
  rating: Number(game.rating) ? Number((game.rating / 20).toFixed(1)) : 0,
  image: game.cover?.url
    ? `https:${game.cover.url.replace('t_thumb', 't_cover_big')}`
    : 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500'
});

const getGames = async (req, res) => {
  try {
    const search = String(req.query.search || '').trim();

    if (process.env.TWITCH_CLIENT_ID && process.env.TWITCH_CLIENT_SECRET) {
      const accessToken = await getIgdbAccessToken();
      const safeSearch = search.replace(/[\\"\r\n]/g, ' ').trim().slice(0, 100);
      const searchClause = safeSearch ? `search "${safeSearch}";` : '';
      const query = `${searchClause} fields name,rating,genres.name,cover.url; where version_parent = null; limit 24; sort rating desc;`;
      const response = await fetch('https://api.igdb.com/v4/games', {
        method: 'POST',
        headers: {
          'Client-ID': process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'text/plain'
        },
        body: query,
        signal: AbortSignal.timeout(15000)
      });

      if (!response.ok) {
        console.error(`IGDB respondió con estado ${response.status}`);
        return res.status(502).json({ message: 'IGDB no pudo responder el catálogo. Revisa las credenciales de Twitch e intenta nuevamente.' });
      }

      const result = await response.json();
      return res.status(200).json(result.map(mapIgdbGame));
    }

    const juegos = await Juego.findAll({
      order: [['id', 'ASC']]
    });

    const data = juegos.length > 0 ? juegos : fallbackGames;
    const normalizedSearch = search.toLowerCase();

    const mappedGames = data.map((juego) => ({
      id: juego.id,
      name: juego.name || juego.nombre || 'Juego',
      genre: juego.genre || juego.genero || 'Sin género',
      rating: Number(juego.rating) || 0,
      image: juego.image || juego.imagen || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500'
    }));

    return res.status(200).json(normalizedSearch
      ? mappedGames.filter((game) => game.name.toLowerCase().includes(normalizedSearch))
      : mappedGames);
  } catch (error) {
    console.error('Error al consultar IGDB:', error.message);
    return res.status(500).json({
      message: 'Error al obtener juegos de IGDB. Comprueba las credenciales de Twitch en backend/.env.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getGames
};
