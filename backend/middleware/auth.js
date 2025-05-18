const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

/**
 * Middleware para proteger rutas mediante JWT.
 * Debe recibir header: Authorization: Bearer <token>
 */
async function ensureAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ error: 'No se proporcionó token' });
  }

  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Formato de token inválido' });
  }

  const token = parts[1];
  try {
	  console.log('🧪 typeof JWT_SECRET:', typeof process.env.JWT_SECRET);
	  console.log('🧪 JWT_SECRET (length):', process.env.JWT_SECRET.length);
      console.log('🧪 JWT_SECRET (value):', JSON.stringify(process.env.JWT_SECRET));
	console.log('🔐 JWT_SECRET en uso:', process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decodificado:', decoded); // ✅ AÑADIDO

    const { id_usuario } = decoded;

    const result = await db.query(
      'SELECT id_usuario, nombre, correo, rol FROM usuario WHERE id_usuario = $1',
      [id_usuario]
    );

    if (result.rows.length === 0) {
      console.warn('⚠️ Usuario no encontrado en la base de datos.');
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    req.user = result.rows[0];
    next();
  } catch (err) {
    console.error('❌ Error en autenticación:', err.name, '-', err.message);
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = { ensureAuth };