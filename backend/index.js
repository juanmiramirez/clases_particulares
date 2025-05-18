const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Rutas de autenticación
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Ruta raíz de sanity check
app.get('/', (req, res) => {
  res.send('¡Backend activo!');
});

// Test de conexión a PostgreSQL
app.get('/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({
      mensaje: 'Conexión a PostgreSQL exitosa ✅',
      servidor: result.rows[0].now
    });
  } catch (error) {
    console.error('Error de conexión a la base de datos:', error);
    res.status(500).json({ error: 'Fallo al conectar con la base de datos' });
  }
});

// Rutas de perfil y búsqueda de profesores (incluye anidado de reseñas)
const perfilRoutes = require('./routes/perfil/perfilRoutes');
app.use('/api/perfil', perfilRoutes);

const buscarProfesoresRoutes = require('./routes/perfil/buscarProfesoresRoutes');
app.use('/api/profesores', buscarProfesoresRoutes);

// Rutas de clases
const claseRoutes = require('./routes/clase/claseRoutes');
app.use('/api/clases', claseRoutes);

// Rutas de pagos
const pagoStripeRoutes = require('./routes/pago/pagoStripeRoutes');
app.use('/api/pagos/stripe', pagoStripeRoutes);

const resenasRoutes = require('./routes/resenas/resenasRoutes');
app.use('/api/resenas', resenasRoutes);

const reservasRoutes = require('./routes/reservas/reservasRoutes');
app.use('/api/reservas', reservasRoutes);

const chatRoutes = require('./routes/chat/chatRoutes');
app.use('/api/chat', chatRoutes);


// Arranque del servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});