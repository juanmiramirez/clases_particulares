import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // ✅ añadido

export default function MisReservasEstudiante() {
  const [reservas, setReservas] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [avisos, setAvisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // ✅ añadido

  useEffect(() => {
    fetchReservas();
    fetchAvisos();
  }, []);

  const fetchReservas = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);

    if (!token) {
      setMensaje('⚠️ No has iniciado sesión');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/api/reservas/mis-reservas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setReservas(data);
    } catch (error) {
      setMensaje('❌ Error al cargar reservas');
    } finally {
      setLoading(false);
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

  const cancelarReserva = async (id_clase) => {
    if (!confirm('¿Seguro que deseas cancelar esta clase?')) return;

    try {
      const res = await fetch(`http://localhost:4000/api/reservas/${id_clase}/cancelar`, {
        method: 'PUT'
      });
      const data = await res.json();
      if (res.ok) {
        setMensaje('✅ Clase cancelada');
        fetchReservas();
      } else {
        setMensaje(data.error || 'Error al cancelar');
      }
    } catch (err) {
      console.error('Error al cancelar:', err);
      setMensaje('❌ Error al cancelar la reserva');
    }
  };

  const ahora = new Date();

  const futuras = reservas.filter(r => new Date(r.fecha) >= ahora);
  const pasadas = reservas.filter(r => new Date(r.fecha) < ahora);

  const renderTabla = (lista, esFuturo = true) => (
    <table className="w-full border border-gray-300 mb-8">
      <thead>
        <tr className="bg-gray-200 text-center">
          <th className="p-2">Fecha</th>
          <th className="p-2">Hora</th>
          <th className="p-2">Duración</th>
          <th className="p-2">Tema</th>
          <th className="p-2">Profesor</th>
          {esFuturo && <th className="p-2">Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {lista.map(r => (
          <tr key={r.id_clase} className="text-center border-t">
            <td className="p-2">{new Date(r.fecha).toLocaleDateString()}</td>
            <td className="p-2">{r.hora?.slice(0, 5) ?? '-'}</td>
            <td className="p-2">{r.duracion ?? '-'}</td>
            <td className="p-2">{r.tema ?? '-'}</td>
            <td className="p-2">{r.profesor}</td>
            {esFuturo && (
              <td className="p-2 space-x-2">
                <button
                  onClick={() => router.push(`/clase/${r.id_clase}`)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  💬 Chat
                </button>
                <button
                  onClick={() => cancelarReserva(r.id_clase)}
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
      <h1 className="text-2xl font-bold mb-4">Mis reservas</h1>

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

      {loading ? (
        <p>Cargando reservas...</p>
      ) : reservas.length === 0 ? (
        <p>No tienes reservas registradas.</p>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-2">📅 Próximas clases</h2>
          {futuras.length > 0 ? renderTabla(futuras, true) : <p>No tienes clases futuras.</p>}

          <h2 className="text-xl font-semibold mb-2 mt-8">📘 Clases ya realizadas</h2>
          {pasadas.length > 0 ? renderTabla(pasadas, false) : <p>No tienes clases pasadas aún.</p>}
        </>
      )}
    </div>
  );
}