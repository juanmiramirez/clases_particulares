const db = require('../../db');

const reservarClase = async (req, res) => {
  const { id_profesor, id_estudiante, fecha, hora } = req.body;

  if (!id_profesor || !id_estudiante || !fecha || !hora) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const resultado = await db.query(
      `INSERT INTO clase (id_profesor, id_estudiante, fecha, hora, estado)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id_profesor, id_estudiante, fecha, hora, 'reservada']
    );

    res.status(201).json({ mensaje: 'Clase reservada con éxito', clase: resultado.rows[0] });
  } catch (error) {
    console.error('Error al reservar clase:', error);
    res.status(500).json({ error: 'Error interno al reservar clase' });
  }
};

module.exports = { reservarClase };

const obtenerClasesPorUsuario = async (req, res) => {
  const { id_usuario } = req.params;

  try {
    const clases = await db.query(`
      SELECT c.*, 
             u1.nombre AS profesor_nombre, 
             u2.nombre AS estudiante_nombre
      FROM clase c
      JOIN usuario u1 ON u1.id_usuario = c.id_profesor
      JOIN usuario u2 ON u2.id_usuario = c.id_estudiante
      WHERE c.id_profesor = $1 OR c.id_estudiante = $1
      ORDER BY c.fecha ASC, c.hora ASC
    `, [id_usuario]);

    res.json(clases.rows);
  } catch (error) {
    console.error('Error al obtener clases:', error);
    res.status(500).json({ error: 'Error interno al obtener clases' });
  }
};

const obtenerClasePorId = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await db.query(
  `SELECT c.*, 
          u1.nombre AS profesor_nombre, 
          u2.nombre AS estudiante_nombre
   FROM clase c
   JOIN usuario u1 ON u1.id_usuario = c.id_profesor
   JOIN usuario u2 ON u2.id_usuario = c.id_estudiante
   WHERE c.id_clase = $1`,
  [id]
);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Clase no encontrada' });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al obtener clase:', error);
    res.status(500).json({ error: 'Error interno al obtener clase' });
  }
};

module.exports = {
  reservarClase,
  obtenerClasesPorUsuario,
  obtenerClasePorId
};