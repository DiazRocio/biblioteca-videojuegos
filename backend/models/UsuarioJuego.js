const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const UsuarioJuego = sequelize.define('UsuarioJuego', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  estado: {
    type: DataTypes.ENUM('Planeado para jugar', 'En progreso', 'Finalizado'),
    allowNull: false,
    defaultValue: 'Planeado para jugar'
  },
  horasJugadas: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'usuario_juegos',
  timestamps: true
});

module.exports = UsuarioJuego;