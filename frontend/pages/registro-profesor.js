import { useState } from 'react';
import { useRouter } from 'next/router';

export default function RegistroProfesor() {
  const router = useRouter();
  const [formulario, setFormulario] = useState({
    nombre: '',
    correo: '',
    contraseña: '',
    materia: '',
    experiencia: '',
    descripcion: '',
    foto_perfil: '',
  });

  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setFormulario(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setExito('');

    const { nombre, correo, contraseña, materia, experiencia, descripcion } = formulario;

    if (!nombre || !correo || !contraseña || !materia || !experiencia || !descripcion) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formulario,
          rol: 'profesor',
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setExito('Registro exitoso ✅');
        setFormulario({
          nombre: '',
          correo: '',
          contraseña: '',
          materia: '',
          experiencia: '',
          descripcion: '',
          foto_perfil: '',
        });

        // ✅ Redirige directamente a index principal tras 1.5s
        setTimeout(() => router.push('/index-menu'), 1500);
      } else {
        setError(data.error || 'Error al registrar');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Registro de Profesor</h2>
      <form onSubmit={handleSubmit}>
        {['nombre', 'correo', 'contraseña', 'materia', 'experiencia', 'descripcion', 'foto_perfil'].map(campo => (
          <input
            key={campo}
            name={campo}
            type={campo === 'contraseña' ? 'password' : 'text'}
            placeholder={
              campo === 'foto_perfil'
                ? 'URL de la foto de perfil (opcional)'
                : campo.charAt(0).toUpperCase() + campo.slice(1)
            }
            value={formulario[campo]}
            onChange={handleChange}
            className="w-full mb-3 p-2 border rounded"
          />
        ))}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Registrar
        </button>
      </form>

      {error && <p className="mt-3 text-red-600">❌ {error}</p>}
      {exito && <p className="mt-3 text-green-600">✅ {exito}</p>}
    </div>
  );
}