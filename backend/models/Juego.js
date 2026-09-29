const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Juego = sequelize.define('Juego', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true // Aquí usaremos el ID que viene de la API de RAWG
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imagen: {
    type: DataTypes.STRING,
    allowNull: true
  },
  genero: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'juegos',
  timestamps: true
});

module.exports = Juego;