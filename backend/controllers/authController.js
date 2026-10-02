const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    const usuarioExistente = await Usuario.findOne({ where: { email } });

    if (usuarioExistente) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const usuario = await Usuario.create({
      username,
      email,
      password: passwordHash
    });

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, username: usuario.username },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      token,
      user: {
        id: usuario.id,
        username: usuario.username,
        email: usuario.email
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Error al registrar usuario',
      error: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña requeridos' });
    }

    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, username: usuario.username },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'Login exitoso',
      token,
      user: {
        id: usuario.id,
        username: usuario.username,
        email: usuario.email
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Error al iniciar sesión',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login
};