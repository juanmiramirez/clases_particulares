const db = require('../../db');

const crearOActualizarPerfil = async (req, res) => {
  const { id_usuario, descripcion, experiencia, especialidades, foto_perfil } = req.body;

  if (!id_usuario) return res.status(400).json({ error: 'id_usuario es obligatorio' });

  try {
    const existe = await db.query('SELECT * FROM perfil WHERE id_usuario = $1', [id_usuario]);

    if (existe.rows.length > 0) {
      // Actualizar
      await db.query(`
        UPDATE perfil SET descripcion=$1, experiencia=$2, especialidades=$3, foto_perfil=$4
        WHERE id_usuario=$5
      `, [descripcion, experiencia, especialidades, foto_perfil, id_usuario]);

      res.json({ mensaje: 'Perfil actualizado' });
    } else {
      // Crear
      await db.query(`
        INSERT INTO perfil (id_usuario, descripcion, experiencia, especialidades, foto_perfil)
        VALUES ($1, $2, $3, $4, $5)
      `, [id_usuario, descripcion, experiencia, especialidades, foto_perfil]);

      res.status(201).json({ mensaje: 'Perfil creado' });
    }

  } catch (error) {
    console.error('Error perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const obtenerPerfil = async (req, res) => {
  const { id_usuario } = req.params;

  try {
    const resultado = await db.query('SELECT * FROM perfil WHERE id_usuario = $1', [id_usuario]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { crearOActualizarPerfil, obtenerPerfil };