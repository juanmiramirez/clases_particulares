const jwt = require('jsonwebtoken');
require('dotenv').config();

const payload = {
  id_usuario: 5,
  nombre: 'Ana Gómez',
  rol: 'profesor'
};

const secret = process.env.JWT_SECRET;
console.log('🔐 Firmando con:', JSON.stringify(secret));

const token = jwt.sign(payload, secret, { expiresIn: '2h' });
console.log('\n✅ TOKEN VÁLIDO:\n');
console.log(token);