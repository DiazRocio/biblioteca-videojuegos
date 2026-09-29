const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./db');
const { syncDatabase } = require('./models'); // Importamos la sincronización

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API de Biblioteca de Videojuegos funcionando');
});

app.listen(PORT, async () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('¡Conexión exitosa con la base de datos en Neon.tech!');
    
    // Sincronizamos las tablas en la base de datos
    await syncDatabase();
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
});