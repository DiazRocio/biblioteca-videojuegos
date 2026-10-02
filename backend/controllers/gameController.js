const { Juego } = require('../models');

const fallbackGames = [
  { id: 1, name: 'Cyberpunk 2077', genre: 'RPG', rating: 4.7, image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500' },
  { id: 2, name: 'The Witcher 3', genre: 'Action RPG', rating: 4.9, image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500' },
  { id: 3, name: 'Elden Ring', genre: 'Soulslike', rating: 4.8, image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500' },
  { id: 4, name: 'Hades', genre: 'Roguelike', rating: 4.6, image: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=500' }
];

const mapFreeToGame = (game) => ({
  id: game.id,
  name: game.title,
  genre: game.genre || 'Sin género',
  rating: 4.5, // FreeToGame no provee puntaje numérico de estrellas, se asigna un valor por defecto o base
  image: game.thumbnail || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500'
});

const getGames = async (req, res) => {
  try {
    const search = String(req.query.search || '').trim().toLowerCase();

    // Petición directa a FreeToGame (sin autenticación ni cabeceras de Twitch)
    const response = await fetch('https://www.freetogame.com/api/games', {
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
      console.error(`FreeToGame respondió con estado ${response.status}`);
      throw new Error('No se pudo conectar con la API de FreeToGame.');
    }

    const result = await response.json();
    const mappedGames = result.map(mapFreeToGame);

    const filteredGames = search
      ? mappedGames.filter((game) => game.name.toLowerCase().includes(search))
      : mappedGames;

    return res.status(200).json(filteredGames);

  } catch (error) {
    console.error('Error al consultar FreeToGame, usando respaldo local:', error.message);

    // Respaldo con base de datos local o fallbackGames si la API externa falla
    try {
      const juegos = await Juego.findAll({
        order: [['id', 'ASC']]
      });

      const data = juegos.length > 0 ? juegos : fallbackGames;
      const search = String(req.query.search || '').trim().toLowerCase();

      const mappedGames = data.map((juego) => ({
        id: juego.id,
        name: juego.name || juego.nombre || 'Juego',
        genre: juego.genre || juego.genero || 'Sin género',
        rating: Number(juego.rating) || 0,
        image: juego.image || juego.imagen || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500'
      }));

      return res.status(200).json(search
        ? mappedGames.filter((game) => game.name.toLowerCase().includes(search))
        : mappedGames);
    } catch (dbError) {
      return res.status(500).json({
        message: 'Error al obtener juegos.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

module.exports = {
  getGames
};