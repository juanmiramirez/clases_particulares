import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(payload);
    } catch {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [router.asPath]); // 🔄 detecta cambio de ruta para actualizar el navbar

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center shadow">
      <div className="flex space-x-4 items-center">
        <button onClick={() => router.push('/index-menu')} className="hover:text-gray-300 font-semibold">
          Inicio
        </button>

        {!user && (
          <>
            <button onClick={() => router.push('/login')} className="hover:text-gray-300">
              Iniciar sesión
            </button>
            <button onClick={() => router.push('/register')} className="hover:text-gray-300">
              Registrarse
            </button>
            <button onClick={() => router.push('/registro-profesor')} className="hover:text-gray-300">
              Registrar profesor
            </button>
          </>
        )}

        {user?.rol === 'estudiante' && (
          <>
            <button onClick={() => router.push('/profesores')} className="hover:text-gray-300">
              Buscar clases
            </button>
            <button onClick={() => router.push('/reservas-estudiante')} className="hover:text-gray-300">
              Mis reservas
            </button>
            <button onClick={() => router.push('/mis-resenas')} className="hover:text-gray-300">
              Mis reseñas
            </button>
          </>
        )}

        {user?.rol === 'profesor' && (
          <button onClick={() => router.push('/mis-clases')} className="hover:text-gray-300">
            Mis clases
          </button>
        )}
      </div>

      {user && (
        <div className="flex items-center space-x-4">
          <span className="text-sm italic hidden sm:inline">👤 {user.nombre}</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-sm"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  );
}