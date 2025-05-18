const express = require('express');
const router = express.Router();
const db = require('../../db');

const { listarProfesores } = require('../../controllers/perfil/buscarProfesoresController');

// GET /api/profesores
router.get('/', listarProfesores);

// GET /api/profesores/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await db.query(`
      SELECT u.id_usuario, u.nombre, u.correo, u.rol,
             p.descripcion, p.experiencia, p.foto_perfil, p.especialidades AS materia
      FROM usuario u
      JOIN perfil p ON u.id_usuario = p.id_usuario
      WHERE u.id_usuario = $1
    `, [id]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Profesor no encontrado' });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al obtener perfil de profesor:', error);
    res.status(500).json({ error: 'Error al cargar perfil del profesor' });
  }
});

module.exports = router;