const pool = require('../../db');


const obtenerMensajesPorClase = async (req, res) => {
  const { idClase } = req.params;
  try {
    const resultado = await pool.query(
      `SELECT m.*, u.nombre AS nombre_emisor
       FROM mensaje m
       JOIN usuario u ON u.id_usuario = m.id_emisor
       WHERE id_clase = $1
       ORDER BY fecha_envio ASC`,
      [idClase]
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({ error: 'Error al obtener los mensajes' });
  }
};

// Enviar un nuevo mensaje
const enviarMensaje = async (req, res) => {
  const { idClase } = req.params;
  const { id_emisor, id_receptor, contenido } = req.body;

  try {
    const resultado = await pool.query(
      `INSERT INTO mensaje (id_clase, id_emisor, id_receptor, contenido, leido)
       VALUES ($1, $2, $3, $4, false)
       RETURNING *`,
      [idClase, id_emisor, id_receptor, contenido]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    res.status(500).json({ error: 'Error al enviar el mensaje' });
  }
};

module.exports = {
  obtenerMensajesPorClase,
  enviarMensaje,
};