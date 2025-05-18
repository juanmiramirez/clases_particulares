const db = require('../../db');

// GET - Obtener reseñas por profesor
const obtenerResenasPorProfesor = async (req, res) => {
  const idProfesor = req.params.id;

  try {
    const result = await db.query(`
      SELECT r.id_reseña, r.puntuacion, r.comentario, r.fecha, u.nombre AS estudiante
      FROM resena r
      JOIN usuario u ON r.id_estudiante = u.id_usuario
      JOIN clase c ON r.id_clase = c.id_clase
      WHERE c.id_profesor = $1
      ORDER BY r.fecha DESC
    `, [idProfesor]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener reseñas:', error);
    res.status(500).json({ error: 'Error al obtener reseñas' });
  }
};

// POST - Crear una nueva reseña
const crearResena = async (req, res) => {
  const { id_clase, puntuacion, comentario } = req.body;
  const id_estudiante = req.user.id_usuario;

  try {
    const result = await db.query(`
      INSERT INTO resena (id_clase, id_estudiante, puntuacion, comentario, fecha)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *
    `, [id_clase, id_estudiante, puntuacion, comentario]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear reseña:', error);
    res.status(500).json({ error: 'Error al crear reseña' });
  }
};

// GET - Clases pasadas del estudiante con posibles reseñas
const obtenerClasesPasadasConResenas = async (req, res) => {
  const idEstudiante = req.user.id_usuario;

  try {
    const resultado = await db.query(`
      SELECT 
        c.id_clase,
        c.fecha,
        c.hora,
        c.tema,
        u.nombre AS profesor,
        r.id_reseña AS resena_id
      FROM clase c
      JOIN usuario u ON u.id_usuario = c.id_profesor
      LEFT JOIN resena r ON r.id_clase = c.id_clase
      WHERE c.id_estudiante = $1
        AND (c.fecha::timestamp + c.hora::interval) < NOW()
        AND c.estado != 'cancelada'
      ORDER BY c.fecha DESC
    `, [idEstudiante]);

    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener clases pasadas con reseñas:', error);
    res.status(500).json({ error: 'Error al obtener clases pasadas' });
  }
};

module.exports = {
  obtenerResenasPorProfesor,
  crearResena,
  obtenerClasesPasadasConResenas
};