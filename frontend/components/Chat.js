import { useEffect, useState } from 'react';

export default function Chat({ idClase, idEmisor, idReceptor }) {
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchMensajes = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/chat/${idClase}`);
      const data = await res.json();
      setMensajes(data);
    } catch (err) {
      console.error('Error al cargar mensajes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMensajes();
    const intervalo = setInterval(fetchMensajes, 5000); // actualiza cada 5s
    return () => clearInterval(intervalo);
  }, []);

  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim()) return;

    try {
      const res = await fetch(`http://localhost:4000/api/chat/${idClase}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_emisor: idEmisor,
          id_receptor: idReceptor,
          contenido: nuevoMensaje,
        }),
      });

      if (res.ok) {
        setNuevoMensaje('');
        fetchMensajes(); // actualiza inmediatamente
      }
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
    }
  };

  return (
    <div className="bg-white border rounded shadow p-4 max-w-xl mx-auto mt-6">
      <h2 className="text-lg font-bold mb-4">💬 Chat de la clase #{idClase}</h2>

      {loading ? (
        <p>Cargando mensajes...</p>
      ) : (
        <div className="h-64 overflow-y-auto border p-3 mb-4 bg-gray-50 rounded">
          {mensajes.length === 0 ? (
            <p className="text-gray-500">No hay mensajes todavía.</p>
          ) : (
            mensajes.map((msg) => (
              <div
                key={msg.id_mensaje}
                className={`mb-2 ${
                  msg.id_emisor === idEmisor ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block px-3 py-2 rounded-lg ${
                    msg.id_emisor === idEmisor
                      ? 'bg-blue-200'
                      : 'bg-green-200'
                  }`}
                >
                  <p className="text-sm">{msg.contenido}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(msg.fecha_envio).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="flex space-x-2">
        <input
          type="text"
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-grow border p-2 rounded"
        />
        <button
          onClick={enviarMensaje}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}