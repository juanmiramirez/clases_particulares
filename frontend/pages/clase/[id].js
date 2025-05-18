import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Chat from '@/components/Chat';

export default function ClaseDetalle() {
  const router = useRouter();
  const { id } = router.query;

  const [clase, setClase] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(payload);
    } catch {
      localStorage.removeItem('token');
      router.push('/login');
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchClase = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/clases/${id}`);
        const data = await res.json();

        // ✅ corrección aquí
        if (data && data.id_clase) {
          setClase(data);
        } else {
          throw new Error('Clase no encontrada');
        }
      } catch (error) {
        console.error('Error al obtener la clase:', error);
        router.push('/index-menu');
      } finally {
        setLoading(false);
      }
    };

    fetchClase();
  }, [id]);

  if (loading || !clase || !user) {
    return <p className="p-6">Cargando clase...</p>;
  }

  const esParticipante = [clase.id_profesor, clase.id_estudiante].includes(user.id_usuario);
  if (!esParticipante) {
    return <p className="p-6 text-red-600">No tienes permiso para ver esta clase.</p>;
  }

  const idEmisor = user.id_usuario;
  const idReceptor = user.id_usuario === clase.id_profesor
    ? clase.id_estudiante
    : clase.id_profesor;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🧾 Detalles de la Clase #{clase.id_clase}</h1>

      <div className="bg-white border p-4 rounded shadow mb-6">
        <p><strong>Profesor:</strong> {clase.profesor_nombre} (ID {clase.id_profesor})</p>
        <p><strong>Estudiante:</strong> {clase.estudiante_nombre} (ID {clase.id_estudiante})</p>
        <p><strong>Fecha:</strong> {new Date(clase.fecha).toLocaleDateString()}</p>
        <p><strong>Hora:</strong> {clase.hora}</p>
        <p><strong>Estado:</strong> {clase.estado}</p>
        {clase.tema && <p><strong>Tema:</strong> {clase.tema}</p>}
      </div>

      <Chat
        idClase={clase.id_clase}
        idEmisor={idEmisor}
        idReceptor={idReceptor}
      />
    </div>
  );
}