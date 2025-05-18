import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function ReservasProfesor() {
  const router = useRouter();
  const { id } = router.query;

  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (!id) return;
    fetchReservas();
  }, [id]);

  const fetchReservas = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/reservas/profesor/${id}`);
      const data = await res.json();
      setReservas(data);
    } catch (error) {
      console.error('Error al cargar reservas:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelarReserva = async (id_clase) => {
    if (!confirm('¿Seguro que deseas cancelar esta reserva?')) return;
    try {
      const res = await fetch(`http://localhost:4000/api/reservas/${id_clase}/cancelar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al cancelar');

      setMensaje('✅ Reserva cancelada correctamente');
      fetchReservas();
    } catch (error) {
      setMensaje('❌ ' + error.message);
    }
  };

  if (loading) return <p className="p-6">Cargando reservas...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reservas del Profesor {id}</h1>

      {mensaje && <p className="mb-4 text-blue-600">{mensaje}</p>}

      {reservas.length === 0 ? (
        <p>No hay reservas registradas.</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-center">
              <th className="p-2">Fecha</th>
              <th className="p-2">Hora</th>
              <th className="p-2">Duración</th>
              <th className="p-2">Tema</th>
              <th className="p-2">Estudiante</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((r) => (
              <tr key={r.id_clase} className="text-center border-t">
                <td className="p-2">{new Date(r.fecha).toLocaleDateString()}</td>
                <td className="p-2">{r.hora?.slice(0, 5)}</td>
                <td className="p-2">{r.duracion ?? '-'}</td>
                <td className="p-2">{r.tema ?? '-'}</td>
                <td className="p-2">{r.estudiante}</td>
                <td className="p-2">
                  <button
                    onClick={() => cancelarReserva(r.id_clase)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Cancelar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}