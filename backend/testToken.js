const jwt = require('jsonwebtoken');

const payload = {
  id_usuario: 2,
  nombre: 'Juanmi',
  rol: 'estudiante'
};

const secret = process.env.JWT_SECRET || 'tuClaveMuySecreta';
console.log('🔑 Firmando con:', JSON.stringify(secret));

const token = jwt.sign(payload, secret, { expiresIn: '2h' });
console.log('✅ TOKEN GENERADO:\n');
console.log(token);
