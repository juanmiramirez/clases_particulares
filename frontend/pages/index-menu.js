import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function IndexMenu() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); // Redirige si no hay sesión
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Plataforma de Clases Particulares</h1>

      {user && (
        <>
          <p className="mb-4 text-lg">
            Bienvenido, <strong>{user.nombre}</strong> ({user.rol})
          </p>

          {user.rol === 'estudiante' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-6">
              <button
                onClick={() => router.push('/profesores')}
                className="bg-blue-600 text-white p-4 rounded shadow hover:bg-blue-700"
              >
                🔍 Buscar Clases
              </button>
              <button
                onClick={() => router.push('/reservas-estudiante')}
                className="bg-green-600 text-white p-4 rounded shadow hover:bg-green-700"
              >
                📅 Mis Reservas
              </button>
              <button
                onClick={() => router.push('/mis-resenas')}
                className="bg-purple-600 text-white p-4 rounded shadow hover:bg-purple-700"
              >
                🌟 Mis Reseñas
              </button>
            </div>
          )}

          {user.rol === 'profesor' && (
            <div className="mb-6">
              <button
                onClick={() => router.push('/mis-clases')}
                className="px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                🎓 Ir a mis clases
              </button>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Cerrar sesión
          </button>
        </>
      )}
    </div>
  );
}