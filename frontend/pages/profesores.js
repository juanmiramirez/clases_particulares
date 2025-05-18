import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Profesores() {
  const [profesores, setProfesores] = useState([]);
  const [profesoresFiltrados, setProfesoresFiltrados] = useState([]);
  const [error, setError] = useState('');
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroRol, setFiltroRol] = useState('');
  const [filtroMateria, setFiltroMateria] = useState('');

  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/profesores');
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Error al cargar profesores');

        setProfesores(data);
        setProfesoresFiltrados(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProfesores();
  }, []);

  const aplicarFiltros = () => {
    const resultado = profesores.filter((prof) => {
      const coincideNombre = prof.nombre?.toLowerCase().includes(filtroNombre.toLowerCase());
      const coincideRol = filtroRol ? prof.rol === filtroRol : true;
      const coincideMateria = filtroMateria
        ? prof.materia?.toLowerCase().includes(filtroMateria.toLowerCase())
        : true;

      return coincideNombre && coincideRol && coincideMateria;
    });

    setProfesoresFiltrados(resultado);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">Profesores disponibles</h1>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
          placeholder="Buscar por nombre"
          className="px-4 py-2 border rounded shadow-sm"
        />
        <select
          value={filtroRol}
          onChange={(e) => setFiltroRol(e.target.value)}
          className="px-4 py-2 border rounded shadow-sm"
        >
          <option value="">Todos los roles</option>
          <option value="profesor">Profesores</option>
          <option value="estudiante">Estudiantes</option>
        </select>
        <input
          type="text"
          value={filtroMateria}
          onChange={(e) => setFiltroMateria(e.target.value)}
          placeholder="Buscar por materia"
          className="px-4 py-2 border rounded shadow-sm"
        />
        <button
          onClick={aplicarFiltros}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow-sm"
        >
          Buscar
        </button>
      </div>

      {error && <p className="text-red-600 text-center">{error}</p>}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {profesoresFiltrados.map((prof) => {
          console.log('PROFESOR:', prof);
          return (
            <Link key={prof.id_usuario} href={`/profesores/${prof.id_usuario}`}>
              <div className="bg-white p-6 rounded shadow cursor-pointer hover:bg-gray-100 transition">
                <h2 className="text-xl font-semibold">{prof.nombre}</h2>
                <p className="text-gray-600">Correo: {prof.correo}</p>
                <p className="text-gray-500 text-sm">Rol: {prof.rol}</p>

                {prof.materia && (
                  <p className="text-sm text-blue-600 mt-1 underline">
                    Especialidad: {prof.materia}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}