import { useState } from 'react';

export default function ReviewForm({ idClase, onNuevaReview }) {
  const [comentario, setComentario] = useState('');
  const [puntuacion, setPuntuacion] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/resenas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          id_clase: idClase,
          comentario,
          puntuacion
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al enviar reseña');
      onNuevaReview(data);
      setComentario('');
      setPuntuacion(5);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Deja tu reseña</h3>

      <label className="block mb-2">
        Puntuación:
        <select
          value={puntuacion}
          onChange={e => setPuntuacion(+e.target.value)}
          className="ml-2 border rounded p-1"
        >
          {[5, 4, 3, 2, 1].map(n => (
            <option key={n} value={n}>
              {'★'.repeat(n)}{'☆'.repeat(5 - n)}
            </option>
          ))}
        </select>
      </label>

      <label className="block mb-4">
        Comentario:
        <textarea
          required
          rows={3}
          value={comentario}
          onChange={e => setComentario(e.target.value)}
          className="w-full border rounded p-2 mt-1"
        />
      </label>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
      >
        {loading ? 'Enviando…' : 'Enviar reseña'}
      </button>
    </form>
  );
}