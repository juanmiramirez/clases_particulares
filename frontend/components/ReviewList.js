import { useEffect, useState } from 'react';

export default function ReviewList({ profesorId }) {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
  if (!profesorId) return;

  fetch(`http://localhost:4000/api/resenas/profesor/${profesorId}`)
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        setReviews(data);
      } else {
        console.error("Respuesta inesperada:", data);
        setReviews([]);
        setError('No se pudieron cargar las reseñas.');
      }
    })
    .catch(err => {
      console.error("Error al obtener reseñas:", err);
      setError('Error al obtener reseñas');
    });
}, [profesorId]);

  if (error) {
    return <p className="text-red-500 mt-4">{error}</p>;
  }

  if (reviews.length === 0) {
    return <p className="text-gray-500 mt-4">No hay reseñas disponibles aún.</p>;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Reseñas de otros alumnos:</h3>
      {reviews.map((r, i) => (
        <div key={i} className="border border-gray-200 rounded p-4 mb-3 shadow-sm">
          <p className="font-semibold">Puntuación: 
            <span className="text-yellow-500 ml-2">
              {'★'.repeat(r.puntuacion || 0)}
              {'☆'.repeat(5 - (r.puntuacion || 0))}
            </span>
          </p>
          <p className="text-gray-700 mt-2">{r.comentario}</p>
          <p className="text-sm text-gray-400 mt-1">
            {r.creado_en ? new Date(r.creado_en).toLocaleDateString() : 'Fecha desconocida'}
          </p>
        </div>
      ))}
    </div>
  );
}