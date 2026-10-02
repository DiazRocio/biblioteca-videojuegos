const { Usuario, Juego, UsuarioJuego } = require('../models');

const fallbackGames = [
  { id: 1, name: 'Cyberpunk 2077', genre: 'RPG', rating: 4.7, image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500' },
  { id: 2, name: 'The Witcher 3', genre: 'Action RPG', rating: 4.9, image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500' },
  { id: 3, name: 'Elden Ring', genre: 'Soulslike', rating: 4.8, image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500' },
  { id: 4, name: 'Hades', genre: 'Roguelike', rating: 4.6, image: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=500' }
];

const addGameToLibrary = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { gameId, game, estado = 'Planeado para jugar', horasJugadas = 0 } = req.body;
    const numericGameId = Number(gameId);

    if (!userId || !Number.isInteger(numericGameId) || numericGameId <= 0) {
      return res.status(400).json({ message: 'Falta un gameId válido' });
    }

    const usuario = await Usuario.findByPk(userId);
    let juego = await Juego.findByPk(gameId);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (!juego) {
      const fallbackGame = fallbackGames.find((game) => Number(game.id) === Number(gameId));
      const gameData = game && Number(game.id) === numericGameId && typeof game.name === 'string'
        ? game
        : fallbackGame;

      if (gameData) {
        [juego] = await Juego.findOrCreate({
          where: { id: numericGameId },
          defaults: {
            nombre: gameData.name.slice(0, 255),
            genero: typeof gameData.genre === 'string' ? gameData.genre.slice(0, 255) : 'Sin género',
            imagen: typeof gameData.image === 'string' ? gameData.image.slice(0, 2048) : null
          }
        });
      }
    }

    if (juego && game && Number(game.id) === numericGameId && typeof game.name === 'string') {
      await juego.update({
        nombre: game.name.slice(0, 255),
        genero: typeof game.genre === 'string' ? game.genre.slice(0, 255) : 'Sin género',
        imagen: typeof game.image === 'string' ? game.image.slice(0, 255) : null
      });
    }

    if (!juego) {
      return res.status(404).json({ message: 'Juego no encontrado' });
    }

    const [entry, created] = await UsuarioJuego.findOrCreate({
      where: { usuarioId: userId, juegoId: numericGameId },
      defaults: {
        estado,
        horasJugadas
      }
    });

    if (!created) {
      await entry.update({ estado, horasJugadas });
    }

    return res.status(created ? 201 : 200).json({
      message: created ? 'Juego agregado a tu biblioteca' : 'Juego actualizado en tu biblioteca',
      item: {
        id: entry.id,
        usuarioId: entry.usuarioId,
        juegoId: entry.juegoId,
        estado: entry.estado,
        horasJugadas: entry.horasJugadas
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al guardar juego en la biblioteca',
      error: error.message
    });
  }
};

const getUserLibrary = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const currentUserId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: 'Falta el userId' });
    }

    if (currentUserId && Number(currentUserId) !== Number(userId)) {
      return res.status(403).json({ message: 'No tenés permiso para ver esta biblioteca' });
    }

    const items = await UsuarioJuego.findAll({
      where: { usuarioId: userId },
      include: [{
        model: Juego,
        attributes: ['id', 'nombre', 'imagen', 'genero']
      }],
      order: [['updatedAt', 'DESC']]
    });

    const library = items.map((item) => ({
      id: item.id,
      juegoId: item.juegoId,
      estado: item.estado,
      horasJugadas: item.horasJugadas,
      nombre: item.Juego?.nombre || 'Juego sin nombre',
      imagen: item.Juego?.imagen || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500',
      genero: item.Juego?.genero || 'Sin género'
    }));

    return res.status(200).json(library);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener la biblioteca del usuario',
      error: error.message
    });
  }
};

module.exports = {
  addGameToLibrary,
  getUserLibrary
};
