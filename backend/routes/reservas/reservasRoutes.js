const express = require('express');
const router = express.Router();

const { ensureAuth } = require('../../middleware/auth');
const {
  crearReserva,
  obtenerReservasPorProfesor,
  obtenerReservasPorEstudiante,
  cancelarReserva,
  obtenerMisReservas,
  obtenerMisClases,
  obtenerFechasReservadas,
  obtenerAvisosProximos
  
  
} = require('../../controllers/reservas/reservasController');



router.post('/', ensureAuth, crearReserva); 
router.get('/profesor/:idProfesor', obtenerReservasPorProfesor);
router.get('/estudiante/:idEstudiante', obtenerReservasPorEstudiante);
router.put('/:id/cancelar', cancelarReserva);
router.get('/mis-reservas', ensureAuth, obtenerMisReservas);
router.get('/mis-clases', ensureAuth, obtenerMisClases);
router.get('/reservadas/:idProfesor', obtenerFechasReservadas);
router.get('/avisos', ensureAuth, obtenerAvisosProximos);

module.exports = router;