import { useState } from 'react';
import { useRouter } from 'next/router'; 

export default function Login() {
  const router = useRouter(); 
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contraseña })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Error en login');

      localStorage.setItem('token', data.token);
      setMensaje('¡Login correcto!');

      router.push('/index-menu');

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-gray-100 p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">Iniciar sesión</h2>

        <label className="block mb-2 text-sm">Correo electrónico</label>
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-4"
          required
        />

        <label className="block mb-2 text-sm">Contraseña</label>
        <input
          type="password"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-4"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Entrar
        </button>

        {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
        {mensaje && <p className="mt-4 text-green-600 text-sm">{mensaje}</p>}
      </form>
    </div>
  );
}