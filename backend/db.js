const { Sequelize } = require('sequelize');
require('dotenv').config();

// Inicializamos Sequelize usando la URL de conexión de Neon.tech desde el archivo .env
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Necesario para conexiones SSL con servicios en la nube como Neon
    }
  },
  logging: false // Cambia a true si quieres ver las consultas SQL en la consola
});

module.exports = sequelize;