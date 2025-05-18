// frontend/components/ReservaModal.js
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { jwtDecode } from 'jwt-decode';


export default function ReservaModal({ profesorId, onClose, onReservado }) {
  const [fechaHora, setFechaHora] = useState(new Date());
  const [duracion, setDuracion] = useState(60);
  const [tema, setTema] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fechasOcupadas, setFechasOcupadas] = useState([]);

  useEffect(() => {
    const obtenerFechas = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/reservas/reservadas/${profesorId}`);
        const data = await res.json();
        const fechas = data.map(item => {
          const f = new Date(`${item.fecha}T${item.hora}`);
          return new Date(f.getFullYear(), f.getMonth(), f.getDate());
        });
        setFechasOcupadas(fechas);
      } catch (err) {
        console.error('Error al cargar fechas ocupadas', err);
      }
    };

    obtenerFechas();
  }, [profesorId]);

  const handleReservar = async () => {
    setLoading(true);
    setError('');

    const fechaLocal = new Date(fechaHora);
    const fechaFormateada = fechaLocal.toISOString().split('T')[0];
    const horaFormateada = fechaLocal.toTimeString().slice(0, 8);
    const token = localStorage.getItem('token');

    if (!token) {
      setError('⚠️ No has iniciado sesión');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/api/reservas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          id_profesor: profesorId,
          fecha: fechaFormateada,
          hora: horaFormateada,
          duracion,
          tema
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al reservar');

      onReservado(data);

      // 1. Decodificar token para obtener el id_estudiante
      const decoded = jwtDecode(token);
      const id_estudiante = decoded.id_usuario;
      const id_clase = data.id_clase;

      // 2. Crear sesión de pago en Stripe
      const pagoRes = await fetch('http://localhost:4000/api/pagos/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_clase,
          monto: 20.00, // puedes cambiar a un valor dinámico
          id_estudiante
        })
      });

      const pagoData = await pagoRes.json();
      if (!pagoRes.ok) throw new Error(pagoData.error || 'Error al iniciar el pago');

      // 3. Redirigir al checkout de Stripe
      window.location.href = pagoData.checkout_url;

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-80 shadow-xl">
        <h2 className="text-xl font-bold mb-4">Reservar clase</h2>

        <label className="block mb-2 text-sm font-medium">Fecha y hora</label>
        <DatePicker
          selected={fechaHora}
          onChange={setFechaHora}
          showTimeSelect
          dateFormat="Pp"
          className="w-full border rounded p-2 mb-4"
          excludeDates={fechasOcupadas}
          placeholderText="Selecciona fecha y hora"
        />

        <label className="block mb-2 text-sm font-medium">Duración (minutos)</label>
        <input
          type="number"
          value={duracion}
          onChange={e => setDuracion(Number(e.target.value))}
          className="w-full border rounded p-2 mb-4"
          min={15}
        />

        <label className="block mb-2 text-sm font-medium">Tema</label>
        <input
          type="text"
          value={tema}
          onChange={e => setTema(e.target.value)}
          className="w-full border rounded p-2 mb-4"
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleReservar}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Reservando…' : 'Reservar'}
          </button>
        </div>
      </div>
    </div>
  );
}