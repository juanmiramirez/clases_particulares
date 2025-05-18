const express = require('express');
const router = express.Router();
const { crearOActualizarPerfil, obtenerPerfil } = require('../../controllers/perfil/perfilController');

router.post('/', crearOActualizarPerfil);
router.get('/:id_usuario', obtenerPerfil);

module.exports = router;