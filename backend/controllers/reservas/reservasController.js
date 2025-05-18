const db = require('../../db');

// Crear una nueva reserva
const crearReserva = async (req, res) => {
  const { id_profesor, fecha, hora, duracion, tema } = req.body;
  const id_estudiante = req.user.id_usuario;

  try {
    const conflicto = await db.query(`
      SELECT 1 FROM clase
      WHERE id_profesor = $1
        AND fecha = $2
        AND hora = $3
        AND estado != 'cancelada'
      LIMIT 1
    `, [id_profesor, fecha, hora]);

    if (conflicto.rowCount > 0) {
      return res.status(400).json({ error: 'Ya existe una reserva para este profesor en esa fecha y hora.' });
    }

    const resultado = await db.query(`
      INSERT INTO clase (id_profesor, id_estudiante, fecha, hora, duracion, estado, tema)
      VALUES ($1, $2, $3, $4, $5, 'reservada', $6)
      RETURNING *
    `, [id_profesor, id_estudiante, fecha, hora, duracion, tema]);

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al crear la reserva:', error);
    res.status(500).json({ error: 'Error al crear la reserva' });
  }
};

// Obtener reservas futuras de un profesor
const obtenerReservasPorProfesor = async (req, res) => {
  const { idProfesor } = req.params;

  try {
    const resultado = await db.query(`
      SELECT c.id_clase, c.fecha, c.hora, c.duracion, c.tema, u.nombre AS estudiante
      FROM clase c
      JOIN usuario u ON u.id_usuario = c.id_estudiante
      WHERE c.id_profesor = $1
        AND (c.fecha + c.hora) >= NOW()
        AND c.estado != 'cancelada'
      ORDER BY c.fecha, c.hora
    `, [idProfesor]);

    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener reservas del profesor:', error);
    res.status(500).json({ error: 'Error al obtener reservas del profesor' });
  }
};

// Obtener reservas futuras de un estudiante
const obtenerReservasPorEstudiante = async (req, res) => {
  const { idEstudiante } = req.params;

  try {
    const resultado = await db.query(`
      SELECT c.id_clase, c.fecha, c.hora, c.duracion, c.tema, u.nombre AS profesor
      FROM clase c
      JOIN usuario u ON u.id_usuario = c.id_profesor
      WHERE c.id_estudiante = $1
        AND (c.fecha + c.hora) >= NOW()
        AND c.estado != 'cancelada'
      ORDER BY c.fecha, c.hora
    `, [idEstudiante]);

    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener reservas del estudiante:', error);
    res.status(500).json({ error: 'Error al obtener reservas del estudiante' });
  }
};

// Cancelar una reserva
const cancelarReserva = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await db.query(`
      UPDATE clase
      SET estado = 'cancelada'
      WHERE id_clase = $1
      RETURNING *
    `, [id]);

    if (resultado.rowCount === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    res.json({ mensaje: 'Reserva cancelada', reserva: resultado.rows[0] });
  } catch (error) {
    console.error('Error al cancelar la reserva:', error);
    res.status(500).json({ error: 'Error al cancelar la reserva' });
  }
};
const obtenerMisReservas = async (req, res) => {
  const idEstudiante = req.user.id_usuario;

  try {
    const resultado = await db.query(`
      SELECT c.id_clase, c.fecha, c.hora, c.duracion, c.tema, u.nombre AS profesor
      FROM clase c
      JOIN usuario u ON u.id_usuario = c.id_profesor
      WHERE c.id_estudiante = $1
        AND (c.fecha::timestamp + c.hora::interval) >= NOW()
		AND c.estado != 'cancelada'
      ORDER BY c.fecha, c.hora
    `, [idEstudiante]);

    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener mis reservas:', error);
    res.status(500).json({ error: 'Error al obtener reservas del estudiante autenticado' });
  }
};
const obtenerMisClases = async (req, res) => {
  const idProfesor = req.user.id_usuario;

  try {
    const resultado = await db.query(`
      SELECT c.id_clase, c.fecha, c.hora, c.duracion, c.tema, u.nombre AS estudiante
      FROM clase c
      JOIN usuario u ON u.id_usuario = c.id_estudiante
      WHERE c.id_profesor = $1
        AND (c.fecha::timestamp + c.hora::interval) >= NOW()
        AND c.estado != 'cancelada'
      ORDER BY c.fecha, c.hora
    `, [idProfesor]);

    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener mis clases:', error);
    res.status(500).json({ error: 'Error al obtener clases del profesor autenticado' });
  }
};

const obtenerFechasReservadas = async (req, res) => {
  const { idProfesor } = req.params;
  try {
    const result = await db.query(
      `SELECT fecha, hora FROM clase WHERE id_profesor = $1 AND estado = 'reservada'`,
      [idProfesor]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener fechas reservadas:', error);
    res.status(500).json({ error: 'Error al obtener las fechas' });
  }
};
const obtenerAvisosProximos = async (req, res) => {
  const { id_usuario, rol } = req.user;

  try {
    let resultado;
    if (rol === 'estudiante') {
      resultado = await db.query(`
        SELECT c.id_clase, c.fecha, c.hora, c.tema, u.nombre AS con_quien
        FROM clase c
        JOIN usuario u ON u.id_usuario = c.id_profesor
        WHERE c.id_estudiante = $1
          AND c.estado = 'reservada'
          AND (c.fecha::timestamp + c.hora::interval) BETWEEN NOW() AND NOW() + interval '24 hours'
        ORDER BY c.fecha, c.hora
      `, [id_usuario]);
    } else if (rol === 'profesor') {
      resultado = await db.query(`
        SELECT c.id_clase, c.fecha, c.hora, c.tema, u.nombre AS con_quien
        FROM clase c
        JOIN usuario u ON u.id_usuario = c.id_estudiante
        WHERE c.id_profesor = $1
          AND c.estado = 'reservada'
          AND (c.fecha::timestamp + c.hora::interval) BETWEEN NOW() AND NOW() + interval '24 hours'
        ORDER BY c.fecha, c.hora
      `, [id_usuario]);
    } else {
      return res.status(403).json({ error: 'Rol no autorizado para recibir avisos.' });
    }

    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener avisos:', error);
    res.status(500).json({ error: 'Error al obtener avisos de próximas clases.' });
  }
};


module.exports = {
  crearReserva,
  obtenerReservasPorProfesor,
  obtenerReservasPorEstudiante,
  cancelarReserva,
  obtenerMisReservas,
  obtenerMisClases,
  obtenerFechasReservadas,
  obtenerAvisosProximos
};