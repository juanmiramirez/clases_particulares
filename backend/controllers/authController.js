const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const register = async (req, res) => {
  const { nombre, correo, contraseña, rol, materia, experiencia, descripcion, foto_perfil } = req.body;

  if (!nombre || !correo || !contraseña || !rol) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    // Comprobar si el usuario ya existe
    const existe = await db.query('SELECT * FROM usuario WHERE correo = $1', [correo]);
    if (existe.rows.length > 0) {
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(contraseña, salt);

    // Insertar usuario
    const nuevo = await db.query(
      'INSERT INTO usuario (nombre, correo, contraseña_hash, rol) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, correo, hash, rol]
    );

    const id_usuario = nuevo.rows[0].id_usuario;

    // Si es profesor, insertar también en perfil (con foto opcional)
    if (rol === 'profesor') {
      await db.query(`
        INSERT INTO perfil (id_usuario, materia, experiencia, descripcion, foto_perfil)
        VALUES ($1, $2, $3, $4, $5)
      `, [
        id_usuario,
        materia,
        experiencia,
        descripcion,
        foto_perfil || null, 
      ]);
    }

    res.status(201).json({ mensaje: 'Usuario registrado con éxito', usuario: nuevo.rows[0] });
  } catch (error) {
    console.error('Error al registrar:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const login = async (req, res) => {
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
  }

  try {
    const resultado = await db.query('SELECT * FROM usuario WHERE correo = $1', [correo]);
    const usuario = resultado.rows[0];

    if (!usuario) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    const esCorrecta = await bcrypt.compare(contraseña, usuario.contraseña_hash);
    if (!esCorrecta) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ mensaje: 'Inicio de sesión correcto ✅', token, usuario: { id: usuario.id_usuario, nombre: usuario.nombre, rol: usuario.rol } });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { register, login };