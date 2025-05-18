const express = require('express');
const router = express.Router({ mergeParams: true });

const {
  crearResena,
  obtenerResenasPorProfesor,
  obtenerClasesPasadasConResenas
} = require('../../controllers/resenas/resenasController');

const { ensureAuth } = require('../../middleware/auth');

// GET reseñas por profesor
router.get('/profesor/:id', obtenerResenasPorProfesor);

// POST dejar reseña
router.post('/', ensureAuth, crearResena);

// GET clases pasadas del estudiante con o sin reseña
router.get('/mis-clases-pasadas', ensureAuth, obtenerClasesPasadasConResenas);

module.exports = router;