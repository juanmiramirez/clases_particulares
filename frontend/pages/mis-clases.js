import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // ✅ Añadido

export default function MisClasesProfesor() {
  const [clases, setClases] = useState([]);
  const [avisos, setAvisos] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const router = useRouter(); // ✅ Añadido

  useEffect(() => {
    fetchClases();
    fetchAvisos();
  }, []);

  const fetchClases = async () => {
    const token = localStorage.getItem('token');
    if (!token) return setMensaje('⚠️ No has iniciado sesión');

    try {
      const res = await fetch('http://localhost:4000/api/reservas/mis-clases', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setClases(data);
    } catch (err) {
      setMensaje('❌ Error al cargar clases');
    }
  };

  const fetchAvisos = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:4000/api/reservas/avisos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setAvisos(data);
    } catch (err) {
      console.error('Error al cargar avisos:', err);
    }
  };

  const cancelarClase = async (id_clase) => {
    if (!confirm('¿Seguro que deseas cancelar esta clase?')) return;
    try {
      const res = await fetch(`http://localhost:4000/api/reservas/${id_clase}/cancelar`, {
        method: 'PUT'
      });
      const data = await res.json();
      if (res.ok) {
        setMensaje('✅ Clase cancelada');
        fetchClases();
      } else {
        setMensaje(data.error || 'Error al cancelar');
      }
    } catch (err) {
      console.error('Error al cancelar:', err);
      setMensaje('❌ Error al cancelar clase');
    }
  };

  const ahora = new Date();
  const futuras = clases.filter(c => new Date(c.fecha) >= ahora);
  const pasadas = clases.filter(c => new Date(c.fecha) < ahora);

  const renderTabla = (lista, esFuturo = true) => (
    <table className="w-full border border-gray-300 mt-4">
      <thead className="bg-gray-200 text-sm text-center">
        <tr>
          <th className="p-2">Fecha</th>
          <th className="p-2">Hora</th>
          <th className="p-2">Duración</th>
          <th className="p-2">Tema</th>
          <th className="p-2">Estudiante</th>
          {esFuturo && <th className="p-2">Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {lista.map(c => (
          <tr key={c.id_clase} className="text-center border-t">
            <td className="p-2">{new Date(c.fecha).toLocaleDateString()}</td>
            <td className="p-2">{c.hora?.slice(0, 5)}</td>
            <td className="p-2">{c.duracion ?? '-'}</td>
            <td className="p-2">{c.tema ?? '-'}</td>
            <td className="p-2">{c.estudiante}</td>
            {esFuturo && (
              <td className="p-2 space-x-2">
                <button
                  onClick={() => router.push(`/clase/${c.id_clase}`)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  💬 Chat
                </button>
                <button
                  onClick={() => cancelarClase(c.id_clase)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                >
                  Cancelar
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mis clases como profesor</h1>

      {avisos.length > 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
          <h3 className="font-semibold text-yellow-800">📢 Aviso:</h3>
          <ul className="list-disc list-inside mt-2 text-sm text-yellow-800">
            {avisos.map(a => (
              <li key={a.id_clase}>
                Tienes una clase mañana a las {a.hora.slice(0, 5)} sobre "{a.tema}" con {a.con_quien}.
              </li>
            ))}
          </ul>
        </div>
      )}

      {mensaje && <p className="text-blue-600 mb-4">{mensaje}</p>}

      {futuras.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mt-4">📅 Próximas clases</h2>
          {renderTabla(futuras, true)}
        </>
      )}

      {pasadas.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mt-6">📘 Clases ya realizadas</h2>
          {renderTabla(pasadas, false)}
        </>
      )}

      {clases.length === 0 && <p className="mt-4">No tienes clases registradas.</p>}
    </div>
  );
}