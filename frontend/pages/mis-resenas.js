import { useEffect, useState } from 'react';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';

export default function MisResenas() {
  const [clases, setClases] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(true);
  const [reseñadas, setReseñadas] = useState(new Set());

  useEffect(() => {
    fetchResenasPendientes();
  }, []);

  const fetchResenasPendientes = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) return setMensaje('⚠️ No has iniciado sesión');

    try {
      const res = await fetch('http://localhost:4000/api/resenas/mis-clases-pasadas', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al obtener clases');
      setClases(data);
      const reseñadasSet = new Set(data.filter(c => c.resena_id).map(c => c.id_clase));
      setReseñadas(reseñadasSet);
    } catch (err) {
      setMensaje('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResenaEnviada = () => {
    setMensaje('✅ Reseña enviada correctamente');
    fetchResenasPendientes();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mis clases pasadas y reseñas</h1>

      {mensaje && <p className="text-blue-600 mb-4">{mensaje}</p>}

      {loading ? (
        <p>Cargando clases pasadas...</p>
      ) : clases.length === 0 ? (
        <p>No tienes clases pasadas aún.</p>
      ) : (
        <ul className="space-y-6">
          {clases.map((clase) => (
            <li key={clase.id_clase} className="border p-4 rounded shadow">
              <p><strong>Fecha:</strong> {new Date(clase.fecha).toLocaleDateString()} — {clase.hora?.slice(0, 5)}</p>
              <p><strong>Profesor:</strong> {clase.profesor}</p>
              <p><strong>Tema:</strong> {clase.tema ?? '-'}</p>

              {reseñadas.has(clase.id_clase) ? (
                <>
                  <p className="mt-2 text-green-700">Ya reseñada.</p>
                  <ReviewList idClase={clase.id_clase} />
                </>
              ) : (
                <div className="mt-2">
                  <ReviewForm idClase={clase.id_clase} onNuevaReview={handleResenaEnviada} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}