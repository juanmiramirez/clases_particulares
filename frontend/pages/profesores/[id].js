// frontend/pages/profesores/[id].js

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ReservaModal from '../../components/ReservaModal'

export default function DetalleProfesor() {
  const router = useRouter()
  const { id } = router.query

  const [profesor, setProfesor] = useState(null)
  const [reseñas, setReseñas] = useState([])
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [reserva, setReserva] = useState(null)

  useEffect(() => {
    if (!id) return

    // Obtener datos del profesor
    fetch(`http://localhost:4000/api/profesores/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error)
        setProfesor(data)
      })
      .catch(err => setError(err.message))

    // Obtener reseñas del profesor
    fetch(`http://localhost:4000/api/resenas/profesor/${id}`)
      .then(r => r.json())
      .then(data => setReseñas(data))
      .catch(() => setReseñas([]))
  }, [id])

  if (error) return <p className="text-red-600 mt-6 text-center">{error}</p>
  if (!profesor) return <p className="mt-6 text-center">Cargando profesor…</p>

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden mt-10">
      {/* DETALLE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <div className="flex justify-center items-start">
          {profesor.foto_perfil ? (
            <img
              src={`http://localhost:4000/uploads/${profesor.foto_perfil}`}
              alt={`${profesor.nombre} foto`}
              className="w-40 h-40 rounded-full object-cover shadow"
            />
          ) : (
            <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              Sin foto
            </div>
          )}
        </div>
        <div className="col-span-2">
          <h1 className="text-3xl font-extrabold mb-2">{profesor.nombre}</h1>
          <p><strong>Correo:</strong> {profesor.correo}</p>
          <p><strong>Especialidades:</strong> {profesor.especialidades}</p>
          <p><strong>Experiencia:</strong> {profesor.experiencia}</p>
          <p className="mb-4"><strong>Descripción:</strong> {profesor.descripcion}</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Reservar Clase
          </button>
          {reserva && (
            <p className="mt-3 text-green-700">
              ¡Reserva confirmada para {new Date(reserva.fecha_hora).toLocaleString()}!
            </p>
          )}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <ReservaModal
          profesorId={profesor.id_usuario}
          onClose={() => setShowModal(false)}
          onReservado={r => setReserva(r)}
        />
      )}

      {/* RESEÑAS DE ESTUDIANTES */}
      <div className="border-t border-gray-200 px-6 py-6">
        <h2 className="text-2xl font-bold mb-4">Reseñas de estudiantes</h2>
        {reseñas.length === 0 ? (
          <p className="text-gray-500">No hay reseñas disponibles aún.</p>
        ) : (
          <ul className="space-y-4">
            {reseñas.map((r) => (
              <li key={r.id_reseña} className="border p-4 rounded shadow-sm bg-white">
                <p className="text-yellow-500 mb-1">
                  {'★'.repeat(r.puntuacion)}{'☆'.repeat(5 - r.puntuacion)}
                </p>
                <p className="text-sm italic mb-2 text-gray-600">Alumno: {r.estudiante}</p>
                <p className="text-gray-800">{r.comentario}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(r.fecha).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}