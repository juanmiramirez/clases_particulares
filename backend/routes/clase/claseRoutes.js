const express = require('express');
const router = express.Router();
const {
  reservarClase,
  obtenerClasesPorUsuario,
  obtenerClasePorId, 
} = require('../../controllers/clase/claseController');


router.post('/', reservarClase);


router.get('/usuario/:id_usuario', obtenerClasesPorUsuario); 


router.get('/:id', obtenerClasePorId); 

module.exports = router;