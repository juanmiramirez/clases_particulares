const express = require('express');
const router = express.Router();
const {
  obtenerMensajesPorClase,
  enviarMensaje,
} = require('../../controllers/chat/chatController');

// GET mensajes de una clase
router.get('/:idClase', obtenerMensajesPorClase);

// POST nuevo mensaje en una clase
router.post('/:idClase', enviarMensaje);

module.exports = router;