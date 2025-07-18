import React, { useState } from 'react';
import Login from '../components/Login';
import { fetchWithAuth } from '../services/auth';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('jwt'));
  const [username, setUsername] = useState('');

  const handleLogin = (jwt: string, user: string) => {
    setToken(jwt);
    setUsername(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setToken(null);
    setUsername('');
  };

  // Ejemplo de request protegida
  const getProtectedData = async () => {
    const res = await fetchWithAuth('http://localhost:8080/api/messages/General');
    const data = await res.json();
    alert(JSON.stringify(data));
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 24 }}>
      <h2>Bienvenido, {username || 'usuario'}!</h2>
      <button onClick={handleLogout}>Cerrar sesión</button>
      <button onClick={getProtectedData} style={{ marginLeft: 12 }}>
        Probar endpoint protegido
      </button>
    </div>
  );
}
