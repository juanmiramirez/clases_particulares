import { useState } from 'react';
import { useRouter } from 'next/router'; // ✅ AÑADIDO

export default function Register() {
  const router = useRouter(); // ✅ AÑADIDO
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    contraseña: '',
    rol: 'estudiante',
    materia: '',
    experiencia: '',
    descripcion: ''
  });

  const [mensaje, setMensaje] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje('Registro exitoso ✅');

        // ✅ Redirigir tras éxito
        setTimeout(() => {
          router.push('/index-menu');
        }, 1500);
      } else {
        setMensaje(data.error || 'Error en el registro');
      }
    } catch (error) {
      setMensaje('Error de conexión');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Registro</h2>

        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="email"
          name="correo"
          placeholder="Correo electrónico"
          value={formData.correo}
          onChange={handleChange}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="password"
          name="contraseña"
          placeholder="Contraseña"
          value={formData.contraseña}
          onChange={handleChange}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          required
        />

        <select
          name="rol"
          value={formData.rol}
          onChange={handleChange}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        >
          <option value="estudiante">Estudiante</option>
          <option value="profesor">Profesor</option>
        </select>

        {formData.rol === 'profesor' && (
          <>
            <input
              type="text"
              name="materia"
              placeholder="Materia"
              value={formData.materia}
              onChange={handleChange}
              className="w-full mb-4 p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="text"
              name="experiencia"
              placeholder="Años de experiencia"
              value={formData.experiencia}
              onChange={handleChange}
              className="w-full mb-4 p-2 border border-gray-300 rounded"
              required
            />
            <textarea
              name="descripcion"
              placeholder="Descripción"
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full mb-4 p-2 border border-gray-300 rounded"
              required
            />
          </>
        )}

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Registrarse
        </button>

        {mensaje && <p className="mt-4 text-center text-red-500">{mensaje}</p>}
      </form>
    </div>
  );
}