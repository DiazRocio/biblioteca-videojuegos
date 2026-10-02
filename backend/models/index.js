const sequelize = require('../db');
const Usuario = require('./Usuario');
const Juego = require('./Juego');
const UsuarioJuego = require('./UsuarioJuego');

// Definición de relaciones
Usuario.belongsToMany(Juego, { through: UsuarioJuego, foreignKey: 'usuarioId' });
Juego.belongsToMany(Usuario, { through: UsuarioJuego, foreignKey: 'juegoId' });
UsuarioJuego.belongsTo(Usuario, { foreignKey: 'usuarioId' });
UsuarioJuego.belongsTo(Juego, { foreignKey: 'juegoId' });
Usuario.hasMany(UsuarioJuego, { foreignKey: 'usuarioId' });
Juego.hasMany(UsuarioJuego, { foreignKey: 'juegoId' });

const syncDatabase = async () => {
  try {
    // force: false para que no borre los datos si ya existen, alter: true actualiza cambios en la estructura
    await sequelize.sync({ alter: true });
    console.log('¡Modelos sincronizados correctamente con Neon.tech!');
  } catch (error) {
    console.error('Error al sincronizar la base de datos:', error);
  }
};

module.exports = {
  Usuario,
  Juego,
  UsuarioJuego,
  syncDatabase
};