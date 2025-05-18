const db = require('../../db');

// Listar profesores (con o sin filtro por especialidad)
const listarProfesores = async (req, res) => {
  const { especialidad } = req.query;

  try {
    let resultado;

    const baseQuery = `
      SELECT 
        u.id_usuario,
        u.nombre,
        u.correo,
        u.rol,
        p.descripcion,
        p.experiencia,
        p.foto_perfil,
        p.especialidades AS materia
      FROM usuario u
      JOIN perfil p ON u.id_usuario = p.id_usuario
      WHERE u.rol = 'profesor'
    `;

    if (especialidad) {
      resultado = await db.query(
        baseQuery + ' AND p.especialidades ILIKE $1',
        [`%${especialidad}%`]
      );
    } else {
      resultado = await db.query(baseQuery);
    }

    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al buscar profesores:', error);
    res.status(500).json({ error: 'Error interno al buscar profesores' });
  }
};

// Obtener detalle de un profesor por ID (con JOIN a perfil)
const obtenerProfesorPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await db.query(`
      SELECT u.id_usuario, u.nombre, u.correo, p.descripcion, p.experiencia, p.especialidades, p.foto_perfil
      FROM usuario u
      JOIN perfil p ON u.id_usuario = p.id_usuario
      WHERE u.id_usuario = $1 AND u.rol = 'profesor'
    `, [id]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Profesor no encontrado' });
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al obtener profesor por ID:', error);
    res.status(500).json({ error: 'Error interno al obtener profesor' });
  }
};

module.exports = {
  listarProfesores,
  obtenerProfesorPorId
};