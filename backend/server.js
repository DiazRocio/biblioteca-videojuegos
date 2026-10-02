const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./db');
const { syncDatabase } = require('./models');
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const libraryRoutes = require('./routes/libraryRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API de Biblioteca de Videojuegos funcionando');
});

app.use('/api', authRoutes);
app.use('/api', gameRoutes);
app.use('/api', libraryRoutes);

app.listen(PORT, async () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('¡Conexión exitosa con la base de datos en Neon.tech!');

    await syncDatabase();
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
});